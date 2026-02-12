import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../shared/models/cart_item.dart';
import '../../shared/models/product.dart';

class CartStore extends ChangeNotifier {
  static const _storageKey = 'amazirian_cart_v1';

  final Map<String, CartItem> _itemsById = {};

  List<CartItem> get items =>
      _itemsById.values.toList()
        ..sort((a, b) => a.product.title.compareTo(b.product.title));

  int get itemCount =>
      _itemsById.values.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal =>
      _itemsById.values.fold(0.0, (sum, item) => sum + item.lineTotal);

  Future<void> loadFromStorage(Map<String, Product> productsById) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_storageKey);
    if (raw == null || raw.isEmpty) return;

    final decoded = jsonDecode(raw);
    if (decoded is! List) return;

    _itemsById.clear();

    for (final row in decoded) {
      if (row is! Map) continue;
      final id = row['id'];
      final qty = row['qty'];
      if (id is! String || qty is! int) continue;

      final product = productsById[id];
      if (product == null) continue;
      if (qty <= 0) continue;

      _itemsById[id] = CartItem(product: product, quantity: qty);
    }

    notifyListeners();
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    final payload = _itemsById.values
        .map((i) => {'id': i.product.id, 'qty': i.quantity})
        .toList();
    await prefs.setString(_storageKey, jsonEncode(payload));
  }

  Future<void> add(Product product, {int quantity = 1}) async {
    final existing = _itemsById[product.id];
    final newQty = (existing?.quantity ?? 0) + quantity;
    _itemsById[product.id] = CartItem(product: product, quantity: newQty);
    notifyListeners();
    await _save();
  }

  Future<void> setQuantity(Product product, int quantity) async {
    if (quantity <= 0) {
      _itemsById.remove(product.id);
    } else {
      _itemsById[product.id] = CartItem(product: product, quantity: quantity);
    }
    notifyListeners();
    await _save();
  }

  Future<void> remove(Product product) async {
    _itemsById.remove(product.id);
    notifyListeners();
    await _save();
  }

  Future<void> clear() async {
    _itemsById.clear();
    notifyListeners();
    await _save();
  }
}

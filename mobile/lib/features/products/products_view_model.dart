import 'package:flutter/foundation.dart';

import '../../shared/models/product.dart';
import 'product_repository.dart';

class ProductsViewModel extends ChangeNotifier {
  final ProductRepository _repo;

  ProductsViewModel(this._repo);

  final List<Product> _all = [];
  String _query = '';
  String _category = 'Alle';

  List<Product> get all => List.unmodifiable(_all);

  String get query => _query;
  String get category => _category;

  List<String> get categories {
    final unique = <String>{'Alle'};
    for (final p in _all) {
      unique.add(p.category);
    }
    return unique.toList();
  }

  List<Product> get filtered {
    final q = _query.trim().toLowerCase();
    return _all.where((p) {
      final matchesQuery =
          q.isEmpty ||
          p.title.toLowerCase().contains(q) ||
          p.category.toLowerCase().contains(q);
      final matchesCategory = _category == 'Alle' || p.category == _category;
      return matchesQuery && matchesCategory;
    }).toList();
  }

  void load() {
    if (_all.isNotEmpty) return;
    _all.addAll(_repo.getAll());
    notifyListeners();
  }

  void setQuery(String value) {
    _query = value;
    notifyListeners();
  }

  void setCategory(String value) {
    _category = value;
    notifyListeners();
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../shared/models/cart_item.dart';
import '../../../shared/ui/formatters.dart';
import '../cart_store.dart';
import 'checkout_screen.dart';

class CartScreen extends StatelessWidget {
  final VoidCallback? onBrowseProducts;

  const CartScreen({super.key, this.onBrowseProducts});

  @override
  Widget build(BuildContext context) {
    return Consumer<CartStore>(
      builder: (context, cart, _) {
        return Scaffold(
          appBar: AppBar(title: const Text('Kurv')),
          body: cart.items.isEmpty
              ? _EmptyCart(onBrowseProducts: onBrowseProducts)
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    for (final item in cart.items) _CartLine(item: item),
                    const SizedBox(height: 16),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Subtotal'),
                                Text(
                                  formatPrice(cart.subtotal),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              child: FilledButton(
                                onPressed: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => const CheckoutScreen(),
                                    ),
                                  );
                                },
                                child: const Text('Gå til checkout'),
                              ),
                            ),
                            const SizedBox(height: 8),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton(
                                onPressed: () => cart.clear(),
                                child: const Text('Ryd kurv'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
        );
      },
    );
  }
}

class _CartLine extends StatelessWidget {
  final CartItem item;

  const _CartLine({required this.item});

  @override
  Widget build(BuildContext context) {
    final cart = context.read<CartStore>();

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: SizedBox(
                width: 88,
                height: 88,
                child: Image.network(
                  item.product.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (context, _, __) {
                    return Container(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest,
                      child: const Center(
                        child: Icon(Icons.image_not_supported_outlined),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.product.title,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.product.category,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        formatPrice(item.lineTotal),
                        style: const TextStyle(fontWeight: FontWeight.w800),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            onPressed: item.quantity <= 1
                                ? null
                                : () => cart.setQuantity(
                                    item.product,
                                    item.quantity - 1,
                                  ),
                            icon: const Icon(Icons.remove_circle_outline),
                          ),
                          Text(item.quantity.toString()),
                          IconButton(
                            onPressed: () => cart.setQuantity(
                              item.product,
                              item.quantity + 1,
                            ),
                            icon: const Icon(Icons.add_circle_outline),
                          ),
                          IconButton(
                            onPressed: () => cart.remove(item.product),
                            icon: const Icon(Icons.delete_outline),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyCart extends StatelessWidget {
  final VoidCallback? onBrowseProducts;

  const _EmptyCart({this.onBrowseProducts});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.shopping_cart_outlined,
              size: 64,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            const SizedBox(height: 12),
            Text(
              'Din kurv er tom',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Gå til Produkter og læg noget i kurven.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            if (onBrowseProducts != null) ...[
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onBrowseProducts,
                icon: const Icon(Icons.storefront),
                label: const Text('Se produkter'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

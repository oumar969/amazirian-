import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../shared/models/product.dart';
import '../../../shared/ui/formatters.dart';
import '../../cart/cart_store.dart';
import '../widgets/rating_row.dart';

class ProductDetailsScreen extends StatefulWidget {
  final Product product;

  const ProductDetailsScreen({super.key, required this.product});

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  int _qty = 1;

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    return Scaffold(
      appBar: AppBar(title: const Text('Se produkt')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: AspectRatio(
              aspectRatio: 16 / 10,
              child: Image.network(
                p.imageUrl,
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
          const SizedBox(height: 14),
          Text(
            p.title,
            style: Theme.of(
              context,
            ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 6),
          RatingRow(rating: p.rating, count: p.ratingCount),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              Chip(label: Text(p.category)),
              const Chip(label: Text('Prime')),
              const Chip(label: Text('Returnering 30 dage')),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            formatPrice(p.price),
            style: Theme.of(
              context,
            ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          Text(p.description, style: Theme.of(context).textTheme.bodyLarge),
          const SizedBox(height: 18),
          Row(
            children: [
              Text('Antal', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(width: 12),
              _QtyControl(
                value: _qty,
                onChanged: (v) => setState(() => _qty = v),
              ),
            ],
          ),
          const SizedBox(height: 18),
          FilledButton.icon(
            onPressed: () async {
              await context.read<CartStore>().add(p, quantity: _qty);
              if (!context.mounted) return;
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Lagt i kurv')));
            },
            icon: const Icon(Icons.add_shopping_cart),
            label: const Text('Læg i kurv'),
          ),
          const SizedBox(height: 10),
          OutlinedButton.icon(
            onPressed: () async {
              await context.read<CartStore>().add(p, quantity: _qty);
              if (!context.mounted) return;
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Klar til checkout (gå til Kurv)'),
                ),
              );
            },
            icon: const Icon(Icons.flash_on),
            label: const Text('Køb nu'),
          ),
        ],
      ),
    );
  }
}

class _QtyControl extends StatelessWidget {
  final int value;
  final ValueChanged<int> onChanged;

  const _QtyControl({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            onPressed: value <= 1 ? null : () => onChanged(value - 1),
            icon: const Icon(Icons.remove),
          ),
          Text(
            value.toString(),
            style: Theme.of(context).textTheme.titleMedium,
          ),
          IconButton(
            onPressed: () => onChanged(value + 1),
            icon: const Icon(Icons.add),
          ),
        ],
      ),
    );
  }
}

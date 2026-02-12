import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../shared/models/product.dart';
import '../products_view_model.dart';
import '../widgets/product_card.dart';
import 'product_details_screen.dart';

class ProductsScreen extends StatelessWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductsViewModel>(
      builder: (context, vm, _) {
        vm.load();

        return Scaffold(
          appBar: AppBar(
            title: const Text('Produkter'),
            actions: [
              IconButton(
                tooltip: 'Søg',
                onPressed: () {
                  showSearch(
                    context: context,
                    delegate: _ProductSearchDelegate(vm),
                  );
                },
                icon: const Icon(Icons.search),
              ),
            ],
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      onChanged: vm.setQuery,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.search),
                        hintText: 'Søg efter produkter…',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  DropdownButton<String>(
                    value: vm.category,
                    items: [
                      for (final c in vm.categories)
                        DropdownMenuItem(value: c, child: Text(c)),
                    ],
                    onChanged: (value) {
                      if (value != null) vm.setCategory(value);
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                '${vm.filtered.length} produkter',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 12),
              LayoutBuilder(
                builder: (context, constraints) {
                  final width = constraints.maxWidth;
                  final crossAxisCount = width >= 900
                      ? 4
                      : width >= 600
                      ? 3
                      : 2;

                  return GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: vm.filtered.length,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossAxisCount,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.74,
                    ),
                    itemBuilder: (context, index) {
                      final product = vm.filtered[index];
                      return ProductCard(
                        product: product,
                        onTap: () => _openDetails(context, product),
                      );
                    },
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _openDetails(BuildContext context, Product product) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => ProductDetailsScreen(product: product)),
    );
  }
}

class _ProductSearchDelegate extends SearchDelegate<void> {
  final ProductsViewModel vm;

  _ProductSearchDelegate(this.vm);

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      IconButton(onPressed: () => query = '', icon: const Icon(Icons.clear)),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      onPressed: () => close(context, null),
      icon: const Icon(Icons.arrow_back),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    vm.setQuery(query);
    close(context, null);
    return const SizedBox.shrink();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final q = query.trim().toLowerCase();
    final suggestions = vm.all.where((p) {
      if (q.isEmpty) return true;
      return p.title.toLowerCase().contains(q) ||
          p.category.toLowerCase().contains(q);
    }).toList();

    return ListView.separated(
      itemCount: suggestions.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, i) {
        final p = suggestions[i];
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: Theme.of(
              context,
            ).colorScheme.surfaceContainerHighest,
            backgroundImage: NetworkImage(p.imageUrl),
          ),
          title: Text(p.title),
          subtitle: Text(p.category),
          onTap: () {
            vm.setQuery(p.title);
            close(context, null);
          },
        );
      },
    );
  }
}

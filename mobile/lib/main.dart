import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/app_config.dart';
import 'features/cart/cart_store.dart';
import 'features/cart/screens/cart_screen.dart';
import 'features/products/product_repository.dart';
import 'features/products/products_view_model.dart';
import 'features/products/screens/products_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(create: (_) => const ProductRepository()),
        ChangeNotifierProvider(
          create: (context) =>
              ProductsViewModel(context.read<ProductRepository>())..load(),
        ),
        ChangeNotifierProvider(create: (_) => CartStore()),
      ],
      child: MaterialApp(
        title: 'Amazirian',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B3B2E)),
          useMaterial3: true,
        ),
        home: const AppRoot(),
      ),
    );
  }
}

class AppRoot extends StatefulWidget {
  const AppRoot({super.key});

  @override
  State<AppRoot> createState() => _AppRootState();
}

class _AppRootState extends State<AppRoot> {
  int _index = 0;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final productsVm = context.read<ProductsViewModel>();
      final productsById = {for (final p in productsVm.all) p.id: p};
      await context.read<CartStore>().loadFromStorage(productsById);
    });
  }

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      const ProductsScreen(),
      CartScreen(onBrowseProducts: () => setState(() => _index = 0)),
      const _InfoScreen(),
    ];

    return Scaffold(
      body: pages[_index],
      bottomNavigationBar: Consumer<CartStore>(
        builder: (context, cart, _) {
          return NavigationBar(
            selectedIndex: _index,
            onDestinationSelected: (i) => setState(() => _index = i),
            destinations: [
              const NavigationDestination(
                icon: Icon(Icons.storefront_outlined),
                selectedIcon: Icon(Icons.storefront),
                label: 'Produkter',
              ),
              NavigationDestination(
                icon: Badge(
                  isLabelVisible: cart.itemCount > 0,
                  label: Text(cart.itemCount.toString()),
                  child: const Icon(Icons.shopping_cart_outlined),
                ),
                selectedIcon: Badge(
                  isLabelVisible: cart.itemCount > 0,
                  label: Text(cart.itemCount.toString()),
                  child: const Icon(Icons.shopping_cart),
                ),
                label: 'Kurv',
              ),
              const NavigationDestination(
                icon: Icon(Icons.info_outline),
                selectedIcon: Icon(Icons.info),
                label: 'Info',
              ),
            ],
          );
        },
      ),
    );
  }
}

class _InfoScreen extends StatelessWidget {
  const _InfoScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Info')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('API_BASE: ${AppConfig.apiBase}'),
          const SizedBox(height: 8),
          Text('WEB_BASE: ${AppConfig.webBase}'),
          const SizedBox(height: 16),
          Text(
            'Næste step: koble Flutter appen på samme backend/data som web.',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
        ],
      ),
    );
  }
}

import '../../shared/models/product.dart';

class ProductRepository {
  const ProductRepository();

  /// Midlertidig seed-data (offline), indtil vi kobler på backend.
  List<Product> getAll() {
    return const [
      Product(
        id: 'p1',
        title: 'Amazirian Wireless Headset',
        category: 'Elektronik',
        price: 349.0,
        rating: 4.6,
        ratingCount: 1328,
        imageUrl:
            'https://images.unsplash.com/photo-1518441317200-a18c33f8e8aa?auto=format&fit=crop&w=1200&q=80',
        description:
            'Komfortabelt headset med god lyd, mikrofon og lang batteritid. Perfekt til arbejde og gaming.',
      ),
      Product(
        id: 'p2',
        title: 'Premium Kaffemaskine',
        category: 'Hjem',
        price: 799.0,
        rating: 4.4,
        ratingCount: 642,
        imageUrl:
            'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=80',
        description:
            'Bryg kaffe på få minutter. Nem rengøring, stærk aroma og elegant design.',
      ),
      Product(
        id: 'p3',
        title: 'Sneakers (Limited)',
        category: 'Mode',
        price: 499.0,
        rating: 4.8,
        ratingCount: 210,
        imageUrl:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        description:
            'Let og komfortabel sneaker med moderne look. Passer til både hverdag og weekend.',
      ),
      Product(
        id: 'p4',
        title: 'Smart Watch',
        category: 'Elektronik',
        price: 599.0,
        rating: 4.2,
        ratingCount: 980,
        imageUrl:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        description:
            'Track aktivitet, puls og notifikationer. Vandafvisende og med flot skærm.',
      ),
      Product(
        id: 'p5',
        title: 'Køkkenknivsæt',
        category: 'Hjem',
        price: 259.0,
        rating: 4.5,
        ratingCount: 354,
        imageUrl:
            'https://images.unsplash.com/photo-1593618998163-0d9f8b83d3aa?auto=format&fit=crop&w=1200&q=80',
        description:
            'Skarpe knive i et komplet sæt. God balance og behageligt greb.',
      ),
    ];
  }
}

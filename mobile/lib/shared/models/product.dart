class Product {
  final String id;
  final String title;
  final String category;
  final double price;
  final double rating;
  final int ratingCount;
  final String imageUrl;
  final String description;

  const Product({
    required this.id,
    required this.title,
    required this.category,
    required this.price,
    required this.rating,
    required this.ratingCount,
    required this.imageUrl,
    required this.description,
  });
}

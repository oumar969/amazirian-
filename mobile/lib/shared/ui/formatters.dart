String formatPrice(double price) {
  final normalized = price.isNaN || price.isInfinite ? 0 : price;
  return '${normalized.toStringAsFixed(0)} kr.';
}

import 'package:flutter/material.dart';

class RatingRow extends StatelessWidget {
  final double rating;
  final int count;

  const RatingRow({super.key, required this.rating, required this.count});

  @override
  Widget build(BuildContext context) {
    final fullStars = rating.floor().clamp(0, 5);
    final halfStar = (rating - fullStars) >= 0.5;

    return Row(
      children: [
        for (var i = 0; i < 5; i++)
          Icon(
            i < fullStars
                ? Icons.star
                : (i == fullStars && halfStar)
                ? Icons.star_half
                : Icons.star_border,
            size: 16,
            color: Colors.amber.shade600,
          ),
        const SizedBox(width: 6),
        Text(
          rating.toStringAsFixed(1),
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(width: 6),
        Text(
          '($count)',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}

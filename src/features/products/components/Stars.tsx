type StarsProps = {
  value: number;
};

export function Stars({ value }: StarsProps) {
  const filled = Math.round(Math.max(0, Math.min(5, value)));

  return (
    <span className="inline-flex items-center gap-1" aria-label={`${value} ud af 5 stjerner`}>
      <span className="text-amber-400" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (i < filled ? "★" : "☆")).join("")}
      </span>
    </span>
  );
}

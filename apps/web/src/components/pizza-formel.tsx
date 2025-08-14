export function PizzaFormel({ count }: { count: number }) {
  if (count < 0) {
    return <p>Antall kan ikke være negativt</p>;
  }
  if (count === 0) {
    return <p>Ingen pizza</p>;
  }

  const pizza_count = Math.ceil(count * (3 / 8));
  return <p>Du må bestille: {pizza_count} pizza</p>;
}

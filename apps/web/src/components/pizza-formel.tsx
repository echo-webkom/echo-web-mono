type Props = {
  registration_count: number;
};

export function PizzaFormel({ registration_count }: Props) {
  const pizza_count = registration_count * (3 / 8);
  return <p>Du må bestille: {pizza_count} pizza</p>;
}

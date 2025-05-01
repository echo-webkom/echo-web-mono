type Props = {
  registration_count: number;
};

export function PizzaFormel({ registration_count }: Props) {
  if (registration_count < 0) {
    return <p>Antall kan ikke være negativt</p>;
  }
  if (registration_count === 0) {
    return <p>Ingen pizza</p>;
  }
  if (Number.isNaN(registration_count)) {
    return <p>Input må være et tall</p>;
  }

  const pizza_count = registration_count * (3 / 8);
  return <p>Du må bestille: {pizza_count} pizza</p>;
}

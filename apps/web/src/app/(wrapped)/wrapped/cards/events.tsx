import { type WrappedCardProps, WrappedCard } from "../components/WrappedCard";

export function Event0() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    colors: ["bg-wrapped-yellow", "bg-wrapped-pink"],
    offX: [0, 0],
    offY: [0, 0],
    rotate: [-5, 10],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <p>hei</p>
      </WrappedCard>
    </>
  );
}

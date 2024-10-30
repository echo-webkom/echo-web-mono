import { motion, type Variants } from "framer-motion";

type ArrayOfLength<T, L extends number> = [T, ...Array<T>] & { length: L };

// C is number of layers. 0 means just foreground card for text.
export type WrappedCardProps<C extends number> = {
  offX: ArrayOfLength<number, C>;
  offY: ArrayOfLength<number, C>;
  rotate: ArrayOfLength<number, C>;
  colors: ArrayOfLength<string, C>;
  fgColor: string;
};

function CardLayers<C extends number>({
  children,
  props,
}: {
  children: React.ReactNode;
  props: WrappedCardProps<C>;
}) {
  const style = "absolute w-full h-full top-0 left-0";

  return (
    <>
      <motion.div
        className={`${style} ${props.fgColor} z-50 font-bold text-wrapped-black flex items-center justify-center`}
      >
        {children}
      </motion.div>

      {props.colors.map((col, index) => {
        const variants: Variants = {
          hidden: {
            rotate: 0,
            x: 0,
            y: 0,
          },
          show: {
            rotate: props.rotate[index],
            x: props.offX[index],
            y: props.offY[index],
            transition: {
              ease: "backOut",
            },
          },
        };

        return (
          <motion.div
            style={{ zIndex: -index }}
            key={index}
            className={`${style} ${col}`}
            variants={variants}
          ></motion.div>
        );
      })}
    </>
  );
}

export function WrappedCard<C extends number>({
  props,
  children,
}: {
  props: WrappedCardProps<C>;
  children: React.ReactNode;
}) {
  const mainVariants = {
    hidden: {
      scale: 0,
    },
    show: {
      scale: 1,
      transition: {
        duration: 0.2,
        delayChildren: 0.2,
      },
    },
    exit: {
      scale: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <motion.div
        className="bg-red-500"
        style={{
          width: "30vw",
          height: "75vh",
        }}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={mainVariants}
      >
        <CardLayers props={props}>{children}</CardLayers>
      </motion.div>
    </>
  );
}

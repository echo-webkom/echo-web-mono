import { motion, type Variants } from "framer-motion";
import Image from "next/image";

type ArrayOfLength<T, L extends number> =
  | ([T, ...Array<T>] & { length: L })
  | [];

// C is number of layers. 0 means just foreground card for text.
export type WrappedCardProps<C extends number> = {
  offX: ArrayOfLength<number, C>;
  offY: ArrayOfLength<number, C>;
  rotate: ArrayOfLength<number, C>;
  scale: ArrayOfLength<number, C>;
  colors: ArrayOfLength<string, C>;
  fgColor: string;
  bgColor: string;
  noParticles?: boolean;
};

function CardLayers<C extends number>({
  children,
  props,
}: {
  children: React.ReactNode;
  props: WrappedCardProps<C>;
}) {
  const style = "absolute top-0 left-0 w-full h-full";
  return (
    <>
      <div className="w-full h-full">
        <motion.div
          className={`absolute ${props.fgColor} w-full h-full z-10 font-bold text-wrapped-black shadow overflow-hidden`}
        >
          {children}
        </motion.div>

        {props.colors.map((col, index) => {
          const variants: Variants = {
            hidden: {
              scale: 1,
              rotate: 0,
              x: 0,
              y: 0,
            },
            show: {
              rotate: props.rotate[index],
              x: props.offX[index],
              y: props.offY[index],
              scale: props.scale[index],
              transition: {
                ease: "backOut",
              },
            },
          };

          return (
            <motion.div
              style={{ zIndex: -index }}
              key={index}
              className={`${style} ${col} shadow`}
              variants={variants}
            ></motion.div>
          );
        })}
      </div>
    </>
  );
}

function CardBackdrop() {
  const length = 10 + Math.floor(Math.random() * 4);
  return (
    <>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: Math.floor(Math.random() * 20 - 10) }}
        transition={{
          duration: 10,
        }}
        className="absolute top-1/2 left-1/2 -z-50"
      >
        {[...new Array(length).keys()].map((_, index) => {
          const angle = (((360 / length) * (index + 1)) / 360) * Math.PI * 2;
          const dist = 600;

          return (
            <Particle
              key={index}
              x={Math.cos(angle) * dist}
              y={Math.sin(angle) * dist}
              duration={Math.random() * 3}
            />
          );
        })}
        {[...new Array(length).keys()].map((_, index) => {
          const angle = (((360 / length) * (index + 1)) / 360) * Math.PI * 2;
          const dist = 800;

          return (
            <Particle
              key={index}
              x={Math.cos(angle) * dist}
              y={Math.sin(angle) * dist}
              duration={Math.random() * 2}
            />
          );
        })}
        {[...new Array(length * 2).keys()].map((_, index) => {
          const angle =
            (((360 / (length * 2)) * (index + 1)) / 360) * Math.PI * 2;
          const dist = 1000;

          return (
            <Particle
              key={index}
              x={Math.cos(angle) * dist}
              y={Math.sin(angle) * dist}
              duration={Math.random() * 3}
            />
          );
        })}
      </motion.div>
    </>
  );
}

function Particle({
  x,
  y,
  duration,
}: {
  x: number;
  y: number;
  duration: number;
}) {
  const images = ["star", "circle", "square", "triangle"];
  return (
    <>
      <motion.div
        className="absolute w-10 h-10"
        initial={{
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 0,
        }}
        animate={{
          x: [Math.floor(x / 1.5), Math.floor(x)],
          y: [Math.floor(y / 1.5), Math.floor(y)],
          opacity: [0, 0.1, 1, 0],
          rotate: 360,
        }}
        exit={{
          opacity: [null, 0],
          transition: {
            duration: 0.05,
          },
        }}
        transition={{
          duration: 7 + duration,
          times: [0, 0.05, 0.9, 1],
          ease: "linear",
        }}
      >
        <Image
          src={`/wrapped/${images[Math.floor(Math.random() * images.length)]}.png`}
          alt=""
          className="opacity-20"
          width={500}
          height={500}
        />
      </motion.div>
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
      <div
        className={`relative top-0 left-0 w-[100vw] h-[100vh] overflow-hidden -z-50 ${props.bgColor}`}
      >
        <div className="flex w-full h-full justify-center items-center overflow-hidden">
          <motion.div
            initial="hidden"
            animate="show"
            exit="exit"
            variants={mainVariants}
            className="select-none relative w-[30vw] h-[75vh]"
          >
            {!props.noParticles && <CardBackdrop />}
            <CardLayers props={props}>{children}</CardLayers>
          </motion.div>
        </div>
      </div>
    </>
  );
}

# Framer Motion

Framer Motion er et JavaScript-bibliotek som brukes til å legge til **animasjoner** og interaktivitet i webapplikasjoner. Det er spesielt populært blant utviklere som jobber med ReactJS, ettersom det er enkelt å integrere i React-prosjekter.

```tsx
import {motion} from "framer-motion";

const CoolAnimations = () => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
      exit={{opacity: 0}}
    >
      Fader inn
    </motion.div>
  );
};

export default CoolAnimations;
```

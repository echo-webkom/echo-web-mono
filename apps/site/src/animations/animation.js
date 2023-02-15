export const openContainer = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.2,
    },
  },
  exit: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.2,
    },
  },
};

export const openItem = {
  hidden: {
    x: "100%",
  },
  show: {
    x: "0%",
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    x: "100%",
  },
};

export const closedContainer = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    // transition: {
    //   delayChildren: 0.5,
    //   staggerChildren: 0.2,
    // },
  },
};

export const closedItem1 = {
  hidden: {
    x: "100%",
    y: "-100%",
  },
  show: {
    x: "0%",
    y: "100%",
    transfrom: {
      rotateZ: "45deg",
    },
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    x: "100%",
  },
};
export const closedItem2 = {
  hidden: {
    x: "100%",
    y: "0%",
  },
  show: {
    x: "0%",
    y: "-100%",
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    x: "100%",
  },
};

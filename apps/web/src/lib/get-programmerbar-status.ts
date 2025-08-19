export const getProgrammerbarStatus = async () => {
  try {
    return (await fetch("https://programmer.bar/api/status").then((res) => res.json())) as {
      message: string;
    };
  } catch {
    return {
      message: "",
    };
  }
};

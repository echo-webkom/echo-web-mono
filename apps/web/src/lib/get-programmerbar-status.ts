export async function getProgrammerbarStatus() {
  try {
    return (await fetch("https://api.programmer.bar").then((res) => res.json())) as {
      message: string;
    };
  } catch (error) {
    return {
      message: "",
    };
  }
}

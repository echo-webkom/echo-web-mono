export async function getProgrammerbarStatus() {
  try {
    return (await fetch("https://api.programmer.bar").then((res) => res.json())) as {
      success: true;
      message: string;
    };
  } catch (error) {
    return {
      success: false,
      message: "Klarte ikke å hente status",
    };
  }
}

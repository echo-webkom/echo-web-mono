async function globalSetup() {
  // eslint-disable-next-line no-console
  console.log("🚀 Setting up tests");

  await fetch("http://localhost:3000/api/sanity/sync?dataset=testing", {
    headers: {
      Authorization: `Basic ${Buffer.from(`admin:${process.env.ADMIN_KEY}`).toString("base64")}`,
    },
  });
}

export default globalSetup;

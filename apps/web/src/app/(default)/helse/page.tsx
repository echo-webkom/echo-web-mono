export const dynamic = "force-dynamic";

export default async function Health() {
  const ok = await fetch("http://localhost:8000")
    .then((resp) => resp.text())
    .then((text) => text === "OK");

  return (
    <div className="text-center">
      <h1 className="text-xl font-medium" data-testid="health-text">
        API is: {ok ? "OK" : "NOT OK"}
      </h1>
    </div>
  );
}

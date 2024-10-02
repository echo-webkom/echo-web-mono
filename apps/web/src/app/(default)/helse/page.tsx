import { apiClient } from "@/api/client";

export default async function Health() {
  try {
    const resp = await apiClient.get("").text();
    const isOK = resp === "OK";

    return (
      <div>
        <h1>Health</h1>
        <p data-testid="health-text">API is: {isOK ? "OK" : "UNHEALTHY"}</p>
      </div>
    );
  } catch (err) {
    return (
      <div>
        <h1>Health</h1>
        <p data-testid="health-text">API is: UNHEALTHY</p>

        <pre>
          <code>{JSON.stringify(err)}</code>
        </pre>
      </div>
    );
  }
}

"use client";

import { useQuery } from "@tanstack/react-query";

export default function TestingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/whoami", {
        credentials: "include",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await response.json();
    },
  });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

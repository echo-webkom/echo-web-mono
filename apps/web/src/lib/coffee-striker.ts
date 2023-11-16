import "server-only";

export const coffeeStriker = {
  getStrikes: async () => {
    const strikes = await fetch(`${process.env.COFFEE_STRIKER_URL}`).then((res) => res.text());

    const numStrikes = Number(strikes);

    if (isNaN(numStrikes)) {
      throw new Error("Could not get strikes");
    }

    return numStrikes;
  },
  addStrike: async (userId: string) => {
    const resp = await fetch(`${process.env.COFFEE_STRIKER_URL}/strike`, {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
      headers: {
        Authorization: `Bearer ${process.env.COFFEE_STRIKER_TOKEN}`,
      },
    });

    if (!resp.ok) {
      throw new Error("Could not add strike");
    }

    return resp;
  },
  clearStrikes: async () => {
    const resp = await fetch(`${process.env.COFFEE_STRIKER_URL}/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COFFEE_STRIKER_TOKEN}`,
      },
    });

    if (!resp.ok) {
      throw new Error("Could not clear strikes");
    }

    return resp;
  },
};

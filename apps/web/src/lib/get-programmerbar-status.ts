export async function getProgrammerbarSatus() {
    return (await fetch('https://api.programmer.bar').then((res) => res.json())) as {
		message: string;
	};
}
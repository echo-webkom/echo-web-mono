import { PUBLIC_ECHOGRAM_URL } from '$env/static/public';
import { db } from '$lib/db/client.server';
import { users } from '@echo-webkom/db/schemas';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { ADMIN_KEY } from '$env/static/private';

const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

const echogramUrlFor = (id: string) => {
	return `${PUBLIC_ECHOGRAM_URL}/${id}`;
};

const uploadImage = (id: string, formData: FormData) => {
	return fetch(echogramUrlFor(id), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${ADMIN_KEY}`
		},
		body: formData
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		return new Response(JSON.stringify({ message: 'Du må være logget inn.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const formData = await request.formData();
	const image = formData.get('file') as File;
	if (!(image instanceof File) || !image) {
		return new Response(JSON.stringify({ message: 'Ingen bilde ble sendt.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const isValidFileType = ACCEPTED_FILE_TYPES.includes(image.type);
	if (!isValidFileType) {
		return new Response(JSON.stringify({ message: 'Ugyldig filtype.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const size = image.size / 1024 / 1024; // size in MB
	if (size > 5) {
		return new Response(JSON.stringify({ message: 'Bilde er for stort.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const imageId = `${userId}-${Date.now()}`;
	let response;
	try {
		response = await uploadImage(imageId, formData);
	} catch {
		return new Response(JSON.stringify({ message: 'Feil ved opplasting av bilde.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	if (!response.ok) {
		return new Response(JSON.stringify({ message: 'Feil ved opplasting av bilde.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	await db
		.update(users)
		.set({ image: echogramUrlFor(imageId) })
		.where(eq(users.id, userId));

	return new Response(JSON.stringify({ message: 'Hello from the server!' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

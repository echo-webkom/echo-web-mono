import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db/client.server';
import { users } from '@echo-webkom/db/schemas';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/logg-inn');
	}

	const degrees = await db.query.degrees.findMany();

	return {
		degrees
	};
};

const updateProfileSchema = z.object({
	alternativeEmail: z.string().transform((val) => (val === '' ? null : val.trim())),
	degree: z.string().transform((val) => (val === '' ? null : val)),
	birthday: z.string().transform((val) => {
		if (!val) return null;
		const date = new Date(val);
		return isNaN(date.getTime()) ? null : date;
	}),
	hasReadTerms: z.string().transform((val) => {
		if (!val) return false;
		const hasReadTerms = val === 'on' ? true : false;
		return hasReadTerms;
	}),
	year: z.string().transform((val) => {
		if (!val) return null;
		const year = parseInt(val);
		return isNaN(year) ? null : year;
	})
});

export const actions: Actions = {
	removeImage: async ({ locals }) => {
		const user = locals.user;

		if (!user) {
			return fail(400, {
				success: false,
				message: 'Du er ikke logget inn.'
			});
		}

		if (!user.image) {
			return fail(400, {
				success: false,
				message: 'Du har ikke et profilbilde.'
			});
		}

		await db
			.update(users)
			.set({
				image: null
			})
			.where(eq(users.id, user.id));

		return {
			success: true
		};
	},
	updateProfile: async ({ locals, request }) => {
		const user = locals.user;

		if (!user) {
			return fail(400, {
				success: false,
				message: 'Du er ikke logget inn.'
			});
		}

		const formData = await request.formData();
		const { data, success, error } = updateProfileSchema.safeParse(
			Object.fromEntries(formData.entries())
		);
		if (!success) {
			console.log(JSON.stringify(error));
			return fail(400, {
				success: false,
				message: 'Ugyldig data'
			});
		}

		await db
			.update(users)
			.set({
				alternativeEmail: data.alternativeEmail,
				degreeId: data.degree,
				year: data.year,
				birthday: data.birthday,
				hasReadTerms: data.hasReadTerms
			})
			.where(eq(users.id, user.id));

		return {
			success: true
		};
	}
};

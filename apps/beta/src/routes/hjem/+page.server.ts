import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { axis } from '$lib/axis/client.server';
import { isFuture } from 'date-fns';
import { ShoppingListService } from '$lib/services/shopping-list-service';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/');
	}

	const [allEvents, events, bedpres, p, jobs, m, shoppingList] = await Promise.all([
		axis.events.list(),
		axis.events.upcoming(['event', 'external'], 8),
		axis.events.upcoming(['bedpres'], 4),
		axis.content.posts.list(),
		axis.content.jobs.list(),
		axis.content.movies.list(),
		axis.shoppingList.list()
	]);

	const posts = p
		.toSorted((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
		.slice(0, 2);

	const movies = m
		.filter((movie) => isFuture(new Date(movie.date)))
		.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 3);

	return {
		allEvents,
		events,
		bedpres,
		posts,
		jobs,
		movies,
		shoppingList
	};
};

export const actions: Actions = {
	like: async ({ locals, request }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, {
				message: 'Du er ikke logget inn.'
			});
		}

		const data = Object.fromEntries(await request.formData());
		const { id } = data;

		if (!id || typeof id !== 'string') {
			return fail(401, {
				message: 'Mangler id.'
			});
		}

		ShoppingListService.like(id, user.id);

		return { success: true };
	}
};

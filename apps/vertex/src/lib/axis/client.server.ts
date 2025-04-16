import ky from 'ky';

const AxisClient = ky.extend({
	prefixUrl: 'http://localhost:8080'
});

/**
 * Fetches the shopping list items from the database.
 *
 * @returns
 */
export const fetchShoppingListItems = async () => {
	return await AxisClient.get('shopping-list').json<
		Array<{
			id: string;
			name: string;
			userId: string;
			userName: string;
		}>
	>();
};

/**
 * Adds a shopping list item to the database.
 *
 * @param userId
 * @param name
 * @returns
 */
export const addShoppingListItem = async (userId: string, name: string) => {
	return await AxisClient.post('shopping-list', {
		json: {
			name,
			userId
		}
	}).json<{
		id: string;
	}>();
};

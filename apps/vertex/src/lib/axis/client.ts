import ky from 'ky';

const AxisClient = ky.extend({
	prefixUrl: 'http://localhost:8080'
});

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

import { getNotifications } from "@/data/notifications/queries";
import { getUser } from "@/lib/get-user";

export const fetchUserNotifications = async () => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const notifications = await getNotifications();

  const currentDate = new Date().toISOString();
  return notifications.filter(
    (notification) =>
      notification.user.id === user.id &&
      notification.dateFrom <= currentDate &&
      notification.dateTo >= currentDate,
  );
};

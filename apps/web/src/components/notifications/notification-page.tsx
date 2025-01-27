import { User } from "@echo-webkom/db/schemas";

import NotificationForm from "./notification-form";

type NotificationPageProps = {
  user: User;
};

export default function NotificationPage({ user }: NotificationPageProps) {
  return <NotificationForm />;
}

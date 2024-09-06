import { NotificationPanel } from "@/components/notification-center/notification-panel";

const NotificationsPage = () => (
  <section className="xl:container px-4 py-7">
    <NotificationPanel limitHeight={false} />
  </section>
);
export default NotificationsPage;

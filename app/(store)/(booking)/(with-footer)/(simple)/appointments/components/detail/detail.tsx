import { Booking } from "@/types/booking";
import { LoadingCard } from "@/components/loading";
import dynamic from "next/dynamic";

const BookingDetail = dynamic(
  () =>
    import("@/app/(store)/(booking)/components/booking-detail").then((component) => ({
      default: component.BookingDetail,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

interface AppointmentDetailPageProps {
  detail?: Booking;
  status: string;
}

export const AppointmentDetailPage = ({ detail, status }: AppointmentDetailPageProps) => (
  <div className="rounded-button border border-gray-link">
    {status === "success" && <BookingDetail id={detail?.id} />}
    {status === "loading" && <LoadingCard />}
  </div>
);

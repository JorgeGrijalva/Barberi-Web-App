import { BookingDetail } from "@/app/(store)/(booking)/components/booking-detail";

const BookingDetailPage = ({ params }: { params: { id: string } }) => (
  <section className="xl:container px-4 my-7">
    <div className="grid  md:grid-cols-2 grid-cols-1">
      <div className="border border-gray-link rounded-button">
        <BookingDetail id={Number(params.id)} />
      </div>
    </div>
  </section>
);

export default BookingDetailPage;

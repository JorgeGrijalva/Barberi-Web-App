import { infoService } from "@/services/info";
import { cookies } from "next/headers";
import { CareerDetailContent } from "./content";

const CareersDetailPage = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const data = await infoService.getCareer(params.id, { lang });

  return <CareerDetailContent initialData={data} />;
};

export default CareersDetailPage;

import { Translate } from "@/components/translate";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import { createMapUrl } from "@/utils/create-map-url";

const ContactsPage = async () => {
  const settings = await globalService.settings().catch((e) => console.log(e));
  const parsedSettings = parseSettings(settings?.data);
  const [lat, long] = parsedSettings.location.split(",");
  return (
    <section className="xl:container px-4 py-7">
      <h1 className="md:text-head text-xl font-medium my-6 ">
        <Translate value="contact" />
      </h1>
      <div className="flex flex-col gap-6 my-10">
        <a
          href={`tel:${parsedSettings?.phone}`}
          className="dm:text-xl text-lg font-medium"
          target="_blank"
          rel="noreferrer"
        >
          {parsedSettings?.phone}
        </a>
        <a
          className="md:text-lg text-base font-simibold"
          href={createMapUrl(lat.trim(), long.trim())}
        >
          {parsedSettings?.address}
        </a>
        <p className="md:text-base text-sm">{parsedSettings?.footer_text}</p>
      </div>
    </section>
  );
};

export default ContactsPage;

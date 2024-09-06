import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import { Translate } from "@/components/translate";
import OperatorIcon from "@/assets/icons/operator";
import { Button } from "@/components/button";
import MessageIcon from "@/assets/icons/message";

const HotlinePage = async () => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);

  return (
    <div className="border border-gray-border rounded-2xl p-4 dark:border-gray-inputBorder">
      <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-full bg-gray-card flex items-center justify-center dark:bg-darkBgUi3 aspect-square">
            <OperatorIcon />
          </div>
          <div>
            <div className="text-base font-medium">
              <Translate value="have.questions" />
            </div>
            <span className="text-xs">
              <Translate value="questions.text" />
            </span>
          </div>
        </div>
        <Button
          as="a"
          href={`tel:${parsedSettings?.phone}`}
          leftIcon={<MessageIcon />}
          color="black"
          size="small"
        >
          <Translate value="help.center" />
        </Button>
      </div>
    </div>
  );
};

export default HotlinePage;

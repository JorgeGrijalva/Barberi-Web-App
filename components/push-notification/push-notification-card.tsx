import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import Link from "next/link";
import { redirectNotificationTypesMap } from "@/config/global";

interface PushNotificationCardProps {
  id?: string;
  title?: string;
  body?: string;
  type?: string;
}

export const PushNotificationCard = ({ id, title, body, type }: PushNotificationCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="">
      <strong className="text-base line-clamp-1 mb-2 dark:text-white">{title}</strong>
      <span className="text-sm font-medium line-clamp-2 dark:text-white">{body}</span>
      {!!id && !!type && redirectNotificationTypesMap[type] && (
        <Button
          as={Link}
          href={`/${redirectNotificationTypesMap[type]}/${id}`}
          size="small"
          scroll={false}
          className="mt-1"
        >
          {t("show")}
        </Button>
      )}
    </div>
  );
};

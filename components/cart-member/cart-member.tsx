import { useTranslation } from "react-i18next";
import Image from "next/image";
import { IconButton } from "@/components/icon-button";
import TrashIcon from "@/assets/icons/trash";
import { ProfilePlaceholder } from "../profile-placeholder";

interface CartMemberProps {
  onDelete?: (uuid: string) => void;
  isMine?: boolean;
  name?: string | null;
  img?: string;
  uuid?: string;
}

export const CartMember = ({ name, img, isMine, onDelete, uuid }: CartMemberProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {img ? (
          <Image
            src={img}
            alt={name || "profile"}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        ) : (
          <ProfilePlaceholder size={40} name={name || ""} />
        )}
        <span className="text-sm">
          {name} {isMine && `(${t("you")})`}
        </span>
      </div>
      {!!onDelete && (
        <IconButton onClick={() => !!uuid && onDelete(uuid)}>
          <TrashIcon />
        </IconButton>
      )}
    </div>
  );
};

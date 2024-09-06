import { useTranslation } from "react-i18next";
import { Modal } from "../modal";
import { Button } from "../button";

interface ConfirmModalProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isOpen: boolean;
  loading?: boolean;
}

export const ConfirmModal = ({
  text,
  onCancel,
  onConfirm,
  confirmText,
  isOpen,
  loading,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal size="xsmall" isOpen={isOpen} onClose={onCancel}>
      <div className="p-5">
        <div className="mb-7 mt-2">
          <span className="text-base font-medium my-10 break-words">{t(text)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={loading} fullWidth size="small" onClick={onCancel} color="black">
            {t("cancel")}
          </Button>
          <Button fullWidth size="small" loading={loading} onClick={onConfirm}>
            {t(confirmText || "confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

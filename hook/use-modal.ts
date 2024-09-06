import { useCallback, useState } from "react";

export const useModal = (): [boolean, () => void, () => void] => {
  const [isOpen, setIsOpen] = useState(false);

  const hanldeOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return [isOpen, hanldeOpen, handleClose];
};

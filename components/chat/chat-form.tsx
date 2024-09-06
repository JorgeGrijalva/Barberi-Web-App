import { IconButton } from "@/components/icon-button";
import Attachment2Icon from "remixicon-react/Attachment2Icon";
import SendPlaneLineIcon from "remixicon-react/SendPlaneLineIcon";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useUserStore from "@/global-store/user";
import { useTranslation } from "react-i18next";
import { addDoc, doc, updateDoc } from "@firebase/firestore";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import firebaseApp from "@/lib/firebase";
import { error } from "@/components/alert";
import { CreateMessageBody, IMessage, MessageType } from "@/types/chat";
import React, { useEffect, useRef } from "react";
import CrossIcon from "@/assets/icons/cross";
import { RepliedMessage } from "@/components/chat/replied-message";
import { useUploadImage } from "@/hook/use-upload-image";
import { ImageTypes } from "@/types/global";
import CircularLoading from "@/assets/icons/circular-loading";

const schema = yup.object({
  message: yup.string().required(),
  type: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

interface ChatFormProps {
  chatId?: string;
  editedMessage: IMessage | null;
  repliedMessage: IMessage | null;
  clearEditMessage: () => void;
  clearReplyMessage: () => void;
}

export const ChatForm = ({
  chatId,
  editedMessage,
  repliedMessage,
  clearEditMessage,
  clearReplyMessage,
}: ChatFormProps) => {
  const { t } = useTranslation();
  const { mutate: uploadImage, isLoading: isUploadingImage } = useUploadImage();
  const user = useUserStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleSendMessage = async (data: FormData) => {
    if (chatId) {
      reset();
      const db = getFirestore(firebaseApp);
      const chatRef = doc(db, "chat", chatId);
      if (editedMessage) {
        clearEditMessage();
        await updateDoc(doc(db, "chat", chatId, "message", editedMessage.id), {
          message: data.message,
        });
        if (editedMessage.isLast) {
          await updateDoc(chatRef, {
            lastMessage: data.message,
            time: serverTimestamp(),
          });
        }
      } else {
        await updateDoc(chatRef, {
          lastMessage: data.message,
          time: serverTimestamp(),
        });
        const body: CreateMessageBody = {
          read: false,
          time: new Date().toISOString(),
          message: data.message,
          senderId: user?.id,
        };
        if (data.type) {
          body.type = data.type as MessageType;
        }
        if (repliedMessage) {
          body.replyDocId = repliedMessage.id;
          clearReplyMessage();
        }
        await addDoc(collection(db, "chat", chatId, "message"), body);
      }
    } else {
      error(t("chat.is.not.created"));
    }
  };

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (files?.length) {
      const imagesForm = new FormData();

      [...files].forEach((file) => {
        if (file) {
          imagesForm.append("image", file, file.name);
        }
      });
      imagesForm.append("type", ImageTypes.USER);
      uploadImage(imagesForm, {
        onSuccess: async (res) => {
          await handleSendMessage({ message: res.data.title, type: "image" });
        },
        onError: () => {
          error(t("failed.to.upload"));
        },
      });
    }
  };

  useEffect(() => {
    if (editedMessage?.message) {
      setValue("message", editedMessage.message);
    }
  }, [editedMessage?.message]);

  return (
    <div className="border-t border-gray-200 px-4 py-4   w-full bg-white dark:bg-dark dark:border-gray-bold">
      {editedMessage && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col mb-4">
            <span className="text-xs text-blue-link">{t("editing")}</span>
            <span className="text-sm line-clamp-1">{editedMessage.message}</span>
          </div>
          <IconButton onClick={clearEditMessage}>
            <CrossIcon size={20} />
          </IconButton>
        </div>
      )}
      {isUploadingImage && (
        <div className="flex items-center gap-2 mb-4">
          <CircularLoading size={24} />
          <span className="text-sm">{t("uploading.image")}</span>
        </div>
      )}
      {repliedMessage && (
        <RepliedMessage data={repliedMessage} inProgress onClear={clearReplyMessage} />
      )}
      <form onSubmit={handleSubmit(handleSendMessage)}>
        <div className="relative max-h-max">
          <div>
            <input
              ref={fileInputRef}
              onChange={handleUpload}
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/webp"
              hidden
            />
            <textarea
              {...register("message")}
              placeholder={t("message")}
              rows={1}
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-3 pr-24 bg-gray-200 dark:bg-gray-darkSegment dark:text-white rounded-2xl py-3 resize-none"
            />
          </div>
          <div className="absolute  right-0 inset-y-0 items-center max-h-max flex gap-2 ">
            <IconButton onClick={() => fileInputRef.current?.click()} type="button">
              <Attachment2Icon />
            </IconButton>

            <IconButton type="submit" size="large">
              <SendPlaneLineIcon />
            </IconButton>
          </div>
        </div>
      </form>
    </div>
  );
};

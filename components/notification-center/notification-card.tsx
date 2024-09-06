import { Notification, Statistics } from "@/types/notification";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification";
import { Paginate } from "@/types/global";
import { redirectNotificationTypesMap } from "@/config/global";

export const NotificationCard = ({
  data,
  onClick,
}: {
  data: Notification;
  onClick?: () => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: readNotification } = useMutation({
    mutationFn: () => notificationService.readById(data.id),
    onMutate: async () => {
      const prevStatistics = queryClient.getQueryData<Statistics>(["notificationStatistics"]);
      const prevNotifications = queryClient.getQueryData<InfiniteData<Paginate<Notification>>>(
        ["notifications"],
        { exact: false }
      );

      queryClient.setQueryData<Statistics | undefined>(["notificationStatistics"], (old) => {
        if (!old) return prevStatistics;
        return {
          ...old,
          [data.type]:
            old[data.type as keyof Statistics] - 1 < 0 ? 0 : old[data.type as keyof Statistics] - 1,
          notification: old.notification - 1 < 0 ? 0 : old.notification - 1,
        };
      });
      queryClient.setQueriesData<InfiniteData<Paginate<Notification>> | undefined>(
        { queryKey: ["notifications"], exact: false },
        (old) => {
          if (!old) return prevNotifications;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data?.map((notification) => {
                if (notification.id === data.id) {
                  return { ...notification, read_at: new Date(Date.now()).toISOString() };
                }
                return notification;
              }),
            })),
          };
        }
      );
      return { prevStatistics, prevNotifications };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["notificationStatistics"], context?.prevStatistics);
      queryClient.setQueriesData(
        { queryKey: ["notifications"], exact: false },
        context?.prevNotifications
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["notificationStatistics"]);
      await queryClient.invalidateQueries(["notifications"]);
    },
  });
  const handleCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    readNotification();
    if (data.data?.id && redirectNotificationTypesMap[data.model_type]) {
      router.push(`/${redirectNotificationTypesMap[data.model_type]}/${data.data?.id}`, {
        scroll: false,
      });
      return;
    }
    if (onClick) {
      onClick();
    }
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <button
      onClick={handleCardClick}
      className="bg-gray-faq dark:bg-gray-darkSegment rounded-2xl p-5 relative text-start"
    >
      {!data.read_at && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary" />
      )}
      <span className="text-xs font-medium text-gray-disabledTab">
        {dayjs(data.created_at).format("DD MMM, YY HH:mm")}
      </span>
      <div className="text-base font-medium leading-7 mt-2 line-clamp-2">{data.body}</div>
    </button>
  );
};

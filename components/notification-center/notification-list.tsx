import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import dynamic from "next/dynamic";
import useUserStore from "@/global-store/user";
import clsx from "clsx";
import { NotificationCard } from "./notification-card";

interface NotificationListProps {
  type: string;
  onCardClick?: () => void;
  limitHeight?: boolean;
}

const NotificationEmptyList = dynamic(() =>
  import("./notification-empty-list").then((component) => ({
    default: component.NotificationEmptyList,
  }))
);

export const NotificationList = ({ type, onCardClick, limitHeight }: NotificationListProps) => {
  const user = useUserStore((state) => state.user);
  const {
    data: notifications,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["notifications", type],
    ({ pageParam = 1 }) =>
      notificationService.getAll({ type, column: "id", sort: "desc", perPage: 4, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      enabled: !!user,
    }
  );
  const notificationList = extractDataFromPagination(notifications?.pages);

  if ((notificationList && notificationList?.length === 0) || !user) {
    return <NotificationEmptyList />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-32" />
        <div className="bg-gray-200 rounded-xl h-32" />
        <div className="bg-gray-200 rounded-xl h-32" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        limitHeight && "md:max-h-[500px] sm:max-h-[400px] max-h-[350px] overflow-y-auto"
      )}
    >
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="flex flex-col gap-2.5 pb-10">
          {notificationList?.map((notification) => (
            <NotificationCard key={notification.id} data={notification} onClick={onCardClick} />
          ))}
        </div>
      </InfiniteLoader>
    </div>
  );
};

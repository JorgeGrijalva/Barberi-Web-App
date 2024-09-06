import { QueryCache, QueryClient } from "@tanstack/react-query";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onError: (err: NetworkError, query) => {
      if (query.meta?.showErrorMessageFromServer) {
        error(err.message);
      }
    },
  }),
});

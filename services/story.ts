import { ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Story } from "@/types/story";

const storyService = {
  getAll: (params?: ParamsType) =>
    fetcher<Story[][]>(buildUrlQueryParams(`v1/rest/stories/paginate`, params)),
};

export default storyService;

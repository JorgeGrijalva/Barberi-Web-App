import fetcher from "@/lib/fetcher";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { Blog, BlogFullTranslation, BlogShortTranslation } from "@/types/blog";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const blogService = {
  getAll: (params?: ParamsType, init?: RequestInit) =>
    fetcher<Paginate<Blog<BlogShortTranslation>>>(
      buildUrlQueryParams("v1/rest/blogs/paginate", params),
      init
    ),
  get: (id: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Blog<BlogFullTranslation>>>(
      buildUrlQueryParams(`v1/rest/blog-by-id/${id}`, params),
      { redirectOnError: true }
    ),
};

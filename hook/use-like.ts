"use client";

import useLikeStore from "@/global-store/like";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeOptions, LikeTypes, Paginate } from "@/types/global";
import { likeService } from "@/services/like";
import { Product } from "@/types/product";
import useUserStore from "@/global-store/user";
import { useCallback } from "react";
import useAddressStore from "@/global-store/address";

export const useLike = (type: LikeTypes, itemId?: number) => {
  const queryClint = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { list, likeOrDislike } = useLikeStore();
  const isLiked = list[type]?.some((item) => item.itemId === itemId);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { mutate: likeRequest } = useMutation({
    mutationFn: (body: LikeOptions) =>
      likeService.like({
        ...body,
        region_id: country?.region_id,
        country_id: country?.id,
        city_id: city?.id,
      }),
  });
  const { mutate: disLikeRequest } = useMutation({
    mutationFn: (body: LikeOptions) => likeService.dislike(body),
    onMutate: async (body) => {
      await queryClint.cancelQueries([type], { exact: false });
      const prevLikeList = queryClint.getQueryData<InfiniteData<Paginate<Product>>>([type], {
        exact: false,
      });
      queryClint.setQueriesData<InfiniteData<Paginate<Product>> | undefined>(
        { queryKey: [type], exact: false },
        (old) => {
          if (!old) return prevLikeList;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((product) => product.id !== body.type_id),
            })),
          };
        }
      );

      return { prevLikeList };
    },
    onError: (error, variables, context) => {
      queryClint.setQueryData([type], context?.prevLikeList);
    },
    onSettled: () => {
      const customType = type === "master" ? "likedMasters" : type;
      queryClint.invalidateQueries({ queryKey: [customType], exact: false });
    },
  });

  const handleLikeDisLike = useCallback(() => {
    if (itemId) {
      if (user) {
        if (isLiked) {
          disLikeRequest({ type_id: itemId, type });
        } else {
          likeRequest({ type_id: itemId, type });
        }
      }
      likeOrDislike(type, itemId, !!user);
    }
  }, [type, itemId, user?.id]);
  return { handleLikeDisLike, isLiked };
};

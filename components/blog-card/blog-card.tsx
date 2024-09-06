import ReviewIcon from "@/assets/icons/review";
import { Blog, BlogShortTranslation } from "@/types/blog";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { ImageWithFallBack } from "@/components/image";

interface BlogCardProps {
  data: Blog<BlogShortTranslation>;
  horizontal?: boolean;
  detailed?: boolean;
}

export const BlogCard = ({ data, horizontal, detailed }: BlogCardProps) => (
  <Link href={`/blogs/${data.id}`}>
    <div
      className={
        horizontal
          ? "flex items-center h-full border rounded-3xl  border-gray-border dark:border-gray-bold"
          : "flex flex-col h-full"
      }
    >
      <div
        className={
          horizontal
            ? "relative rounded-l-3xl flex-1 h-full  overflow-hidden border-t border-gray-border dark:border-gray-bold"
            : "relative md:aspect-[1.5/1] aspect-[2/1] rounded-t-3xl overflow-hidden border-l border-gray-border dark:border-gray-bold"
        }
      >
        <ImageWithFallBack
          src={data.img}
          alt={data.translation?.title || "blog"}
          fill
          className="object-cover"
          sizes="(max-width: 376px) 340px, (max-width: 576px) 560px, (max-width: 768px) 350px, (max-width: 992px) 465px, (max-width: 1200px) 370px, 480px"
        />
      </div>
      <div
        className={`py-5 px-4  border-gray-border dark:border-gray-bold flex-1 ${
          horizontal ? "rounded-t-3xl" : "border-b border-x rounded-b-3xl "
        }`}
      >
        <div className="text-base font-medium line-clamp-2">{data.translation?.title}</div>
        {detailed && (
          <span className="line-clamp-4 text-base my-5">{data.translation?.short_desc}</span>
        )}
        <div className="flex items-center gap-7 text-gray-field mt-4">
          <span className="text-sm">{dayjs(data.published_at).format("DD MMM, YY")}</span>
          <div className="flex items-center gap-1">
            <ReviewIcon />
            <span className="text-sm">{data.r_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

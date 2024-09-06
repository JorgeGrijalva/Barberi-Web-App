import React from "react";
import dayjs from "dayjs";
import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";
import { Blog, BlogFullTranslation } from "@/types/blog";
import Image from "next/image";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { BackButton } from "@/components/back-button";
import ReviewList from "@/app/(store)/(booking)/components/reviews/review-list";
import ReviewSummaryShort from "@/app/(store)/(booking)/components/reviews/review-summary-short";

const CreateReview = dynamic(() => import("../components/blog-review-create"));

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const blog = await fetcher<DefaultResponse<Blog<BlogFullTranslation>>>(
    buildUrlQueryParams(`v1/rest/blog-by-id/${params.id}`, { lang }),
    {
      redirectOnError: true,
    }
  );
  return {
    title: blog.data.translation?.title,
    description: blog.data.translation?.short_desc,
    openGraph: {
      title: blog.data.translation?.title,
      description: blog.data.translation?.short_desc,
      images: [
        {
          url: blog.data.img,
        },
      ],
    },
  };
};

const BlogDetailPage = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const blog = await fetcher<DefaultResponse<Blog<BlogFullTranslation>>>(
    buildUrlQueryParams(`v1/rest/blog-by-id/${params.id}`, { lang }),
    { redirectOnError: true }
  );
  return (
    <section className="xl:container px-4 my-7">
      <BackButton title="blog" />
      <div className="text-sm text-gray-bold mt-7">
        {dayjs(blog?.data?.published_at, "YYYY-MM-DD").format("dd MMM, YYYY")}
      </div>
      <h3 className="font-bold md:text-3xl text-2xl">{blog?.data.translation?.title}</h3>
      <div className="relative rounded-3xl overflow-hidden lg:aspect-[3/1] md:aspect-[2/1] aspect-square my-5">
        <Image
          src={blog?.data?.img}
          alt={blog?.data.translation?.title || "blog"}
          className="object-cover"
          fill
        />
      </div>
      <div className="grid grid-cols-7 gap-7 my-7">
        <div className="xl:col-span-5 lg:col-span-4 col-span-7">
          <div
            dangerouslySetInnerHTML={{ __html: blog?.data.translation?.description || "" }}
            className="text-base"
          />
          <div className="mt-10">
            <ReviewList title="comments" type="blogs" id={params.id} />
          </div>
        </div>
        <div className="xl:col-span-2 lg:col-span-3 col-span-7">
          <div className="sticky top-5">
            <ReviewSummaryShort type="blogs" typeId={Number(params.id)} />
            <CreateReview id={Number(params.id)} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailPage;

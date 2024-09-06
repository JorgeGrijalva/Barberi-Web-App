import React from "react";
import fetcher from "@/lib/fetcher";
import { Paginate } from "@/types/global";
import { Blog, BlogShortTranslation } from "@/types/blog";
import { BlogCard } from "@/components/blog-card";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { cookies } from "next/headers";
import { BackButton } from "@/components/back-button";

const cardStyles: Record<number, string> = {
  0: "lg:col-span-2 lg:row-span-2 col-span-4",
  3: "lg:col-span-1 lg:row-span-2 row-span-1 col-span-4",
  4: "lg:col-span-1 lg:row-span-2 row-span-1 col-span-4",
};

export const metadata = {
  title: "Blogs",
};

const BlogPage = async () => {
  const lang = cookies().get("lang")?.value;
  const blogs = await fetcher<Paginate<Blog<BlogShortTranslation>>>(
    buildUrlQueryParams("v1/rest/blogs/paginate", { lang, type: "blog" }),
    {
      cache: "no-cache",
    }
  );
  return (
    <section className="xl:container px-4 my-7">
      <BackButton title="blog" />
      <div className="grid grid-cols-4 gap-7 my-7">
        {blogs?.data.map((blog, i) => (
          <div
            key={blog.id}
            className={i in cardStyles ? cardStyles[i] : "lg:col-span-2 col-span-4"}
          >
            <BlogCard detailed horizontal={!cardStyles[i]} data={blog} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogPage;

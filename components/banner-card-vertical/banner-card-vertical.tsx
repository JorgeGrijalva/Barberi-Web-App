import Image from "next/image";
import Link from "next/link";
import React from "react";

export const BannerCardVertical = ({ img, id }: { img: string; id: number }) => (
  <button className="relative overflow-hidden rounded-3xl xl:aspect-[210/519] lg:aspect-[210/350] md:aspect-[210/250] md:max-h-[400px ] max-h-80 xl:max-h-none aspect-square">
    <Link href={`/promotion/${id}`}>
      <Image
        src={img}
        alt="banner"
        fill
        className="object-cover"
        sizes="(max-width: 352px) 330px, (max-width: 576px) 560px, (max-width: max-width: 768px) 736px, (max-width: 992px) 960px, (max-width: 1200px) 1168px, (max-width: 1500px) 184px, 228px"
      />
    </Link>
  </button>
);

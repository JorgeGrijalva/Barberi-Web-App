import { shopService } from "@/services/shop";
import { BackButton } from "@/components/back-button";
import { GalleryContent } from "./content";

const ShopGallery = async ({ params }: { params: { id: string } }) => {
  const gallery = await shopService.gellery(params.id);

  return (
    <section className="xl:container px-2 py-7 lg:py-0">
      <div className="my-4 hidden lg:block">
        <BackButton />
      </div>
      <GalleryContent images={gallery.data.galleries} />
    </section>
  );
};

export default ShopGallery;

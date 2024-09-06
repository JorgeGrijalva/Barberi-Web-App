import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { BackButton } from "@/components/back-button";
import CountryIndicator from "@/components/country-indicator/country-indicator";
import { HeaderLinks } from "./links";

const HeaderButtons = dynamic(
  () =>
    import("@/components/header-buttons").then((component) => ({
      default: component.HeaderButtons,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-5">
        <div className="rounded-button bg-gray-300 w-44 h-10 lg:block hidden" />
        <div className="rounded-button bg-gray-300 lg:w-40 w-10 h-10" />
      </div>
    ),
  }
);
const MobileSidebar = dynamic(() => import("./mobile-sidebar"));

interface HeaderProps {
  settings?: Record<string, string>;
  borderBottom?: boolean;
  showLinks?: boolean;
  isHidden?: boolean;
  showOnlyBackButton?: boolean;
  showBusinessButton?: boolean;
}

export const Header = ({
  settings,
  showLinks,
  borderBottom = false,
  isHidden = true,
  showOnlyBackButton,
  showBusinessButton = true,
}: HeaderProps) => (
  <header className={clsx(borderBottom && "border-b border-gray-link")}>
    <div className="xl:container px-4 lg:py-7 sm:py-4 py-2.5 flex items-center justify-between ">
      {isHidden && !showOnlyBackButton && <MobileSidebar isHidden={isHidden} />}
      <div className="flex gap-7 items-center">
        {!isHidden && !showOnlyBackButton && <MobileSidebar isHidden={isHidden} />}
        <Link
          href="/"
          className={clsx("relative z-10 lg:z-[4] lg:inline", showOnlyBackButton && "hidden")}
        >
          <Image
            src={settings?.logo || ""}
            alt={settings?.title || "logo"}
            width={148}
            height={28}
            className="object-contain h-7 w-auto"
          />
        </Link>
        <CountryIndicator />
        {showOnlyBackButton && (
          <div className="lg:hidden">
            <BackButton />
          </div>
        )}
      </div>
      {showLinks && <HeaderLinks />}
      <HeaderButtons canOpenDrawer={showOnlyBackButton} showBusinessButton={showBusinessButton} />
    </div>
  </header>
);

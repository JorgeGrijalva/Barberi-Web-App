import Link from "next/link";
import Image from "next/image";
import { SearchField } from "@/components/main-search-field";
import { HeaderButtons } from "@/components/header-buttons/header-buttons";
import { BackButton } from "@/components/back-button";

interface HeaderProps {
  settings?: Record<string, string>;
}

export const NavigationHeader = ({ settings }: HeaderProps) => (
  <header className="border-b border-gray-link">
    <div className="px-4 md:py-5 py-2.5 flex items-center justify-between">
      <Link href="/" className="hidden lg:inline-block">
        <Image
          src={settings?.logo || ""}
          alt={settings?.title || "logo"}
          width={148}
          height={28}
          className="object-contain h-7 w-auto"
        />
      </Link>
      <div className="lg:hidden">
        <BackButton />
      </div>
      <SearchField isInHeader />
      <HeaderButtons />
    </div>
  </header>
);

"use client";

import { useEffect, useState } from "react";
import useAddressStore from "@/global-store/address";
import LocationIcon from "@/assets/icons/location";
import { useMediaQuery } from "@/hook/use-media-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { usePathname } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";

const CountryIndicator = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(getCookie("showCountryDialog") !== false);
  const { openCountrySelectModal, country } = useAddressStore();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCookie("showCountryDialog", showDialog);
  }, [showDialog]);

  if (!mounted || !country || isMobile) return null;

  return (
    <div className="relative">
      <button
        onClick={openCountrySelectModal}
        className="border border-footerBg px-4 py-2 rounded-button"
      >
        <div className="flex flex-row items-center gap-x-2">
          <LocationIcon />
          {country?.translation?.title && (
            <span className="font-medium">{country?.translation?.title}</span>
          )}
        </div>
      </button>
      {showDialog && pathname === "/" && (
        <div className="absolute bg-white px-4 py-5 max-w-[460px] w-96 rounded-button mt-2">
          <p className="font-medium text-sm mb-5">
            {`${t("We're showing you items that ship to")} ${country?.translation?.title}. ${t(
              "To see items that ship to a different country, change your delivery address."
            )}`}
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              color="white"
              size="small"
              className="border border-footerBg"
              onClick={() => setShowDialog(false)}
            >
              {t("dismiss")}
            </Button>
            <Button
              color="black"
              size="small"
              onClick={() => {
                setShowDialog(false);
                openCountrySelectModal();
              }}
            >
              {t("change.address")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryIndicator;

"use client";

import { Translate } from "@/components/translate";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import clsx from "clsx";
import { useMediaQuery } from "@/hook/use-media-query";

interface FooterProps {
  settings?: Record<string, string>;
}

export const Footer = ({ settings }: FooterProps) => {
  const isMobile = useMediaQuery("(max-width:640px)");
  return (
    <footer className="bg-footerBg pt-12 pb-5">
      <div className="xl:container px-4 text-white flex justify-between flex-wrap xl:flex-nowrap">
        <div className="flex md:flex-col md:justify-between md:w-auto  w-full justify-center mb-10 md:mb-0 gap-8">
          <div>
            <div className="relative h-[45px] max-w-[420px] ">
              <Link href="/" className="mb-3 max-w-max">
                <Image
                  src={settings?.logo || ""}
                  alt={settings?.title || "logo"}
                  className="object-contain max-h-11 h-full !w-auto"
                  quality={100}
                  sizes="45px"
                  fill
                />
              </Link>
            </div>
            <p className="text-base font-medium">{settings?.description}</p>
          </div>
          <div className="md:flex items-center gap-2.5 hidden mb-8 md:mb-0">
            <Link href={settings?.customer_app_ios || ""} target="_blank">
              <Image src="/img/apple_store.png" alt="applestore" width={147} height={55} />
            </Link>

            <Link href={settings?.customer_app_android || ""} target="_blank">
              <Image src="/img/play_market.png" alt="playmarket" width={147} height={55} />
            </Link>
          </div>
        </div>
        <div className="md:gap-28 gap-3 justify-between lg:justify-start w-full lg:max-w-max lg:flex grid sm:grid-cols-2 grid-cols-1 flex-wrap xl:flex-nowrap">
          <Disclosure as="div" defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button
                  as={isMobile ? "button" : "div"}
                  className={clsx(
                    "flex items-center justify-between font-medium text-head md:mb-2.5 mb-1 w-full py-3 sm:py-0 sm:border-none border-white border-opacity-20",
                    !open && "border-b"
                  )}
                >
                  <Translate value="information" />
                  <AnchorDownIcon
                    className={clsx(open && "rotate-180 transform", "h-5 w-5  sm:hidden")}
                  />
                </Disclosure.Button>
                {(isMobile ? open : true) && (
                  <Disclosure.Panel static>
                    <div className="flex flex-col md:gap-6 gap-2">
                      <Link
                        href="/about"
                        className="text-lg font-medium transition-all hover:underline"
                      >
                        <Translate value="about.company" />
                      </Link>
                      <Link
                        href="/careers"
                        className="text-lg font-medium transition-all hover:underline"
                      >
                        <Translate value="work.for.us" />
                      </Link>
                      <Link
                        href="/contact"
                        className="text-lg font-medium transition-all hover:underline"
                      >
                        <Translate value="contact.us" />
                      </Link>
                    </div>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>

          {/* <Disclosure as="div" defaultOpen> */}
          {/*  {({ open }) => ( */}
          {/*    <> */}
          {/*      <Disclosure.Button */}
          {/*        className={clsx( */}
          {/*          "flex items-center justify-between font-medium text-head md:mb-2.5 mb-1 w-full py-3 sm:py-0 sm:border-none border-white border-opacity-20", */}
          {/*          !open && "border-b" */}
          {/*        )} */}
          {/*      > */}
          {/*        <Translate value="for.professionals" /> */}
          {/*        <AnchorDownIcon */}
          {/*          className={clsx(open && "rotate-180 transform", "h-5 w-5  sm:hidden")} */}
          {/*        /> */}
          {/*      </Disclosure.Button> */}
          {/*      <Disclosure.Panel> */}
          {/*        <div className="flex flex-col  md:gap-6 gap-2"> */}
          {/*          <Link */}
          {/*            href="/about-business" */}
          {/*            className="text-lg font-medium transition-all hover:underline" */}
          {/*          > */}
          {/*            <Translate value="about.business" /> */}
          {/*          </Link> */}
          {/*          <Link */}
          {/*            href="/create-profile" */}
          {/*            className="text-lg font-medium transition-all hover:underline" */}
          {/*          > */}
          {/*            <Translate value="create.business.profile" /> */}
          {/*          </Link> */}
          {/*          <Link */}
          {/*            href="requirements" */}
          {/*            className="text-lg font-medium transition-all hover:underline" */}
          {/*          > */}
          {/*            <Translate value="info.requirements" /> */}
          {/*          </Link> */}
          {/*        </div> */}
          {/*      </Disclosure.Panel> */}
          {/*    </> */}
          {/*  )} */}
          {/* </Disclosure> */}

          <Disclosure as="div" defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button
                  as={isMobile ? "button" : "div"}
                  className={clsx(
                    "flex items-center justify-between font-medium text-head md:mb-2.5 mb-1 w-full py-3 sm:py-0 sm:border-none border-white border-opacity-20",
                    !open && "border-b"
                  )}
                >
                  <Translate value="help" />
                  <AnchorDownIcon
                    className={clsx(open && "rotate-180 transform", "h-5 w-5  sm:hidden")}
                  />
                </Disclosure.Button>
                {(isMobile ? open : true) && (
                  <Disclosure.Panel static>
                    <div className="flex flex-col  md:gap-6 gap-2">
                      <Link
                        href="/faq"
                        className="text-lg font-medium transition-all hover:underline"
                      >
                        <Translate value="faq" />
                      </Link>
                      <Link
                        href="/terms"
                        className="text-lg font-medium transition-all hover:underline"
                      >
                        <Translate value="terms" />
                      </Link>
                      <Link
                        href="/privacy"
                        className="text-lg font-medium transition-all hover:underline"
                      >
                        <Translate value="privacy.policy" />
                      </Link>
                    </div>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>

          <Disclosure as="div" defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button
                  as={isMobile ? "button" : "div"}
                  className={clsx(
                    "flex items-center justify-between font-medium text-head md:mb-2.5 mb-1 w-full py-3 sm:py-0 sm:border-none border-white border-opacity-20 text-start",
                    !open && "border-b"
                  )}
                >
                  <Translate value="socials" />
                  <AnchorDownIcon
                    className={clsx(open && "rotate-180 transform", "h-5 w-5  sm:hidden")}
                  />
                </Disclosure.Button>
                {(isMobile ? open : true) && (
                  <Disclosure.Panel static>
                    <div className="flex flex-col  md:gap-6 gap-2">
                      <a
                        href={`https://${settings?.instagram}`}
                        className="text-lg font-medium transition-all hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram
                      </a>
                      <a
                        href={`https://${settings?.facebook}`}
                        className="text-lg font-medium transition-all hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Facebook
                      </a>
                      <a
                        href={`https://${settings?.twitter}`}
                        className="text-lg font-medium transition-all hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Twitter
                      </a>
                    </div>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
        </div>
        <div className="grid grid-cols-2 items-center gap-6 md:hidden mt-10 w-full">
          <div className="md:h-16 h-12 relative flex items-start">
            <Image
              src="/img/apple_store.png"
              alt="applestore"
              layout="fill"
              objectFit="contain"
              style={{ objectPosition: "left" }}
            />
          </div>
          <div className="md:h-16 h-12 relative">
            <Image
              src="/img/play_market.png"
              alt="playmarket"
              layout="fill"
              objectFit="contain"
              style={{ objectPosition: "left" }}
            />
          </div>
        </div>
      </div>
      <div className="xl:container px-4 md:mt-12 mt-6">
        <div className="border-t border-white border-opacity-20 pt-3">
          <p className="text-white text-sm">{settings?.footer_text}</p>
        </div>
      </div>
    </footer>
  );
};

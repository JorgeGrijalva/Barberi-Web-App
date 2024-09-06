import { useEffect, useRef } from "react";
import TruckIcon from "@/assets/icons/truck";
import CardIcon from "@/assets/icons/card";
import VerifyIcon from "@/assets/icons/verify";
import { useTranslation } from "react-i18next";

const content = [
  {
    icon: <TruckIcon />,
    label: "shipping",
  },
  {
    icon: <CardIcon />,
    label: "payment",
  },
  {
    icon: <VerifyIcon />,
    label: "verify",
  },
];

export const CheckoutProgress = ({ currentStep }: { currentStep: number }) => {
  const { t } = useTranslation();
  const c = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = c.current?.getContext("2d");
    const radius = 140;
    const circum = 2 * Math.PI * radius;
    const lineWidth = 12;
    const gap = 9 + lineWidth; // compensate for rounded caps

    const sections = 3;
    const dashOn = circum / sections - gap;
    const norMalizedValue = currentStep / sections; // normalize value on sections

    ctx?.clearRect(0, 0, 300, 300); // clear previous drawn content
    ctx?.setTransform(1, 0, 0, 1, 150, 150); // translate to center
    ctx?.rotate(-Math.PI * 0.5); // rotate -90° so 0° is up

    ctx?.beginPath();
    ctx?.arc(0, 0, radius, Math.PI * 2 * norMalizedValue, Math.PI * 2); // circle from angle x t
    ctx?.setLineDash([dashOn, gap]); // set dash pattern
    if (ctx) {
      ctx.lineDashOffset = -gap * 0.9; // center dash gap
      ctx.lineWidth = lineWidth; // line width
      ctx.lineCap = "round"; // line width
      ctx.strokeStyle = "#fff"; // base color
    }
    ctx?.stroke(); // render it

    ctx?.beginPath();
    ctx?.arc(0, 0, radius, 0, Math.PI * 2 * norMalizedValue); // render arc based on angle x t
    if (ctx) {
      ctx.strokeStyle = "#16AA16"; // top color
    }
    ctx?.stroke();

    ctx?.setLineDash([]); // reset dash
    ctx?.setTransform(1, 0, 0, 1, 0, 0); // reset transforms
    // render text here
    ctx?.stroke();
  }, [currentStep]);
  return (
    <div className="relative">
      <canvas height={300} ref={c} />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="flex items-center justify-center flex-col h-full">
          <div className="flex items-center justify-center rounded-full bg-green w-[70px] h-[70px] drop-shadow-green">
            {content[currentStep - 1].icon}
          </div>
          <strong className="text-xl mt-4">{t(content[currentStep - 1].label)}</strong>
          <span className="text-sm">
            {content[currentStep]
              ? `${t("next.step")} ${content[currentStep].label}`
              : t("last.step")}
          </span>
        </div>
      </div>
    </div>
  );
};

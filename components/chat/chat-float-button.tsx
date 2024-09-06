import Message3FillIcon from "remixicon-react/Message3FillIcon";
import clsx from "clsx";

export const ChatFloatButton = ({ onClick, top }: { onClick: () => void; top?: boolean }) => (
  <div
    className={clsx("absolute md:right-4 right-2 z-10", top ? "bottom-28 md:bottom-7" : "bottom-7")}
  >
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-primary flex items-center justify-center md:w-[68px] md:h-[68px] w-14 h-14 aspect-square text-white drop-shadow-3xl outline-none focus-ring hover:brightness-90 transition-all active:translate-y-px"
    >
      <Message3FillIcon size={30} />
    </button>
  </div>
);

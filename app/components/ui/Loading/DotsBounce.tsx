import React from "react";

type DotsProps = {
  theme?: "primary" | "secondary";
};
export const DotsBounce = ({ theme = "primary" }: DotsProps) => {
  const circleStyles = {
    primary: "bg-primary",
    secondary: "bg-secondary",
  }[theme];

  const wrapStyles = {
    primary: "bg-secondary",
    secondary: "bg-primary",
  }[theme];
  return (
    <div className={`inline-block rounded-lg px-4 pt-3 pb-1 ${wrapStyles}`}>
      <div className="inline-flex gap-2 justify-center items-center dark:invert">
        <span className="sr-only">Loading...</span>
        <div
          className={`h-[14px] w-[14px] rounded-full animate-bounce [animation-delay:-0.3s] ${circleStyles}`}
        ></div>
        <div
          className={`h-[14px] w-[14px] rounded-full animate-bounce [animation-delay:-0.15s] ${circleStyles}`}
        ></div>
        <div className={`h-[14px] w-[14px] rounded-full animate-bounce ${circleStyles}`}></div>
      </div>
    </div>
  );
};

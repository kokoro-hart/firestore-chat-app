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
    <div className={`inline-block rounded-lg px-4 pb-1 pt-3 ${wrapStyles}`}>
      <div className="inline-flex items-center justify-center gap-2 dark:invert">
        <span className="sr-only">Loading...</span>
        <div
          className={`h-[14px] w-[14px] animate-bounce rounded-full [animation-delay:-0.3s] ${circleStyles}`}
        />
        <div
          className={`h-[14px] w-[14px] animate-bounce rounded-full [animation-delay:-0.15s] ${circleStyles}`}
        />
        <div className={`h-[14px] w-[14px] animate-bounce rounded-full ${circleStyles}`} />
      </div>
    </div>
  );
};

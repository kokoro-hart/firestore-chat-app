import { IconConnection } from "@/app/assets";

type PageSpinnerProps = {
  label?: string;
};

export const PageSpinner = ({ label = "Loading..." }: PageSpinnerProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <IconConnection className="text-primary" />
      <p className="text-primary">{label}</p>
    </div>
  );
};

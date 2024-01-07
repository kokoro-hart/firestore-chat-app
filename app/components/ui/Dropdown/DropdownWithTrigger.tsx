import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui";

type DropdownWithTriggerProps = {
  triggerButton: ReactNode;
  title?: string;
  list: ReactNode[];
};

export const DropdownWithTrigger = ({ triggerButton, title, list }: DropdownWithTriggerProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {title && (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          {list.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

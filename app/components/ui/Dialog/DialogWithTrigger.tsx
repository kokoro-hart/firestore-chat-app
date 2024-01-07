import React, { ComponentProps, PropsWithChildren, ReactNode, useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui";

type DialogWithTriggerProps = {
  triggerButton: ReactNode;
  confirmProps?: ComponentProps<typeof Button>;
  cancelProps?: ComponentProps<typeof Button>;
  title?: string;
  description?: string;
  children: (methods: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
};

export const DialogWithTrigger = ({
  triggerButton,
  title,
  description,
  children,
  confirmProps,
  cancelProps,
}: DialogWithTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasHeader = title || description;
  const hasFooter = confirmProps || cancelProps;
  const onClose = () => setIsOpen(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        {hasHeader && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children({
          isOpen,
          onClose,
        })}
        {hasFooter && (
          <DialogFooter className="sm:justify-end">
            {cancelProps && (
              <DialogClose asChild>
                <Button {...cancelProps} />
              </DialogClose>
            )}
            {confirmProps && (
              <DialogClose asChild>
                <Button {...confirmProps} />
              </DialogClose>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

"use client";
import * as React from "react";
import { useState, useEffect, useRef, ChangeEvent, useCallback } from "react";

import { cn } from "@/app/libs/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

const useAutoResizeTextArea = () => {
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = textAreaRef.current;
    if (!element) {
      return;
    }

    const { borderTopWidth, borderBottomWidth } = getComputedStyle(element);
    const resizeHandler = () => {
      element.style.height = "auto";
      element.style.height = `calc(${element.scrollHeight}px + ${borderTopWidth} + ${borderBottomWidth})`;
    };

    const observer = new ResizeObserver(resizeHandler);

    resizeHandler();

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value]);

  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement> | undefined) => {
    setValue(event?.target?.value ?? "");
  }, []);

  const reset = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
    setValue("");
  }, []);

  return {
    textAreaRef,
    handleChange,
    reset,
  };
};

export { Textarea, useAutoResizeTextArea };

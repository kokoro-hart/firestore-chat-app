import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm, UseFormReturn, SubmitHandler, UseFormProps, FieldValues } from "react-hook-form";
import { ZodType, ZodTypeDef } from "zod";

import { RHFProvider } from "./Utils";

type FormProps<TFormValues extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  schema?: Schema;
};

export const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<unknown, ZodTypeDef, unknown>,
>({
  onSubmit,
  children,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const methods = useForm<TFormValues>({ resolver: schema && zodResolver(schema), ...options });
  return (
    <RHFProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={id} noValidate>
        {children(methods)}
      </form>
    </RHFProvider>
  );
};

"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useAddProductMutation } from "@/lib/features/product/productApi";

const formSchema = z.object({
  title: z.string().min(2, "Bug title must be at least 5 characters."),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
});

export function ProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  //
  const [addProduct, { data, isLoading, isSuccess }] = useAddProductMutation();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // call hook of RDK query (useAddProductMutation) to add product

    const mockProduct = {
      title: data.title,
      price: 1000,
      description: data.description,
      categoryId: 3,
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUSEwyX2rrv8xxB4Ots2hkD3KrsrJF0QVSCg&s",
      ],
    };
    try {
      const payload = await addProduct(mockProduct).unwrap();
      console.log("payload: ", payload);

      toast.success("Product added successfully");
      form.reset();

      /*if (isSuccess) {
        toast.success("Success");
      }
      {
        toast.error("Failed");
      }
      console.log("err");*/
    } catch (err) {
      toast.error("Failed to add product");
      console.log("err", err);
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        {/* {isSuccess && toast.success("Success")} */}
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          {isSuccess
            ? `Product: ${data.title} added successfully!`
            : "Please fill out the form to report a bug."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading} form="form-rhf-demo">
            {isLoading ? "Submitting" : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

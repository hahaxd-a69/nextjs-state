"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type Product,
} from "@/lib/features/product/productApi";

type EditFormValues = {
  title: string;
  price: number;
  description: string;
};

export function ProductList() {
  const { data, isLoading } = useGetProductsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [editTarget, setEditTarget] = React.useState<Product | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    defaultValues: { title: "", price: 0, description: "" },
  });

  // Sync form values whenever a product is selected for editing
  React.useEffect(() => {
    if (editTarget) {
      setValue("title", editTarget.title);
      setValue("price", editTarget.price);
      setValue("description", editTarget.description);
    }
  }, [editTarget, setValue]);

  function openEditDialog(product: Product) {
    setEditTarget(product);
    setEditOpen(true);
  }

  function closeEditDialog() {
    setEditOpen(false);
    setTimeout(() => {
      setEditTarget(null);
      reset({ title: "", price: 0, description: "" });
    }, 300);
  }

  // ── handleUpdate: wrapped with handleSubmit so validation runs first ───────
  const handleUpdate = handleSubmit(async (values: EditFormValues) => {
    if (!editTarget) return;
    try {
      await updateProduct({
        id: editTarget.id,
        title: values.title,
        price: Number(values.price), // ← always coerce to number
        description: values.description,
      }).unwrap();
      toast.success(`"${values.title}" updated successfully!`);
      closeEditDialog();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update product. Please try again.");
    }
  });

  function openDeleteDialog(product: Product) {
    setDeleteTarget(product);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      toast.success(`"${deleteTarget.title}" deleted successfully!`);
      setDeleteOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete product. Please try again.");
    }
  }

  return (
    <>
      {/* ── Table ───────────────────────────────────────────────────────── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-8"
              >
                Loading products…
              </TableCell>
            </TableRow>
          )}
          {data?.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>$ {product.price}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(product)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => openDeleteDialog(product)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ── Edit Dialog ──────────────────────────────────────────────────── */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => !open && closeEditDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Editing <strong>{editTarget?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <form id="edit-product-form" onSubmit={handleUpdate}>
            <div className="flex flex-col gap-4 py-2">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Product title"
                  autoComplete="off"
                  {...register("title", {
                    required: "Title is required.",
                    minLength: { value: 2, message: "Min 2 characters." },
                  })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  {...register("price", {
                    required: "Price is required.",
                    min: {
                      value: 0.01,
                      message: "Price must be greater than 0.",
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  className="min-h-20 resize-none"
                  placeholder="Product description…"
                  {...register("description", {
                    required: "Description is required.",
                    minLength: { value: 10, message: "Min 10 characters." },
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </form>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-product-form"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ────────────────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.title}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

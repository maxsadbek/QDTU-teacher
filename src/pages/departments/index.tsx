import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useCollage } from "@/hooks/collage/useCollage";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import { useDeleteDepartment } from "@/hooks/department/useDeleteDeportment";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useEditDepartment } from "@/hooks/department/useEditDepartment";
import {
  useModalActions,
  useModalEditData,
  useModalIsOpen,
} from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Image } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";

type DepartmentFormValues = {
  name: string;
  collegeId: string;
  image: File | null;
};

type DepartmentRow = {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number;
};

function createColumns(
  onEdit: (row: DepartmentRow) => void,
  onDelete: (row: DepartmentRow) => void,
  page: number,
): ColumnDef<DepartmentRow>[] {
  return [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {page * 10 + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "imgUrl",
      header: "Rasm",
      cell: ({ row }) => {
        const imgUrl = row.original.imgUrl;
        return imgUrl ? (
          <Image
            src={imgUrl}
            alt={row.original.name}
            width={30}
            height={30}
            preview={{ mask: null }}
            className="w-12 h-12 rounded-md object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[13px]">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Kafedra",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="inline-flex items-center gap-1.5 border-[1px] border-blue-200 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Pencil className="size-3" />
            Tahrirlash
          </button>
          <ConfirmPopover onConfirm={() => onDelete(row.original)}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 border-[1px] border-red-200 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="size-3" />
              O'chirish
            </button>
          </ConfirmPopover>
        </div>
      ),
    },
  ];
}

export default function Departments() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const search = searchParams.get("name") ?? "";

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const setSearch = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("name", value);
      else next.delete("name");
      next.set("page", "0");
      return next;
    });
  };

  const isOpen = useModalIsOpen();
  const editData = useModalEditData() as DepartmentRow | null;
  const { open, close } = useModalActions();
  const isEdit = editData !== null;

  const { data: departmentResponse, isLoading } = useDepartment();
  const { data: collageResponse } = useCollage();

  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment();
  const { mutate: editDepartment, isPending: isEditing } = useEditDepartment();
  const { mutate: deleteDepartment } = useDeleteDepartment();

  const departments = departmentResponse?.data ?? [];
  const totalElements = departmentResponse?.data?.totalElements ?? 0;
  const totalPage = departmentResponse?.data?.totalPages ?? 0;

  const colleges = useMemo(
    () =>
      (collageResponse?.data ?? []).map((c: any) => ({
        value: String(c.id),
        label: c.name,
      })),
    [collageResponse],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    defaultValues: { name: "", collegeId: "", image: null },
  });

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        collegeId: String(editData.collegeId),
        image: null,
      });
    }
  }, [editData, reset]);

  // Backend'dan kelgan ma'lumotni sortlash va filterlash
  const sortedData = useMemo(() => {
    let filteredData = [...departments].sort((a, b) => b.id - a.id);

    if (search.trim()) {
      filteredData = filteredData.filter((department) =>
        department.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filteredData;
  }, [departments, search]);

  const columns = useMemo(
    () =>
      createColumns(
        (row) => open(row),
        (row) => deleteDepartment({ id: row.id }),
        page,
      ),
    [open, deleteDepartment, page],
  );

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = (values: DepartmentFormValues) => {
    const commonData = {
      name: values.name,
      collegeId: Number(values.collegeId),
      image: values.image ?? undefined,
    };

    if (isEdit) {
      editDepartment(
        { ...commonData, id: editData.id, imgUrl: editData.imgUrl },
        { onSuccess: handleClose },
      );
    } else {
      createDepartment(
        { ...commonData, image: values.image || undefined },
        { onSuccess: handleClose },
      );
    }
  };

  const isSubmitting = isCreating || isEditing;

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Kafedralar soni"
        count={totalElements}
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={() => open()}
        addLabel="Kafedra qo'shish"
      />

      <DataTable
        columns={columns}
        data={sortedData}
        isLoading={isLoading}
        page={page}
        totalPage={totalPage}
        onPageChange={setPage}
      />

      <Modal
        open={isOpen}
        onClose={handleClose}
        title={isEdit ? "Kafedrani tahrirlash" : "Kafedra qo'shish"}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 py-2"
        >
          <div className="flex flex-col gap-2">
            <Label>Rasm</Label>
            <Controller
              name="image"
              control={control}
              rules={{ required: isEdit ? false : "Rasm tanlanishi shart" }}
              render={({ field }) => (
                <FileInput
                  type="image"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.image && (
              <span className="text-[12px] text-red-500">
                {errors.image.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Fakultet (Kollej)</Label>
            <Controller
              name="collegeId"
              control={control}
              rules={{ required: "Fakultet tanlanishi shart" }}
              render={({ field }) => (
                <SearchableSelect
                  options={colleges}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Fakultetni tanlang"
                  searchPlaceholder="Fakultet qidirish..."
                />
              )}
            />
            {errors.collegeId && (
              <span className="text-[12px] text-red-500">
                {errors.collegeId.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="department-name">Kafedra nomi</Label>
            <Input
              id="department-name"
              placeholder="Masalan: Gumanitar fanlar kafedrasi"
              {...register("name", {
                required: "Kafedra nomi kiritilishi shart",
              })}
            />
            {errors.name && (
              <span className="text-[12px] text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Yuklanmoqda..."
                : isEdit
                  ? "Saqlash"
                  : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

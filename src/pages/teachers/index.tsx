import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTeacherSheetActions } from "@/store/teacherSheet";
import { TeacherSheet } from "./teacher-sheet";
import { useGetAllTeachers } from "@/hooks/teacher/useGetAllTeachers";
import { useDeleteTeacher } from "@/hooks/teacher/useDeleteTeacher";
import type { Teacher } from "@/features/teacher/teacher.type";
import { Image } from "antd";

function createColumns(
  onEdit: (row: Teacher) => void,
  onDelete: (row: Teacher) => void,
  page: number,
): ColumnDef<Teacher>[] {
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
      accessorKey: "fullName",
      header: "F.I.Sh.",
      cell: ({ row }) => {
        const fullName = row.original.fullName || "";
        const imgUrl = row.original.imgUrl;

        return (
          <div className="flex items-center gap-2.5">
            {imgUrl ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex shrink-0"
              >
                <Image
                  src={imgUrl}
                  width={32}
                  height={32}
                  alt={fullName}
                  preview={{
                    mask: null,
                  }}
                  className="rounded-md object-cover border border-emerald-100 cursor-pointer"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[13px] shrink-0">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-[13px]">{fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Telefon",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-[13px]">
          {row.original.phoneNumber || "Mavjud emas"}
        </span>
      ),
    },
    {
      accessorKey: "lavozim",
      header: "Lavozim",
      cell: ({ row }) => (
        <span className="inline-flex items-center bg-blue-50 text-blue-700 text-[12px] font-medium px-2 py-0.5 rounded-full">
          {row.original.lavozim || "Belgilanmagan"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Amallar</div>,
      cell: ({ row }) => (
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
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

export default function Teachers() {
  const { open } = useTeacherSheetActions();
  const navigate = useNavigate();
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
      if (value) {
        next.set("name", value);
      } else {
        next.delete("name");
      }
      next.set("page", "0");
      return next;
    });
  };

  const { data: teacherResponse, isLoading } = useGetAllTeachers({
    page,
    search: search || undefined,
    name: search || undefined,
    fullName: search || undefined,
    phoneNumber: search || undefined,
  });
  const { mutate: deleteTeacher } = useDeleteTeacher();

  const teachers = teacherResponse?.data?.body ?? [];
  const totalElements = teacherResponse?.data?.totalElements ?? 0;
  const totalPage = teacherResponse?.data?.totalPage ?? 0;

  const columns = useMemo(
    () =>
      createColumns(
        (row) => open(row),
        (row) => deleteTeacher(row.id),
        page,
      ),
    [open, deleteTeacher, page],
  );

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="O'qituvchilar soni"
        count={totalElements}
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={() => open()}
        addLabel="O'qituvchi qo'shish"
      />

      <DataTable
        columns={columns}
        data={teachers}
        isLoading={isLoading}
        page={page}
        totalPage={totalPage}
        onPageChange={setPage}
        onRowClick={(row) => navigate(`/teachers/${row.id}`)}
      />

      <TeacherSheet />
    </div>
  );
}

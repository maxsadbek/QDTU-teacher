import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { MaslahatModal } from "@/pages/teachers/detail/detail-modals/maslahat-modal";
import { MaslahatTab } from "@/pages/teachers/detail/detail-tabs/maslahat-tab";
import { useGetConsultationByUser } from "@/hooks/consultation/useGetConsultationByUser";
import { useModalActions } from "@/store/modalStore";
import { useUser } from "@/hooks/user/useUser";

export default function TeacherConsultations() {
  const { data: userData, isLoading: isUserLoading } = useUser();
  const { open } = useModalActions();

  const userId = userData?.id;

  const { data: response, isLoading: isDataLoading } = useGetConsultationByUser(
    userId ? Number(userId) : 0,
    0,
    10,
  );

  const consultations = response?.data?.body ?? [];
  const totalElements = response?.data?.totalElements ?? 0;

  const maslahatData = consultations.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    year: String(item.year),
    head: item.leader,
    subscribe: item.member ? "HA" : "YO'Q",
    status: item.finishedEnum,
    pdfName: item.fileUrl ?? null,
  }));

  if (isUserLoading) return <div className="p-10 text-center">Yuklanmoqda...</div>;
  if (!userId) return <div className="p-10 text-center text-red-500">Foydalanuvchi ID topilmadi.</div>;

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Maslahatlar"
        count={totalElements}
        addLabel="Maslahat qo'shish"
        showSearch={false}
        onAdd={() => open({ _type: "maslahat" })}
      />

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="p-0 sm:p-2">
          <MaslahatTab
            data={maslahatData}
            isLoading={isDataLoading}
          />
        </div>
      </div>

      <MaslahatModal />
    </div>
  );
}
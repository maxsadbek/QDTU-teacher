import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
// UI Components
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import type { Teacher } from "@/features/teacher/teacher.type";
import { useGetAwardByUser } from "@/hooks/award/useGetAwardByUser";
import { useCollage } from "@/hooks/collage/useCollage";
import { useGetConsultationByUser } from "@/hooks/consultation/useGetConsultationByUser";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";
import { useGetNazoratByUser } from "@/hooks/nazorat/useGetNazoratByUser";
import { useProfileComplateById } from "@/hooks/profile-complate/useProfileComplate";
import { useGetPublicationByUser } from "@/hooks/publication/useGetPublicationByUser";
// Faolliklar uchun hooklar
import { useGetResearchByUser } from "@/hooks/research/useGetResearchByUser";
import { useGetTeacherById } from "@/hooks/teacher/useGetTeacherById";
import {
  type UpdateTeacherProfileInput,
  useUpdateTeacherProfile,
} from "@/hooks/teacher/useUpdateTeacherProfile";
// Hooks & Store
import { useModalActions } from "@/store/modalStore";
import { Skeleton } from "@/ui/skeleton";
import {
  computeTeacherProfileCompletionPercent,
  normalizeCompletionValue,
} from "@/utils/profile-completion";
import { ActivityTabs } from "./activity-tabs";
import { MaslahatModal } from "./detail-modals/maslahat-modal";
import { MukofotModal } from "./detail-modals/mukofot-modal";
import { NashrModal } from "./detail-modals/nashr-modal";
import { PublicationModal } from "./detail-modals/publication-modal";
// Modals
import { ResearchModal } from "./detail-modals/research-modal";
import type { ProfileFormData } from "./detail-profile/profile-edit";
import { ProfileForm } from "./detail-profile/profile-form";
import { ProfileSidebar } from "./detail-profile/profile-sidebar";
import { StatsGrid } from "./stats-grid";

const TAB_CONFIG: Record<
  string,
  { label: string; addLabel: string; modalType: string }
> = {
  researches: {
    label: "Tadqiqotlar",
    addLabel: "Tadqiqot qo'shish",
    modalType: "research",
  },
  publications: {
    label: "Nashrlar",
    addLabel: "Nashr qo'shish",
    modalType: "publication",
  },
  supervision: {
    label: "Nazoratlar",
    addLabel: "Nazorat qo'shish",
    modalType: "nazorat",
  },
  activities: {
    label: "Maslahatlar",
    addLabel: "Maslahat qo'shish",
    modalType: "maslahat",
  },
  awards: {
    label: "Mukofotlar",
    addLabel: "Mukofot qo'shish",
    modalType: "mukofot",
  },
};

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open } = useModalActions();
  const teacherId = Number(id);

  const [activeTab, setActiveTab] = useState("researches");

  // API Ma'lumotlari
  const { data: response, isLoading } = useGetTeacherById(teacherId);
  const { data: profileComplate, isLoading: isProfileComplateLoading } =
    useProfileComplateById(teacherId);
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateTeacherProfile();
  const { data: collageResponse } = useCollage();
  const { data: departmentResponse } = useDepartment();
  const { data: lavozimResponse } = useLavozim();

  // Faolliklar ma'lumotlarini olish
  const { data: res } = useGetResearchByUser(teacherId);
  const { data: naz } = useGetNazoratByUser(teacherId);
  const { data: pub } = useGetPublicationByUser(teacherId);
  const { data: con } = useGetConsultationByUser(teacherId);
  const { data: award } = useGetAwardByUser(teacherId);

  // Statistikani yig'ish
  const stats = useMemo(
    () => ({
      researches: res?.data?.totalElements ?? 0,
      publications: pub?.data?.totalElements ?? 0,
      supervision: naz?.data?.totalElements ?? 0,
      activities: con?.data?.totalElements ?? 0,
      awards: award?.data?.totalElements ?? 0,
    }),
    [res, pub, naz, con, award],
  );

  // Select opsiyalari
  const positionsOptions = useMemo(
    () =>
      (lavozimResponse?.data ?? []).map((l) => ({
        value: String(l.id),
        label: l.name,
      })),
    [lavozimResponse],
  );

  const facultiesOptions = useMemo(() => {
    const faculties = collageResponse?.data ?? [];

    // Test with static data first
    const testOptions = [
      { value: "1", label: "Davolash fakulteti" },
      { value: "2", label: "Pediatriya fakulteti" },
      { value: "3", label: "Stomatologiya fakulteti" },
    ];

    const options =
      faculties.length > 0
        ? faculties.map((c) => ({
            value: String(c.id),
            label: c.name,
          }))
        : testOptions;

    return options;
  }, [collageResponse]);

  const departmentsOptions = useMemo(
    () =>
      (departmentResponse?.data ?? []).map((d) => ({
        value: String(d.id),
        label: d.name,
      })),
    [departmentResponse],
  );

  const teacherData = response?.data as Teacher | undefined;

  const completionForSidebar = useMemo(() => {
    if (!teacherData) {
      return { percentage: undefined as number | undefined, loading: false };
    }
    if (isProfileComplateLoading) {
      return { percentage: undefined, loading: true };
    }
    const fromApi = normalizeCompletionValue(profileComplate);
    return {
      percentage:
        fromApi ?? computeTeacherProfileCompletionPercent(teacherData),
      loading: false,
    };
  }, [teacherData, profileComplate, isProfileComplateLoading]);

  const teacher = teacherData;

  const profileValues: ProfileFormData = useMemo(
    () => ({
      fullName: teacher?.fullName ?? "",
      email: teacher?.email ?? "",
      age: teacher?.age != null ? String(teacher.age) : "",
      phone: teacher?.phone ?? "",
      department:
        departmentsOptions.find((d) => d.label === teacher?.departmentName)
          ?.value ?? "",
      position:
        positionsOptions.find((l) => l.label === teacher?.lavozimName)?.value ??
        "",
      bio: teacher?.biography ?? "",
      additionalInfo: teacher?.input ?? "",
      specialty: teacher?.profession ?? "",
      orcId: teacher?.orcId ?? "",
      scopusId: teacher?.scopusId ?? "",
      scienceId: teacher?.scienceId ?? "",
      researcherId: teacher?.researcherId ?? "",
      image: teacher?.imageUrl ?? null,
      resume: teacher?.fileUrl ?? null,
    }),
    [teacher, departmentsOptions, positionsOptions],
  );

  if (isLoading) return <Skeleton className="h-screen w-full" />;

  if (!teacher)
    return (
      <div className="p-10 text-center text-muted-foreground">
        O'qituvchi topilmadi.
      </div>
    );

  const sidebarAvatarUrl = teacher.imageUrl?.trim() || null;

  const handleProfileSubmit = (formData: ProfileFormData) => {
    const payload: UpdateTeacherProfileInput & {
      image?: File;
      file?: File;
    } = {
      id: teacherId,
      fullName: formData.fullName,
      email: formData.email,
      age: formData.age?.trim() ? Number(formData.age) : 0,
      phoneNumber: formData.phone,
      departmentId: Number(formData.department),
      lavozmId: Number(formData.position),
      gender: teacher.gender,
      biography: formData.bio ?? "",
      input: formData.additionalInfo ?? "",
      profession: formData.specialty ?? "",
      orcId: formData.orcId ?? "",
      scopusId: formData.scopusId ?? "",
      scienceId: formData.scienceId ?? "",
      researcherId: formData.researcherId ?? "",
    };

    if (formData.image instanceof File) {
      payload.image = formData.image;
    } else if (formData.image === null) {
      payload.imageUrl = "";
    } else if (typeof formData.image === "string") {
      payload.imageUrl = formData.image;
    } else {
      payload.imageUrl = teacher.imageUrl ?? "";
    }

    if (formData.resume instanceof File) {
      payload.file = formData.resume;
    } else if (formData.resume === null) {
      payload.fileUrl = "";
    } else if (typeof formData.resume === "string") {
      payload.fileUrl = formData.resume;
    } else {
      payload.fileUrl = teacher.fileUrl ?? "";
    }

    updateProfile(payload);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <nav className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <button
          type="button"
          className="hover:text-foreground transition-colors"
          onClick={() => navigate("/teachers")}
        >
          O'qituvchilar
        </button>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{teacher.fullName}</span>
      </nav>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <ProfileSidebar
          profile={profileValues}
          teacher={teacher}
          avatarUrl={sidebarAvatarUrl}
        />
        <div className="w-full lg:flex-1">
          <ProfileForm
            defaultValues={profileValues}
            facultiesOptions={facultiesOptions}
            positionsOptions={positionsOptions}
            departmentsOptions={departmentsOptions}
            onSubmit={handleProfileSubmit}
            isPending={isUpdatingProfile}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <TableToolbar
          countLabel={TAB_CONFIG[activeTab].label}
          count={stats[activeTab as keyof typeof stats] || 0}
          showSearch={false}
          addLabel={TAB_CONFIG[activeTab].addLabel}
          onAdd={() => open({ _type: TAB_CONFIG[activeTab].modalType })}
        />

        <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4">
          {/* SubStats ma'lumotlari mavjud bo'lsa shuni yuboring, hozircha mock 0 lar o'rniga */}
          <StatsGrid stats={stats} />
        </div>
      </div>

      <ResearchModal />
      <PublicationModal />
      <NashrModal />
      <MaslahatModal />
      <MukofotModal />
    </div>
  );
}

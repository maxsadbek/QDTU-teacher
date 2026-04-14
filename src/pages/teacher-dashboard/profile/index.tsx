import { useCollage } from "@/hooks/collage/useCollage";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";
import { useGetTeacherById } from "@/hooks/teacher/useGetTeacherById";
import type { UpdateTeacherProfileInput } from "@/hooks/teacher/useUpdateTeacherProfile";
import { useUpdateTeacherProfile } from "@/hooks/teacher/useUpdateTeacherProfile";
import { useUser } from "@/hooks/user/useUser";
import type { ProfileFormData } from "@/pages/teachers/detail/detail-profile/profile-edit";
import { ProfileForm } from "@/pages/teachers/detail/detail-profile/profile-form";
import { ProfileSidebar } from "@/pages/teachers/detail/detail-profile/profile-sidebar";
import { Skeleton } from "@/ui/skeleton";
import { useMemo } from "react";

export default function TeacherProfile() {
  const { data: userData } = useUser();

  // Teacher ma'lumotlarini API dan olish kerak (teacher-dashboard uchun)
  const { data: teacherData } = useGetTeacherById(Number(userData?.id));

  // Teacher ma'lumotlari
  const teacher = teacherData?.data || {
    id: userData?.id,
    fullName: userData?.fullName || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    biography: userData?.biography ?? "",
    input: "",
    age: userData?.age?.toString() || "",
    gender: userData?.gender ?? true,
    orcId: userData?.orcId ?? "",
    scopusId: userData?.scopusId ?? "",
    scienceId: userData?.scienceId ?? "",
    researcherId: userData?.researcherId ?? "",
    imageUrl: userData?.imageUrl ?? "",
    fileUrl: "",
    profession: "",
    departmentName: userData?.departmentName ?? "",
    lavozimName: userData?.lavozimName ?? "",
  };

  console.log("=== TEACHER DATA DEBUG ===");
  console.log("Teacher data from API:", teacher);
  console.log("Teacher fields:", {
    fullName: teacher?.fullName,
    email: teacher?.email,
    phone: teacher?.phone,
    age: teacher?.age,
    gender: teacher?.gender,
    biography: teacher?.biography,
    departmentName: teacher?.departmentName,
    lavozimName: teacher?.lavozimName,
    imageUrl: teacher?.imageUrl,
    fileUrl: teacher?.fileUrl,
    profession: teacher?.profession,
    input: teacher?.input,
    orcId: teacher?.orcId,
    scopusId: teacher?.scopusId,
    scienceId: teacher?.scienceId,
    researcherId: teacher?.researcherId,
  });
  console.log("========================");
  const { mutate: updateProfile, isPending } = useUpdateTeacherProfile();

  const handleProfileSubmit = (formData: ProfileFormData) => {
    console.log("handleProfileSubmit called with:", formData);

    // Teacher dan id olamiz
    if (!teacher?.id) {
      console.log("No teacher ID found, returning");
      return;
    }

    console.log("Creating payload...");
    const payload: UpdateTeacherProfileInput & {
      image?: File;
      file?: File;
    } = {
      id: teacher.id,
      fullName: formData.fullName,
      email: formData.email,
      age: formData.age?.trim() ? Number(formData.age) : 0,
      phoneNumber: formData.phone,
      departmentId: Number(formData.department),
      lavozmId: Number(formData.position),
      gender: teacher?.gender ?? true,
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
      payload.imageUrl = teacher?.imageUrl ?? "";
    }

    if (formData.resume instanceof File) {
      payload.file = formData.resume;
    } else if (formData.resume === null) {
      payload.fileUrl = "";
    } else if (typeof formData.resume === "string") {
      payload.fileUrl = formData.resume;
    } else {
      payload.fileUrl = teacher?.fileUrl ?? "";
    }

    console.log("Calling updateProfile with payload:", payload);
    console.log("Payload keys:", Object.keys(payload));
    console.log("Payload as JSON:", JSON.stringify(payload, null, 2));

    // Network tabda ko'rish uchun
    console.log(
      `%c=== API CALL DETAILS ===`,
      "background: #ff0000; color: white;",
    );
    console.log(
      `%cEndpoint: /teacher/update-profile`,
      "background: #0000ff; color: white;",
    );
    console.log(`%cMethod: PUT`, "background: #0000ff; color: white;");
    console.log(`%cPayload:`, "background: #0000ff; color: white;", payload);
    console.log(
      `%c========================`,
      "background: #ff0000; color: white;",
    );

    updateProfile(payload);
  };

  const { data: collageResponse } = useCollage();
  const { data: departmentResponse } = useDepartment();
  const { data: lavozimResponse } = useLavozim();

  const isLoading = false;

  const positionsOptions = useMemo(
    () =>
      (lavozimResponse?.data ?? []).map((l) => ({
        value: String(l.id),
        label: l.name,
      })),
    [lavozimResponse],
  );

  const facultiesOptions = useMemo(() => {
    console.log("Collage response:", collageResponse);
    const faculties = collageResponse?.data ?? [];
    console.log("Raw faculties:", faculties);

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

    console.log("Final options:", options);
    return options;
  }, [collageResponse]);

  const departmentsOptions = useMemo(() => {
    console.log("Department response:", departmentResponse);
    const departments = departmentResponse?.data ?? [];
    console.log("Raw departments:", departments);

    // Test with static data first
    const testOptions = [
      { value: "1", label: "Davolash fakulteti" },
      { value: "2", label: "Pediatriya fakulteti" },
      { value: "3", label: "Stomatologiya fakulteti" },
    ];

    const options =
      departments.length > 0
        ? departments.map((d) => ({
            value: String(d.id),
            label: d.name,
          }))
        : testOptions;

    console.log("Final options:", options);
    return options;
  }, [departmentResponse]);

  const profileValues: ProfileFormData | null = useMemo(() => {
    if (!teacher) return null;

    return {
      fullName: teacher.fullName,
      email: teacher.email,
      age: teacher.age != null ? String(teacher.age) : "",
      phone: teacher.phone, // phone field
      faculty:
        facultiesOptions.find((f) => f.label === teacher.departmentName)
          ?.value ?? "",
      department:
        departmentsOptions.find((d) => d.label === teacher.departmentName)
          ?.value ?? "",
      position:
        positionsOptions.find((l) => l.label === teacher.lavozimName)?.value ??
        "",
      bio: teacher.biography,
      additionalInfo: teacher.input, // Teacher dan input olinadi
      specialty: teacher.profession, // Teacher dan profession olinadi
      orcId: teacher.orcId,
      scopusId: teacher.scopusId,
      scienceId: teacher.scienceId,
      researcherId: teacher.researcherId,
      image: teacher.imageUrl,
      resume: teacher.fileUrl, // Teacher dan fileUrl olinadi
    };
  }, [teacher, departmentsOptions, positionsOptions, facultiesOptions]);

  if (isLoading) return <Skeleton className="h-125 w-full rounded-2xl" />;
  if (!profileValues)
    return <div className="p-10 text-center">Ma'lumot topilmadi.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <ProfileSidebar profile={profileValues} />
      <div className="w-full lg:flex-1">
        <ProfileForm
          defaultValues={profileValues}
          facultiesOptions={facultiesOptions}
          positionsOptions={positionsOptions}
          departmentsOptions={departmentsOptions}
          onSubmit={handleProfileSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  );
}

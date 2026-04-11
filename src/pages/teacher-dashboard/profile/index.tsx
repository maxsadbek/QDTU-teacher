import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";
import type { UpdateTeacherProfileInput } from "@/hooks/teacher/useUpdateTeacherProfile";
import { useUpdateTeacherProfile } from "@/hooks/teacher/useUpdateTeacherProfile";
import { useUser } from "@/hooks/user/useUser";
import type { ProfileFormData } from "@/pages/teachers/detail/detail-profile/profile-edit";
import { ProfileForm } from "@/pages/teachers/detail/detail-profile/profile-form";
import { ProfileSidebar } from "@/pages/teachers/detail/detail-profile/profile-sidebar";
import { useUserInfo } from "@/store/userStore";
import { Skeleton } from "@/ui/skeleton";
import { useMemo } from "react";

export default function TeacherProfile() {
  const userInfo = useUserInfo();

  const { data: userData, isLoading: isUserLoading } = useUser();
  const { mutate: updateProfile, isPending } = useUpdateTeacherProfile();

  const handleProfileSubmit = (data: ProfileFormData) => {
    if (!userInfo?.id) return;

    const updateData: UpdateTeacherProfileInput = {
      id: Number(userInfo.id),
      fullName: data.fullName,
      phoneNumber: data.phone,
      email: data.email,
      biography: data.bio,
      input: data.additionalInfo,
      age: data.age ? Number(data.age) : 0,
      orcId: data.orcId,
      scopusId: data.scopusId,
      scienceId: data.scienceId,
      researcherId: data.researcherId,
      gender: true,
      profession: data.specialty,
      lavozmId: Number(data.position) || 0,
      departmentId: Number(data.department) || 0,
      image: data.image || undefined,
      imageUrl: typeof data.image === "string" ? data.image : undefined,
      file: data.resume || undefined,
      fileUrl: typeof data.resume === "string" ? data.resume : undefined,
    };

    console.log("Submitting data:", updateData);
    updateProfile(updateData);
  };

  const { data: collageResponse, isLoading: isCollageLoading } = useCollage();
  const { data: departmentResponse, isLoading: isDepLoading } = useDepartment();
  const { data: lavozimResponse, isLoading: isPosLoading } = useLavozim();

  const isLoading =
    isUserLoading || isCollageLoading || isDepLoading || isPosLoading;

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
    if (!userData) return null;

    return {
      fullName: userData.fullName ?? "",
      email: userData.email ?? "",
      phone: userData.phone ?? "",
      age: userData.age?.toString() ?? "",
      // Backend'dan nomlar keladi, ularni ID ga o'tkazamiz
      faculty:
        facultiesOptions.find((f) => f.label === userData.facultyName)?.value ??
        "",
      department:
        departmentsOptions.find((d) => d.label === userData.departmentName)
          ?.value ?? "",
      position:
        positionsOptions.find((l) => l.label === userData.lavozimName)?.value ??
        "",
      image: userData.imageUrl ?? null,
      resume: null, // UserProfile da fileUrl yo'q
      // ... qolgan fieldlar
      bio: userData.biography ?? "",
      additionalInfo: "", // UserProfile da input yo'q
      specialty: "", // UserProfile da profession yo'q
      orcId: userData.orcId ?? "",
      scopusId: userData.scopusId ?? "",
      scienceId: userData.scienceId ?? "",
      researcherId: userData.researcherId ?? "",
    };
  }, [userData, facultiesOptions, departmentsOptions, positionsOptions]);

  if (isLoading) return <Skeleton className="h-[500px] w-full rounded-2xl" />;
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

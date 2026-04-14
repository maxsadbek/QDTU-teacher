import { fileService } from "@/features/file/file.service";
import { teacherService } from "@/features/teacher/teacher.service";
import type { UpdateTeacherProfileDTO } from "@/features/teacher/teacher.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UpdateTeacherProfileInput {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  biography: string;
  input: string;
  age?: number;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  gender: boolean;
  profession: string;
  lavozmId: number;
  departmentId: number;
  image?: File | string;
  imageUrl?: string;
  file?: File | string;
  fileUrl?: string;
}
export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTeacherProfileInput) => {
      console.log("=== UPDATE PROFILE MUTATION START ===");
      console.log("Input:", input);

      const lavozimId = Number(input.lavozmId);
      const departmentId = Number(input.departmentId);

      console.log(
        "Parsed IDs - lavozimId:",
        lavozimId,
        "departmentId:",
        departmentId,
      );

      if (!Number.isFinite(lavozimId) || lavozimId <= 0) {
        console.log("ERROR: Invalid lavozimId");
        throw new Error("Lavozimni tanlang");
      }
      if (!Number.isFinite(departmentId) || departmentId <= 0) {
        console.log("ERROR: Invalid departmentId");
        throw new Error("Kafedrani tanlang");
      }

      const rawAge = input.age;
      const ageValue =
        rawAge === undefined || rawAge === null ? 0 : Number(rawAge);
      if (!Number.isFinite(ageValue) || ageValue < 0) {
        console.log("ERROR: Invalid age:", ageValue);
        throw new Error("Yosh qiymati noto'g'ri");
      }

      // 1. Fayllarni tayyorlash: bo'sh string yubormaymiz
      const uploadedImageUrl =
        input.image instanceof File
          ? await fileService.uploadImage(input.image)
          : undefined;
      const existingImageUrl =
        typeof input.imageUrl === "string" && input.imageUrl.trim().length > 0
          ? input.imageUrl
          : undefined;

      const uploadedFileUrl =
        input.file instanceof File
          ? await fileService.uploadPdf(input.file)
          : undefined;
      const existingFileUrl =
        typeof input.fileUrl === "string" && input.fileUrl.trim().length > 0
          ? input.fileUrl
          : undefined;

      console.log(
        "File URLs - uploadedImageUrl:",
        uploadedImageUrl,
        "existingImageUrl:",
        existingImageUrl,
      );
      console.log(
        "File URLs - uploadedFileUrl:",
        uploadedFileUrl,
        "existingFileUrl:",
        existingFileUrl,
      );

      // 2. Swagger talab qilgan formatda DTO shakllantirish
      const data: UpdateTeacherProfileDTO = {
        id: Number(input.id),
        fullName: input.fullName,
        phoneNumber: input.phoneNumber || "",
        email: input.email || "",
        biography: input.biography || "",
        input: input.input || "",
        age: ageValue,
        orcId: input.orcId || "",
        scopusId: input.scopusId || "",
        scienceId: input.scienceId || "",
        researcherId: input.researcherId || "",
        gender: Boolean(input.gender),
        imageUrl: uploadedImageUrl ?? existingImageUrl ?? "",
        fileUrl: uploadedFileUrl ?? existingFileUrl ?? "",
        profession: input.profession || "",
        lavozmId: lavozimId,
        departmentId: departmentId,
      };

      console.log("Final DTO data being sent to backend:", data);
      console.log("=== CALLING TEACHER SERVICE ===");

      const result = await teacherService.updateProfile(data);

      console.log("=== BACKEND RESPONSE ===");
      console.log("Result:", result);
      console.log("=== UPDATE PROFILE MUTATION END ===");

      return result;
    },
    onSuccess: (result, variables) => {
      console.log("=== UPDATE PROFILE SUCCESS ===");
      console.log("Success result:", result);
      console.log("Variables:", variables);

      // Cache invalidation
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["user-me"] }); // User data ni ham invalidate qilish
      queryClient.invalidateQueries({ queryKey: ["user"] }); // useUser hook ni ham invalidate qilish

      if (variables?.id != null) {
        queryClient.invalidateQueries({
          queryKey: ["teachers", variables.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["profile-complate", variables.id],
        });
      }

      console.log("Cache invalidated, showing toast");
      toast.success("Profil yangilandi");
    },
    onError: (error: unknown) => {
      console.log("=== UPDATE PROFILE ERROR ===");
      console.log("Error:", error);

      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: string }).message === "string"
          ? (error as { message: string }).message
          : "Saqlashda xatolik";
      console.log("Error message:", message);
      toast.error(message);
    },
  });
}

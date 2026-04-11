import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fileService } from "@/features/file/file.service";
import { teacherService } from "@/features/teacher/teacher.service";
import type { UpdateTeacherProfileDTO } from "@/features/teacher/teacher.type";

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
			const lavozimId = Number(input.lavozmId);
			const departmentId = Number(input.departmentId);

			if (!Number.isFinite(lavozimId) || lavozimId <= 0) {
				throw new Error("Lavozimni tanlang");
			}
			if (!Number.isFinite(departmentId) || departmentId <= 0) {
				throw new Error("Kafedrani tanlang");
			}

			const rawAge = input.age;
			const ageValue = rawAge === undefined || rawAge === null ? 0 : Number(rawAge);
			if (!Number.isFinite(ageValue) || ageValue < 0) {
				throw new Error("Yosh qiymati noto'g'ri");
			}

			// 1. Fayllarni tayyorlash: bo'sh string yubormaymiz
			const uploadedImageUrl = input.image instanceof File ? await fileService.uploadImage(input.image) : undefined;
			const existingImageUrl =
				typeof input.imageUrl === "string" && input.imageUrl.trim().length > 0 ? input.imageUrl : undefined;

			const uploadedFileUrl = input.file instanceof File ? await fileService.uploadPdf(input.file) : undefined;
			const existingFileUrl =
				typeof input.fileUrl === "string" && input.fileUrl.trim().length > 0 ? input.fileUrl : undefined;

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

			return teacherService.updateProfile(data);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			if (variables?.id != null) {
				queryClient.invalidateQueries({
					queryKey: ["teachers", variables.id],
				});
				queryClient.invalidateQueries({
					queryKey: ["profile-complate", variables.id],
				});
			}
			toast.success("Profil yangilandi");
		},
		onError: (error: unknown) => {
			const message =
				error &&
				typeof error === "object" &&
				"message" in error &&
				typeof (error as { message?: string }).message === "string"
					? (error as { message: string }).message
					: "Saqlashda xatolik";
			toast.error(message);
		},
	});
}

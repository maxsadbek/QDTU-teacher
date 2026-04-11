import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileComplateService } from "@/features/profile-complate/profile-complate.service";
import type { ProfileComplate, ProfileComplateUpdateDTO } from "@/features/profile-complate/profile-complate.type";

export function useProfileComplate() {
	return useQuery({
		queryKey: ["profile-complate"],
		queryFn: () => profileComplateService.get(),
		select: (response) => response.data,
	});
}

export function useProfileComplateById(id: number) {
	return useQuery({
		queryKey: ["profile-complate", id],
		queryFn: async (): Promise<ProfileComplate | undefined> => {
			try {
				const response = await profileComplateService.getById(id);
				return response.data;
			} catch {
				return undefined;
			}
		},
		enabled: !!id,
		retry: false,
	});
}

export function useUpdateProfileComplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ProfileComplateUpdateDTO) => profileComplateService.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile-complate"] });
			toast.success("Profile ma'lumotlari muvaffaqiyatli yangilandi");
		},
		onError: (error: { message: string }) => {
			toast.error(error.message || "Profile yangilashda xatolik");
		},
	});
}

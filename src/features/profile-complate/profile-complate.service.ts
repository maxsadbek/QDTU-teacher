import { apiClient } from "@/api/client";
import { PROFILE_COMPLATE } from "@/constants/apiEndpoint";
import type {
	ProfileComplateResponse,
	ProfileComplateUpdateDTO,
	ProfileComplateUpdateResponse,
} from "./profile-complate.type";

export const profileComplateService = {
	get() {
		return apiClient.get<ProfileComplateResponse>(PROFILE_COMPLATE.GET);
	},

	getById(id: number) {
		return apiClient.get<ProfileComplateResponse>(PROFILE_COMPLATE.GET_BY_ID.replace(":id", id.toString()), {
			skipErrorToast: true,
		});
	},

	update(data: ProfileComplateUpdateDTO) {
		return apiClient.put<ProfileComplateUpdateResponse>(PROFILE_COMPLATE.UPDATE, data);
	},
};

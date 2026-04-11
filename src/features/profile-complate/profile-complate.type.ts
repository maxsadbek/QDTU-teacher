export interface ProfileComplate {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  biography: string;
  age: number;
  gender: boolean;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  imageUrl: string;
  fileUrl: string;
  profession: string;
  departmentName: string;
  lavozimName: string;
  isCompleted: boolean;
  completionPercentage: number;
}

export interface ProfileComplateUpdateDTO {
  fullName?: string;
  email?: string;
  phone?: string;
  biography?: string;
  age?: number;
  gender?: boolean;
  orcId?: string;
  scopusId?: string;
  scienceId?: string;
  researcherId?: string;
  imageUrl?: string;
  fileUrl?: string;
  profession?: string;
  departmentId?: number;
  lavozimId?: number;
}

export interface ProfileComplateResponse {
  success: boolean;
  message: string;
  data: ProfileComplate;
}

export interface ProfileComplateUpdateResponse {
  success: boolean;
  message: string;
  data: string;
}

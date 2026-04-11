import type { Teacher } from "@/features/teacher/teacher.type";

function hasMeaningfulString(value: unknown): boolean {
	return value != null && String(value).trim() !== "";
}

/**
 * Backend turli nomlar yoki string ("85") bilan qaytishi mumkin.
 */
export function normalizeCompletionValue(source: unknown): number | undefined {
	if (source == null) return undefined;

	if (typeof source === "number" && Number.isFinite(source)) {
		return Math.min(100, Math.max(0, source));
	}

	if (typeof source === "string") {
		const n = Number(source.replace(",", ".").trim());
		if (Number.isFinite(n)) return Math.min(100, Math.max(0, n));
		return undefined;
	}

	if (typeof source === "object") {
		const keys = [
			"completionPercentage",
			"completionPercent",
			"profileCompletionPercent",
			"profileCompletion",
			"completion",
			"percent",
			"percentage",
		] as const;
		const o = source as Record<string, unknown>;
		for (const k of keys) {
			if (k in o && o[k] !== undefined && o[k] !== null) {
				const nested = normalizeCompletionValue(o[k]);
				if (nested !== undefined) return nested;
			}
		}
	}

	return undefined;
}

/**
 * profile-complate endpoint ishlamasa ham, maydonlar bo'yicha taxminiy foiz.
 */
export function computeTeacherProfileCompletionPercent(teacher: Teacher): number {
	const checks: boolean[] = [
		hasMeaningfulString(teacher.fullName),
		hasMeaningfulString(teacher.email),
		hasMeaningfulString(teacher.phone),
		hasMeaningfulString(teacher.biography),
		hasMeaningfulString(teacher.input),
		hasMeaningfulString(teacher.profession),
		hasMeaningfulString(teacher.imageUrl),
		hasMeaningfulString(teacher.fileUrl),
		hasMeaningfulString(teacher.orcId),
		hasMeaningfulString(teacher.scopusId),
		hasMeaningfulString(teacher.scienceId),
		hasMeaningfulString(teacher.researcherId),
		hasMeaningfulString(teacher.departmentName),
		hasMeaningfulString(teacher.lavozimName),
		typeof teacher.age === "number" && teacher.age > 0,
	];

	const done = checks.filter(Boolean).length;
	if (checks.length === 0) return 0;
	return Math.round((done / checks.length) * 100);
}

export interface ProfileCompletionField {
	key: string;
	label: string;
}

export interface ProfileCompletionResult {
	percentage: number;
	completedFields: ProfileCompletionField[];
	missingRequiredFields: ProfileCompletionField[];
	allFields: ProfileCompletionField[];
}

/**
 * Sidebar / checklist uchun maydonlar bo'yicha batafsil natija.
 */
export function calculateProfileCompletion(teacher: Teacher): ProfileCompletionResult {
	const fields: { key: string; label: string; done: boolean }[] = [
		{ key: "fullName", label: "To'liq ism", done: hasMeaningfulString(teacher.fullName) },
		{ key: "email", label: "Email", done: hasMeaningfulString(teacher.email) },
		{ key: "phone", label: "Telefon", done: hasMeaningfulString(teacher.phone) },
		{ key: "biography", label: "Biografiya", done: hasMeaningfulString(teacher.biography) },
		{ key: "input", label: "Qo'shimcha ma'lumot", done: hasMeaningfulString(teacher.input) },
		{ key: "profession", label: "Mutaxassislik", done: hasMeaningfulString(teacher.profession) },
		{ key: "imageUrl", label: "Profil rasmi", done: hasMeaningfulString(teacher.imageUrl) },
		{ key: "fileUrl", label: "Rezyume (PDF)", done: hasMeaningfulString(teacher.fileUrl) },
		{ key: "orcId", label: "OrcID", done: hasMeaningfulString(teacher.orcId) },
		{ key: "scopusId", label: "Scopus ID", done: hasMeaningfulString(teacher.scopusId) },
		{ key: "scienceId", label: "Science ID", done: hasMeaningfulString(teacher.scienceId) },
		{ key: "researcherId", label: "Researcher ID", done: hasMeaningfulString(teacher.researcherId) },
		{ key: "departmentName", label: "Kafedra", done: hasMeaningfulString(teacher.departmentName) },
		{ key: "lavozimName", label: "Lavozim", done: hasMeaningfulString(teacher.lavozimName) },
		{ key: "age", label: "Yosh", done: typeof teacher.age === "number" && teacher.age > 0 },
	];

	const completedFields: ProfileCompletionField[] = fields
		.filter((f) => f.done)
		.map(({ key, label }) => ({ key, label }));
	const missingRequiredFields: ProfileCompletionField[] = fields
		.filter((f) => !f.done)
		.map(({ key, label }) => ({ key, label }));
	const allFields: ProfileCompletionField[] = fields.map(({ key, label }) => ({ key, label }));
	const done = completedFields.length;
	const percentage = fields.length === 0 ? 0 : Math.round((done / fields.length) * 100);

	return {
		percentage,
		completedFields,
		missingRequiredFields,
		allFields,
	};
}

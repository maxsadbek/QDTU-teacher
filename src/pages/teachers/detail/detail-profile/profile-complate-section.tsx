import type { Teacher } from "@/features/teacher/teacher.type";
import { Skeleton } from "@/ui/skeleton";
import { calculateProfileCompletion } from "@/utils/profile-completion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ProfileComplateSectionProps {
  teacher: Teacher;
  displayPercentage: number | undefined;
  isLoading: boolean;
}

export function ProfileComplateSection({
  teacher,
  displayPercentage,
  isLoading,
}: ProfileComplateSectionProps) {
  const local = calculateProfileCompletion(teacher);
  const percentage =
    displayPercentage !== undefined && displayPercentage !== null
      ? Math.min(100, Math.max(0, Math.round(displayPercentage)))
      : local.percentage;
  const isCompleted = percentage >= 100;

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-5 dark:border-teal-900/30 dark:bg-teal-950/10">
        {/* Yuqori qism: Foiz va Status */}
        <div className="flex items-end justify-between mb-3">
          <div className="space-y-1">
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {isCompleted ? "Profil tayyor" : "Profilni to'ldirish"}
            </span>
            <div className="text-3xl font-bold text-teal-900 dark:text-teal-50 leading-none">
              {percentage}%
            </div>
          </div>

          {isCompleted && (
            <CheckCircle2 className="size-6 text-emerald-500 mb-1" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-teal-200/40 dark:bg-teal-800/20">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Kamchiliklar (faqat to'lmagan bo'lsa) */}
        {!isCompleted && (
          <div className="mt-4 flex flex-wrap gap-2">
            {local.allFields
              .filter(
                (f) => !local.completedFields.some((c) => c.key === f.key),
              )
              .slice(0, 3)
              .map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-1.5 rounded-full border border-teal-200/50 bg-white/50 px-3 py-1 dark:border-teal-800/40 dark:bg-teal-950/40"
                >
                  <AlertCircle className="size-3 text-amber-500" />
                  <span className="text-[11px] font-medium text-teal-900/80 dark:text-teal-100/80">
                    {field.label}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

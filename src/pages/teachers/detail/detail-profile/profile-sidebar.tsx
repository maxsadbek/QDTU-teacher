import type { Teacher } from "@/features/teacher/teacher.type";
import type { ProfileFormData } from "@/pages/teachers/detail/detail-profile/profile-edit";
import { Card } from "@/ui/card";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import { ProfileComplateSection } from "./profile-complate-section";

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted-foreground leading-none mb-1">
          {label}
        </span>
        <span className="text-xs font-medium truncate dark:text-zinc-300">
          {value}
        </span>
      </div>
    </div>
  );
}

export function ProfileSidebar({
  profile,
  teacher,
  avatarUrl,
}: {
  profile: ProfileFormData;
  teacher?: Teacher;
  avatarUrl?: string | null;
}) {
  const preview =
    (typeof avatarUrl === "string" && avatarUrl.trim()) ||
    profile.image ||
    null;

  return (
    <div className="w-full lg:w-72 lg:shrink-0 space-y-4">
      <Card className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm min-h-[240px]">
        <div className="flex items-center gap-4 mb-5">
          <div className="size-16 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shrink-0">
            {preview ? (
              <img
                src={preview as string}
                alt="avatar"
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center">
                <UserRound className="size-8 text-slate-300 dark:text-zinc-700" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm truncate dark:text-white uppercase tracking-tight">
              {profile.fullName || "Ism kiritilmagan"}
            </h2>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              {profile.position || "Lavozim yo'q"}
            </p>
          </div>
        </div>

        <div className="pt-1 border-t border-slate-100 dark:border-zinc-900 space-y-0.5">
          <InfoRow
            label="Kafedra"
            value={profile.department || "—"}
            icon={MapPin}
          />
          <InfoRow label="Telefon" value={profile.phone || "—"} icon={Phone} />
          <InfoRow label="Email" value={profile.email || "—"} icon={Mail} />
        </div>
      </Card>

      {teacher && (
        <ProfileComplateSection
          teacher={teacher}
          displayPercentage={undefined}
          isLoading={false}
        />
      )}
    </div>
  );
}

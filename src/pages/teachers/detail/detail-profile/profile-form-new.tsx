import { Fingerprint, Paperclip, Save, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils";
import type { ProfileFormData } from "./profile-edit";

type ProfileFormProps = {
  defaultValues: ProfileFormData;
  positionsOptions: { value: string; label: string }[];
  departmentsOptions: { value: string; label: string }[];
  onSubmit?: (data: ProfileFormData) => void;
  isPending?: boolean;
  readOnly?: boolean;
};

export function ProfileForm({
  defaultValues,
  positionsOptions,
  departmentsOptions,
  onSubmit,
  isPending,
  readOnly = false,
}: ProfileFormProps) {
  const { register, control, handleSubmit } = useForm<ProfileFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined} className="flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-black p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
            <User className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold dark:text-white leading-none">
              Profil sozlamalari
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
              Shaxsiy va ilmiy ma'lumotlaringizni yangilang
            </p>
          </div>
        </div>
        {!readOnly && (
          <Button
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 h-10 px-6 text-xs font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-95"
            disabled={isPending}
          >
            {isPending ? (
              "Saqlanmoqda..."
            ) : (
              <span className="flex items-center gap-2">
                <Save className="size-3.5" /> Saqlash
              </span>
            )}
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="w-full justify-start h-auto bg-slate-50/50 dark:bg-zinc-900/50 p-1.5 gap-1.5 border-b border-slate-200 dark:border-zinc-800 rounded-none">
            <TabsTrigger
              value="main"
              className="rounded-lg px-5 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all"
            >
              Asosiy ma'lumotlar
            </TabsTrigger>
            <TabsTrigger
              value="extra"
              className="rounded-lg px-5 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all"
            >
              Qo'shimcha ma'lumotlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="p-6 mt-0 space-y-8">
            {/* Grid for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div className="col-span-full mb-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="size-3" /> Umumiy ma'lumotlar
                </h3>
              </div>

              <div className="col-span-full space-y-1.5">
                <Label htmlFor="fullName" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  F.I.SH
                </Label>
                <Input
                  id="fullName"
                  className="h-10 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30 focus:ring-blue-500/20"
                  disabled={readOnly}
                  {...register("fullName")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  Email manzili
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-10 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30"
                  disabled={readOnly}
                  {...register("email")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  Telefon raqami
                </Label>
                <Input
                  id="phone"
                  className="h-10 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30"
                  disabled={readOnly}
                  {...register("phone")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="age" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  Yoshi
                </Label>
                <Input
                  id="age"
                  type="number"
                  className="h-10 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30"
                  disabled={readOnly}
                  {...register("age")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specialty" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  Mutaxassisligi
                </Label>
                <Input
                  id="specialty"
                  className="h-10 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30"
                  disabled={readOnly}
                  {...register("specialty")}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold dark:text-zinc-400 ml-1">Lavozimi</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={positionsOptions}
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="Lavozimni tanlang"
                      disabled={readOnly}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold dark:text-zinc-400 ml-1">Kafedrasi</Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={departmentsOptions}
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="Kafedrani tanlang"
                      disabled={readOnly}
                    />
                  )}
                />
              </div>

              {/* Scientific IDs Section */}
              <div className="col-span-full pt-4 mt-2 border-t border-slate-100 dark:border-zinc-900">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Fingerprint className="size-3" /> Ilmiy Identifikatorlar
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: "orcId",
                      label: "OrcID",
                      color: "border-orange-500/20",
                    },
                    {
                      id: "scopusId",
                      label: "Scopus",
                      color: "border-blue-500/20",
                    },
                    {
                      id: "scienceId",
                      label: "Science",
                      color: "border-amber-500/20",
                    },
                    {
                      id: "researcherId",
                      label: "Researcher",
                      color: "border-rose-500/20",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-3 rounded-lg border bg-slate-50/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800",
                        item.color,
                      )}
                    >
                      <Label
                        htmlFor={item.id}
                        className="font-bold text-[10px] text-muted-foreground uppercase mb-1 block"
                      >
                        {item.label}
                      </Label>
                      <Input
                        id={item.id}
                        className="h-7 bg-transparent border-none p-0 text-xs shadow-none focus-visible:ring-0"
                        disabled={readOnly}
                        {...register(item.id as any)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extra" className="p-6 mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  Biografiya
                </Label>
                <Textarea
                  id="bio"
                  maxLength={250}
                  className="min-h-35 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30 resize-none p-4 text-sm"
                  disabled={readOnly}
                  {...register("bio")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-[12px] font-bold dark:text-zinc-400 ml-1">
                  Qo'shimcha ma'lumotlar
                </Label>
                <Textarea
                  id="additionalInfo"
                  maxLength={250}
                  className="min-h-35 rounded-lg border-slate-200 dark:border-zinc-800 dark:bg-zinc-900/30 resize-none p-4 text-sm"
                  disabled={readOnly}
                  {...register("additionalInfo")}
                />
              </div>
            </div>

            <Separator className="dark:bg-zinc-900" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-5 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/20">
                <Label className="text-[12px] font-bold flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-white dark:bg-zinc-800 rounded shadow-sm border dark:border-zinc-700">
                    <Paperclip className="size-3 text-blue-500" />
                  </div>
                  Rezyume yuklash (PDF)
                </Label>
                <Controller
                  name="resume"
                  control={control}
                  render={({ field }) => (
                    <FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} disabled={readOnly} />
                  )}
                />
              </div>

              <div className="p-5 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/20">
                <Label className="text-[12px] font-bold flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-white dark:bg-zinc-800 rounded shadow-sm border dark:border-zinc-700">
                    <User className="size-3 text-emerald-500" />
                  </div>
                  Profil rasmi
                </Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => <FileInput type="image" value={field.value} onChange={field.onChange} disabled={readOnly} />}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}

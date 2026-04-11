import useLogin from "@/hooks/auth/useLogin";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

type SignInForm = {
  phone: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const login = useLogin();

  const form = useForm<SignInForm>({
    defaultValues: { phone: "", password: "" },
  });

  const handleFinish = (values: SignInForm) => {
    login.mutate({ phone: values.phone, password: values.password });
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-1">
        <h2 className="text-[22px] font-bold text-[#002B5B] uppercase tracking-tighter">
          Sign In
        </h2>
        <div className="h-0.5 w-10 bg-[#002B5B]" />
      </div>

      <Form {...form} {...props}>
        <form onSubmit={form.handleSubmit(handleFinish)} className="space-y-5">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
									ID / Phone
                </label>
                <FormControl>
                  <Input
                    placeholder="ID / Phone number"
                    className="h-10 border-zinc-200 rounded-none focus-visible:ring-0 focus-visible:border-[#002B5B] bg-transparent px-0 border-t-0 border-x-0 border-b-2 transition-all placeholder:text-zinc-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Parolni kiriting
                </label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 border-zinc-200 rounded-none focus-visible:ring-0 focus-visible:border-[#002B5B] bg-transparent px-0 border-t-0 border-x-0 border-b-2 transition-all placeholder:text-zinc-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-11 bg-[#002B5B] hover:bg-black text-white text-[12px] font-bold tracking-[2px] uppercase rounded-none transition-all duration-300 mt-4"
          >
            {login.isPending ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Authorize"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm;

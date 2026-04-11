import { GLOBAL_CONFIG } from "@/global-config";
import { useUserInfo, useUserToken } from "@/store/userStore";
import { useEffect } from "react";
import { Navigate } from "react-router";
import LoginForm from "./login-form";

function LoginPage() {
  const token = useUserToken();
  const userInfo = useUserInfo();

  useEffect(() => {
    document.title = "Login | System Access";
  }, []);

  if (token.accessToken) {
    const isTeacher = userInfo.roles?.some((r) => r.code === "ROLE_TEACHER");
    return (
      <Navigate
        to={isTeacher ? "/teacher-dashboard" : GLOBAL_CONFIG.defaultRoute}
        replace
      />
    );
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#F8F9FA]">
      <div className="w-full max-w-[380px] bg-white border border-zinc-200 rounded-none shadow-[20px_20px_60px_#d9d9d9,-20px_-20px_60px_#ffffff] overflow-hidden">
        {/* Yuqoridagi dekorativ ko'k chiziq */}
        <div className="h-1.5 w-full bg-[#002B5B]" />
        <div className="p-8">
          <LoginForm /> 
        </div>
      </div>
    </div>
  );
}
export default LoginPage;

// Import Dependencies
import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Local Imports
import Logo from "@/assets/appLogo.svg?react";
import { Button, Card, Input, InputErrorMsg } from "@/components/ui";
import { Combobox } from "@/components/shared/form/StyledCombobox";
import { useAuthContext } from "@/app/contexts/auth/context";
import apiHelper from "@/utils/apiHelper";
import { AuthFormValues, ROLE_OPTIONS, schema } from "./schema";
import { Page } from "@/components/shared/Page";
import logo from "@/assets/logo.png";
// ----------------------------------------------------------------------

const roleOptions = ROLE_OPTIONS.map((r) => ({
  id: r.value,
  name: r.label,
}));

const BRANCH_APP_URL =
  (import.meta.env.VITE_BRANCH_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-branch`;

const EMPLOYEE_APP_URL =
  (import.meta.env.VITE_EMPLOYEE_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-employee`;

const VENDOR_APP_URL =
  (import.meta.env.VITE_VENDOR_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-adminvendor`;

const EXTERNAL_APPS: Record<
  string,
  { endpoint: string; url: string; extra?: Record<string, unknown> }
> = {
  branch: { endpoint: "/branch/login", url: BRANCH_APP_URL },
  employee: { endpoint: "/employees/login", url: EMPLOYEE_APP_URL },
  "vendor-admin": {
    endpoint: "/vendor-admin/login",
    url: VENDOR_APP_URL,
    extra: { platform: "web" },
  },
};

export default function SignIn() {
  const navigate = useNavigate();
  const { login, errorMessage } = useAuthContext();
  const [appError, setAppError] = useState("");
  const [appLoading, setAppLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { role: "superadmin", email: "", password: "" },
  });

  const handleAppLogin = async (data: AuthFormValues) => {
    const app = EXTERNAL_APPS[data.role];
    if (!app || appLoading) return;

    setAppError("");
    setAppLoading(true);

    try {
      const res: any = await apiHelper.post(app.endpoint, {
        email: data.email.trim(),
        password: data.password,
        ...(app.extra || {}),
      });

      const body = res?.data?.token ? res.data : res;
      const { token, user } = body || {};

      if (!token) throw new Error("Token not received from server");

      toast.success("Login successfully");

      const params = new URLSearchParams({
        token,
        user: JSON.stringify(user ?? null),
      });

      window.location.href = `${app.url.replace(/\/$/, "")}/auth-callback#${params.toString()}`;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setAppError(msg);
      setAppLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormValues) => {
    setAppError("");

    if (EXTERNAL_APPS[data.role]) {
      await handleAppLogin(data);
      return;
    }

    const success = await login({ email: data.email, password: data.password });

    if (success) {
      toast.success("Login successfully");
      navigate("/select-company", { replace: true });
    }
  };

  const shownError = appError || errorMessage || "";

  return (
    <Page title="Login">
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full">
          <div className="grid min-h-screen grid-cols-1 gap-0 overflow-hidden lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center bg-white p-6 sm:p-8 lg:p-10">
              <Card
                className="w-full rounded-lg bg-transparent p-5 lg:p-7"
                style={{ overflow: "visible" }}
              >
                {/* Company Logo */}
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                  <img
                    src={logo}
                    alt="KrushiMall"
                    className="h-14 w-auto object-contain sm:h-28"
                  />
                </div>
                <div className="border-primary-600 dark:border-primary-400 w-full rounded-[40px] border-y-[6px]"></div>

                <div className="mt-6 text-left">
                  <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                    Welcome to{" "}
                    <span className="text-primary-600">KrushiMall</span>
                  </h2>
                  {/* <p className="mt-1 leading-relaxed text-gray-600">
                    Please sign in to continue
                  </p> */}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <div className="mt-6 space-y-4">
                    <Controller
                      name="role"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Combobox
                          data={roleOptions}
                          displayField="name"
                          value={
                            roleOptions.find((opt) => opt.id === field.value) ||
                            null
                          }
                          onChange={(v: any) => {
                            const opt = Array.isArray(v) ? v[0] : v;
                            if (opt) field.onChange(opt.id);
                          }}
                          placeholder="Select Role"
                          label="Login As"
                          searchFields={["name"]}
                          error={fieldState.error?.message}
                        />
                      )}
                    />

                    <Input
                      label="Email"
                      placeholder="Enter Email"
                      prefix={
                        <EnvelopeIcon
                          className="size-5 text-gray-500"
                          strokeWidth="1"
                        />
                      }
                      className="focus:border-primary border-gray-300 bg-white text-gray-800"
                      {...register("email")}
                      error={errors?.email?.message}
                    />
                    <Input
                      label="Password"
                      placeholder="Enter Password"
                      type="password"
                      prefix={
                        <LockClosedIcon
                          className="size-5 text-gray-500"
                          strokeWidth="1"
                        />
                      }
                      className="focus:border-primary border-gray-300 bg-white text-gray-800"
                      {...register("password")}
                      error={errors?.password?.message}
                    />
                  </div>

                  <div className="mt-2">
                    <InputErrorMsg when={shownError !== ""}>
                      {shownError}
                    </InputErrorMsg>
                  </div>

                  <Button
                    type="submit"
                    className="mt-5 w-full"
                    color="primary"
                    disabled={appLoading}
                  >
                    {appLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Side - Image (same as before) */}
            <div className="relative hidden items-center justify-center lg:flex">
              <img
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
                alt="company"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </Page>
  );
}

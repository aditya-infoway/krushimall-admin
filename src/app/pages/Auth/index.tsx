// Import Dependencies
import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// Local Imports
import Logo from "@/assets/appLogo.svg?react";
import { Button, Card, Input, InputErrorMsg } from "@/components/ui";
import { Combobox } from "@/components/shared/form/Combobox";
import { useAuthContext } from "@/app/contexts/auth/context";
import apiHelper from "@/utils/apiHelper";
import { AuthFormValues, ROLE_OPTIONS, schema } from "./schema";
import { Page } from "@/components/shared/Page";
import { useNavigate } from "react-router";
// ----------------------------------------------------------------------

const roleOptions = ROLE_OPTIONS.map((r) => ({
  id: r.value,
  name: r.label,
}));

// Env ho to wahi, warna same origin ka path (live ke liye)
const BRANCH_APP_URL =
  (import.meta.env.VITE_BRANCH_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-branch`;

const EMPLOYEE_APP_URL =
  (import.meta.env.VITE_EMPLOYEE_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-employee`;

const VENDOR_APP_URL =
  (import.meta.env.VITE_VENDOR_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-adminvendor`;

// Alag app wale roles: login endpoint + us app ka URL (+ extra body agar chahiye)
const EXTERNAL_APPS: Record<
  string,
  { endpoint: string; url: string; extra?: Record<string, unknown> }
> = {
  branch: { endpoint: "/branch/login", url: BRANCH_APP_URL },
  employee: { endpoint: "/employees/login", url: EMPLOYEE_APP_URL },
  "vendor-admin": {
    endpoint: "/vendor-admin/login",
    url: VENDOR_APP_URL,
    extra: { platform: "web" }, // controller isse expiresIn decide karta hai
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
    defaultValues: {
      role: "superadmin",
      email: "",
      password: "",
    },
  });

  // Branch / Employee / Vendor: unki API se login, phir unki app par token ke saath redirect
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

      // apiHelper kabhi res.data deta hai, kabhi direct body
      const body = res?.data?.token ? res.data : res;
      const { token, user } = body || {};

      if (!token) {
        throw new Error("Token not received from server");
      }

      toast.success("Login successfully");

      // Hash (#) server ko nahi jata, aur dusri app use turant clear kar degi
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

    const success = await login({
      email: data.email,
      password: data.password,
    });

    if (success) {
      toast.success("Login successfully");

      navigate("/select-company", {
        replace: true,
      });
    }
  };

  const shownError = appError || errorMessage || "";

  return (
    <Page title="Login">
      <div className="flex h-screen">
        <div className="dark:bg-dark-700 flex w-full items-center justify-center bg-white xl:w-1/2">
          <div className="w-full max-w-md px-6">
            <div className="text-center">
              <Logo className="mx-auto size-16" />

              <div className="mt-4">
                <h2 className="dark:text-dark-100 text-2xl font-semibold text-gray-600">
                  Welcome Back
                </h2>

                <p className="dark:text-dark-300 text-gray-400">
                  Please sign in to continue
                </p>
              </div>
            </div>

            <Card className="mt-6 rounded-lg p-5 lg:p-7">
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Login As
                    </label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Combobox
                          data={roleOptions}
                          value={
                            roleOptions.find((opt) => opt.id === field.value) ||
                            null
                          }
                          placeholder="Select Role"
                          error={fieldState.error?.message}
                          onChange={(selectedOpt: any) => {
                            if (selectedOpt) field.onChange(selectedOpt.id);
                          }}
                          displayField="name"
                          searchFields={["name"]}
                        />
                      )}
                    />
                  </div>

                  <Input
                    label="Email"
                    placeholder="Enter Email"
                    prefix={
                      <EnvelopeIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...register("email")}
                    error={errors?.email?.message}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    prefix={
                      <LockClosedIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
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
        </div>

        <div className="hidden h-full xl:block xl:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
            alt="company"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </Page>
  );
}
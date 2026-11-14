import * as Yup from "yup";

export const ROLE_OPTIONS = [
  { label: "Super Admin", value: "superadmin" },
  { label: "Branch", value: "branch" },
  { label: "Employee", value: "employee" },
  { label: "Vendor Admin", value: "vendor-admin" },
] as const;

export type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];

const ROLE_VALUES = ROLE_OPTIONS.map((r) => r.value) as RoleValue[];

export interface AuthFormValues {
  role: RoleValue;
  email: string;
  password: string;
}

export const schema = Yup.object().shape({
  role: Yup.mixed<RoleValue>()
    .oneOf(ROLE_VALUES, "Invalid Role")
    .required("Role Required"),

  email: Yup.string()
    .trim()
    .email("Invalid Email")
    .required("Email Required"),

  password: Yup.string()
    .trim()
    .required("Password Required"),
});
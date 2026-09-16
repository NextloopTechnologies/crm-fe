import { z } from "zod";
import { commonFields } from "@/schemas/commonFields";

export const createUserFormSchema = (
  mode: "add" | "edit",
  showAssignToManager: boolean
) =>
  z.object({
    username:  commonFields.username,
    password:  mode === "add" ? commonFields.password : z.string().optional(),
    email:     commonFields.email,
    firstName: commonFields.name("First Name"),
    lastName:  commonFields.name("Last Name"),
    phone:     commonFields.phone,
    roleName: z
      .string()
      .min(1, "Role cannot be null.")
      .regex(
        /^(Admin|Manager|Sales|ADMIN|MANAGER|SALES)$/,
        "Invalid role. Valid values: Admin, Manager, Sales."
      ),
    assignToManagerUsername: showAssignToManager
      ? z.string().min(1, "Manager username is required for SALES user.")
      : z.string().optional(),
  });

export type UserFormData = z.infer<ReturnType<typeof createUserFormSchema>>;
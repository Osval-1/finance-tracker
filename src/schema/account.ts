import * as yup from "yup";

export const createAccountSchema = yup.object({
  name: yup
    .string()
    .required("Account name is required")
    .min(2, "Account name must be at least 2 characters")
    .max(100, "Account name must be less than 100 characters"),

  type: yup
    .string()
    .oneOf(
      ["checking", "savings", "credit", "investment", "loan"],
      "Invalid account type"
    )
    .required("Account type is required"),

  balance: yup
    .number()
    .required("Opening balance is required")
    .min(-999999999.99, "Balance cannot be less than -$999,999,999.99")
    .max(999999999.99, "Balance cannot exceed $999,999,999.99"),

  currency: yup
    .string()
    .required("Currency is required")
    .matches(
      /^[A-Z]{3}$/,
      "Currency must be a valid 3-letter code (e.g., USD)"
    ),

  institution: yup
    .string()
    .required("Institution name is required")
    .min(2, "Institution name must be at least 2 characters")
    .max(100, "Institution name must be less than 100 characters"),

  accountNumber: yup
    .string()
    .optional()
    .matches(
      /^[0-9*-]*$/,
      "Account number can only contain digits, asterisks, and dashes"
    ),

  routingNumber: yup
    .string()
    .optional()
    .matches(
      /^[0-9*-]*$/,
      "Routing number can only contain digits, asterisks, and dashes"
    ),
});

export const updateAccountSchema = yup.object({
  name: yup
    .string()
    .optional()
    .min(2, "Account name must be at least 2 characters")
    .max(100, "Account name must be less than 100 characters"),

  type: yup
    .string()
    .oneOf(
      ["checking", "savings", "credit", "investment", "loan"],
      "Invalid account type"
    )
    .optional(),

  balance: yup
    .number()
    .optional()
    .min(-999999999.99, "Balance cannot be less than -$999,999,999.99")
    .max(999999999.99, "Balance cannot exceed $999,999,999.99"),

  currency: yup
    .string()
    .optional()
    .matches(
      /^[A-Z]{3}$/,
      "Currency must be a valid 3-letter code (e.g., USD)"
    ),

  institution: yup
    .string()
    .optional()
    .min(2, "Institution name must be at least 2 characters")
    .max(100, "Institution name must be less than 100 characters"),

  accountNumber: yup
    .string()
    .optional()
    .matches(
      /^[0-9*-]*$/,
      "Account number can only contain digits, asterisks, and dashes"
    ),

  routingNumber: yup
    .string()
    .optional()
    .matches(
      /^[0-9*-]*$/,
      "Routing number can only contain digits, asterisks, and dashes"
    ),

  isActive: yup.boolean().optional(),
});

export type CreateAccountFormData = yup.InferType<typeof createAccountSchema>;
export type UpdateAccountFormData = yup.InferType<typeof updateAccountSchema>;

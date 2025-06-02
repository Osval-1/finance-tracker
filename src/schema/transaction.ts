import * as yup from "yup";

export const createTransactionSchema = yup.object({
  accountId: yup
    .string()
    .required("Account is required")
    .uuid("Invalid account ID"),

  date: yup
    .date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),

  amount: yup
    .number()
    .required("Amount is required")
    .min(0.01, "Amount must be greater than 0")
    .max(999999999.99, "Amount exceeds maximum allowed"),

  merchant: yup
    .string()
    .required("Merchant/Payee is required")
    .min(1, "Merchant/Payee is required")
    .max(255, "Merchant/Payee name too long"),

  description: yup
    .string()
    .required("Description is required")
    .min(1, "Description is required")
    .max(500, "Description too long"),

  categoryId: yup.string().optional().uuid("Invalid category ID"),

  tags: yup
    .array()
    .of(yup.string().max(50, "Tag too long"))
    .optional()
    .max(10, "Maximum 10 tags allowed"),

  notes: yup.string().optional().max(1000, "Notes too long"),

  isCleared: yup.boolean().optional().default(false),
});

export const updateTransactionSchema = yup.object({
  accountId: yup.string().optional().uuid("Invalid account ID"),

  date: yup.date().optional().max(new Date(), "Date cannot be in the future"),

  amount: yup
    .number()
    .optional()
    .min(0.01, "Amount must be greater than 0")
    .max(999999999.99, "Amount exceeds maximum allowed"),

  merchant: yup
    .string()
    .optional()
    .min(1, "Merchant/Payee cannot be empty")
    .max(255, "Merchant/Payee name too long"),

  description: yup
    .string()
    .optional()
    .min(1, "Description cannot be empty")
    .max(500, "Description too long"),

  categoryId: yup.string().optional().uuid("Invalid category ID"),

  tags: yup
    .array()
    .of(yup.string().max(50, "Tag too long"))
    .optional()
    .max(10, "Maximum 10 tags allowed"),

  notes: yup.string().optional().max(1000, "Notes too long"),

  isCleared: yup.boolean().optional(),

  isReconciled: yup.boolean().optional(),
});

export const transactionFiltersSchema = yup.object({
  startDate: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  endDate: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  accountId: yup.string().optional().uuid("Invalid account ID"),

  accountIds: yup
    .array()
    .of(yup.string().uuid("Invalid account ID"))
    .optional(),

  categoryId: yup.string().optional().uuid("Invalid category ID"),

  categoryIds: yup
    .array()
    .of(yup.string().uuid("Invalid category ID"))
    .optional(),

  minAmount: yup
    .number()
    .optional()
    .min(0, "Minimum amount cannot be negative"),

  maxAmount: yup
    .number()
    .optional()
    .min(0, "Maximum amount cannot be negative"),

  searchTerm: yup.string().optional().max(255, "Search term too long"),

  merchant: yup.string().optional().max(255, "Merchant name too long"),

  tags: yup.array().of(yup.string().max(50, "Tag too long")).optional(),

  isCleared: yup.boolean().optional(),

  isReconciled: yup.boolean().optional(),

  importedFrom: yup
    .string()
    .oneOf(["plaid", "manual", "file"], "Invalid import source")
    .optional(),

  page: yup.number().optional().min(1, "Page must be greater than 0"),

  limit: yup
    .number()
    .optional()
    .min(1, "Limit must be greater than 0")
    .max(1000, "Limit cannot exceed 1000"),

  sortBy: yup
    .string()
    .oneOf(["date", "amount", "merchant", "category"], "Invalid sort field")
    .optional(),

  sortOrder: yup
    .string()
    .oneOf(["asc", "desc"], "Invalid sort order")
    .optional(),
});

export const createTransactionCategorySchema = yup.object({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),

  color: yup
    .string()
    .required("Color is required")
    .matches(
      /^#[0-9A-F]{6}$/i,
      "Color must be a valid hex color (e.g., #FF0000)"
    ),

  icon: yup.string().required("Icon is required").max(50, "Icon name too long"),

  type: yup
    .string()
    .oneOf(["income", "expense", "transfer"], "Invalid category type")
    .required("Category type is required"),

  parentId: yup.string().optional().uuid("Invalid parent category ID"),
});

export type CreateTransactionFormData = yup.InferType<
  typeof createTransactionSchema
>;
export type UpdateTransactionFormData = yup.InferType<
  typeof updateTransactionSchema
>;
export type TransactionFiltersFormData = yup.InferType<
  typeof transactionFiltersSchema
>;
export type CreateTransactionCategoryFormData = yup.InferType<
  typeof createTransactionCategorySchema
>;

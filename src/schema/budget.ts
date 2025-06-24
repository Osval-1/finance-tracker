import * as yup from "yup";

export const createBudgetSchema = yup.object({
  categoryId: yup
    .string()
    .required("Category is required")
    .uuid("Invalid category ID"),

  name: yup
    .string()
    .max(255, "Budget name must be less than 255 characters")
    .optional(),

  amount: yup
    .number()
    .required("Budget amount is required")
    .min(0.01, "Amount must be greater than 0")
    .max(999999999.99, "Amount exceeds maximum allowed"),

  period: yup
    .string()
    .required("Period is required")
    .oneOf(
      ["weekly", "monthly", "quarterly", "yearly", "custom"],
      "Invalid period type"
    ),

  periodStartDate: yup
    .date()
    .optional()
    .when("period", {
      is: "custom",
      then: (schema) =>
        schema.required("Start date is required for custom periods"),
      otherwise: (schema) => schema.optional(),
    }),

  periodEndDate: yup
    .date()
    .optional()
    .when("period", {
      is: "custom",
      then: (schema) =>
        schema.required("End date is required for custom periods"),
      otherwise: (schema) => schema.optional(),
    })
    .when("periodStartDate", (periodStartDate, schema) => {
      if (periodStartDate && periodStartDate.length > 0) {
        return schema.min(
          periodStartDate[0],
          "End date must be after start date"
        );
      }
      return schema;
    }),

  rolloverEnabled: yup.boolean().optional().default(false),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetFiltersSchema = yup.object({
  categoryId: yup.string().uuid("Invalid category ID").optional(),

  period: yup
    .string()
    .oneOf(
      ["weekly", "monthly", "quarterly", "yearly", "custom"],
      "Invalid period type"
    )
    .optional(),

  isActive: yup.boolean().optional(),

  isOverBudget: yup.boolean().optional(),
});

export type CreateBudgetFormData = yup.InferType<typeof createBudgetSchema>;
export type UpdateBudgetFormData = yup.InferType<typeof updateBudgetSchema>;
export type BudgetFiltersFormData = yup.InferType<typeof budgetFiltersSchema>;

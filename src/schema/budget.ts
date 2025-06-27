import * as yup from "yup";

export const createBudgetSchema = yup
  .object({
    categoryId: yup.string().required("Category is required"),

    name: yup.string().required().default(""),

    amount: yup
      .number()
      .required("Budget amount is required")
      .min(0.01, "Amount must be greater than 0")
      .max(999999999.99, "Amount exceeds maximum allowed"),

    period: yup
      .mixed<"weekly" | "monthly" | "quarterly" | "yearly" | "custom">()
      .required("Period is required")
      .oneOf(
        ["weekly", "monthly", "quarterly", "yearly", "custom"],
        "Invalid period type"
      ),

    rolloverEnabled: yup.boolean().required().default(false),

    periodStartDate: yup
      .string()
      .optional()
      .when("period", {
        is: "custom",
        then: (schema) =>
          schema.required("Start date is required for custom periods"),
        otherwise: (schema) => schema.optional(),
      }),

    periodEndDate: yup
      .string()
      .optional()
      .when("period", {
        is: "custom",
        then: (schema) =>
          schema.required("End date is required for custom periods"),
        otherwise: (schema) => schema.optional(),
      })
      .when("periodStartDate", (periodStartDate, schema) => {
        if (periodStartDate && periodStartDate.length > 0) {
          return schema.test(
            "is-after",
            "End date must be after start date",
            function (value) {
              if (!value || !periodStartDate[0]) return true;
              return new Date(value) > new Date(periodStartDate[0]);
            }
          );
        }
        return schema;
      }),
  })
  .required();

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetFiltersSchema = yup.object({
  categoryId: yup.string().uuid("Invalid category ID").optional(),

  period: yup
    .mixed<"weekly" | "monthly" | "quarterly" | "yearly" | "custom">()
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

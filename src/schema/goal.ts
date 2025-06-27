import * as yup from "yup";

export const createGoalSchema = yup.object({
  name: yup
    .string()
    .required("Goal name is required")
    .max(100, "Name must be less than 100 characters"),
  description: yup
    .string()
    .optional()
    .max(500, "Description must be less than 500 characters"),
  targetAmount: yup
    .number()
    .required("Target amount is required")
    .min(1, "Target amount must be greater than 0")
    .max(10000000, "Target amount cannot exceed $10M"),
  targetDate: yup
    .string()
    .required("Target date is required")
    .test("is-future", "Target date must be in the future", (value) => {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  category: yup
    .string()
    .required("Category is required")
    .oneOf([
      "emergency",
      "vacation",
      "home",
      "education",
      "retirement",
      "custom",
    ]),
  priority: yup
    .string()
    .required("Priority is required")
    .oneOf(["low", "medium", "high"]),
  recurringContributionAmount: yup
    .number()
    .optional()
    .min(0, "Contribution amount cannot be negative")
    .max(100000, "Contribution amount cannot exceed $100k"),
  recurringFrequency: yup
    .string()
    .optional()
    .oneOf(["weekly", "biweekly", "monthly", "custom"]),
  notes: yup
    .string()
    .optional()
    .max(1000, "Notes must be less than 1000 characters"),
});

export const goalFiltersSchema = yup.object({
  category: yup
    .string()
    .oneOf([
      "emergency",
      "vacation",
      "home",
      "education",
      "retirement",
      "custom",
    ])
    .optional(),
  priority: yup.string().oneOf(["low", "medium", "high"]).optional(),
  isCompleted: yup.boolean().optional(),
});

export type CreateGoalFormData = yup.InferType<typeof createGoalSchema>;
export type GoalFiltersFormData = yup.InferType<typeof goalFiltersSchema>;

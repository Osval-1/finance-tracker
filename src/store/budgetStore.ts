import { create } from "zustand";
import type { Budget, BudgetFilters } from "@/types/budgets";

interface BudgetStore {
  // UI State
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingBudget: Budget | null;
  selectedBudgets: string[];

  // Filters
  filters: BudgetFilters;
  searchQuery: string;
  sortBy:
    | "name"
    | "amount"
    | "spent"
    | "remaining"
    | "percentUsed"
    | "createdAt";
  sortOrder: "asc" | "desc";

  // Actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (budget: Budget) => void;
  closeEditModal: () => void;

  // Selection
  selectBudget: (budgetId: string) => void;
  deselectBudget: (budgetId: string) => void;
  selectAllBudgets: (budgetIds: string[]) => void;
  clearSelection: () => void;

  // Filters
  setFilters: (filters: Partial<BudgetFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSorting: (
    sortBy: BudgetStore["sortBy"],
    sortOrder: BudgetStore["sortOrder"]
  ) => void;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  // Initial state
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingBudget: null,
  selectedBudgets: [],

  filters: {},
  searchQuery: "",
  sortBy: "createdAt",
  sortOrder: "desc",

  // Modal actions
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openEditModal: (budget: Budget) =>
    set({
      isEditModalOpen: true,
      editingBudget: budget,
    }),
  closeEditModal: () =>
    set({
      isEditModalOpen: false,
      editingBudget: null,
    }),

  // Selection actions
  selectBudget: (budgetId: string) => {
    const { selectedBudgets } = get();
    if (!selectedBudgets.includes(budgetId)) {
      set({ selectedBudgets: [...selectedBudgets, budgetId] });
    }
  },

  deselectBudget: (budgetId: string) => {
    const { selectedBudgets } = get();
    set({
      selectedBudgets: selectedBudgets.filter((id) => id !== budgetId),
    });
  },

  selectAllBudgets: (budgetIds: string[]) => {
    set({ selectedBudgets: budgetIds });
  },

  clearSelection: () => set({ selectedBudgets: [] }),

  // Filter actions
  setFilters: (newFilters: Partial<BudgetFilters>) => {
    const { filters } = get();
    set({ filters: { ...filters, ...newFilters } });
  },

  clearFilters: () => set({ filters: {} }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSorting: (
    sortBy: BudgetStore["sortBy"],
    sortOrder: BudgetStore["sortOrder"]
  ) => {
    set({ sortBy, sortOrder });
  },
}));

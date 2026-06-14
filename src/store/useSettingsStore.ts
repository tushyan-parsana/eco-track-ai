import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UnitSystem = "metric" | "imperial";
export type Currency = "$" | "€" | "£" | "₹";

interface SettingsState {
  unit: UnitSystem;
  currency: Currency;
  setUnit: (unit: UnitSystem) => void;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      unit: "imperial",
      currency: "$",
      setUnit: (unit) => set({ unit }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "ecotrack-settings",
    }
  )
);

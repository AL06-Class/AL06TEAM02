import { Check } from "lucide-react";
import { cn } from "./utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-3", className)}>
      {steps.map((step, index) => {
        const state = index < currentStep ? "done" : index === currentStep ? "current" : "future";
        return (
          <li key={step} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                state === "done" && "border-primary bg-primary text-white",
                state === "current" && "border-ink bg-ink text-white",
                state === "future" && "border-line bg-surface text-muted",
              )}
            >
              {state === "done" ? <Check aria-hidden className="h-4 w-4" /> : index + 1}
            </span>
            <span className={cn(state === "future" ? "text-muted" : "font-semibold text-ink")}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}


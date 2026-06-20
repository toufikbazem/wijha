import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

function StepIndicator({
  currentStep,
  totalSteps,
  stepLabel,
}: {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}) {
  const { t } = useTranslation("auth");

  // On small screens, only show the first, current and last step (deduped & sorted).
  const compactSteps = Array.from(
    new Set([1, currentStep, totalSteps]),
  ).sort((a, b) => a - b);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">
          {t("stepXOfY", { current: currentStep, total: totalSteps })}
        </span>
        {stepLabel && (
          <span className="text-sm text-[#008CBA] font-medium">
            {stepLabel}
          </span>
        )}
      </div>

      {/* Full indicator: shown from the `sm` breakpoint up */}
      <div className="hidden sm:flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isLast = stepNum === totalSteps;

          return (
            <div
              key={stepNum}
              className={`flex items-center gap-2 ${isLast ? "" : "flex-1"}`}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 ${
                  isCompleted
                    ? "bg-primary-500 text-white"
                    : isCurrent
                      ? "bg-primary-500 text-white ring-4 ring-primary-500/20"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all duration-200 ${
                    isCompleted ? "bg-primary-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Compact indicator: only first, current and last step on small screens */}
      <div className="flex sm:hidden items-center gap-2">
        {compactSteps.map((stepNum, idx) => {
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isLast = idx === compactSteps.length - 1;

          return (
            <div
              key={stepNum}
              className={`flex items-center gap-2 ${isLast ? "" : "flex-1"}`}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 ${
                  isCompleted
                    ? "bg-primary-500 text-white"
                    : isCurrent
                      ? "bg-primary-500 text-white ring-4 ring-primary-500/20"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              {idx < compactSteps.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all duration-200 ${
                    isCompleted ? "bg-primary-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;

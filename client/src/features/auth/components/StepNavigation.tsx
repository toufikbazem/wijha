import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

function StepNavigation({
  onBack,
  onNext,
  onSkip,
  isFirstStep,
  isLastStep,
  showSkip,
  loading,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  showSkip?: boolean;
  loading?: boolean;
  nextLabel?: string;
}) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;
  const ArrowForward = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || loading}
        className="flex items-center gap-2 px-5 py-2.5 h-auto rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ArrowBack className="w-4 h-4" />
        {tc("back")}
      </Button>

      <div className="flex items-center gap-3">
        {showSkip && onSkip && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={loading}
            className="px-5 py-2.5 h-auto rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            {t("skip")}
          </Button>
        )}

        <Button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="flex items-center gap-2 py-2.5 px-5 h-auto rounded-lg font-semibold text-white bg-[#008CBA] hover:bg-[#00668C] cursor-pointer"
        >
          {loading ? (
            <>
              <Spinner className="ltr:mr-2 rtl:ml-2" />
              {tc("loading")}
            </>
          ) : (
            <>
              {nextLabel ?? (isLastStep ? t("createAccount") : t("next"))}
              {!isLastStep && <ArrowForward className="w-4 h-4" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default StepNavigation;

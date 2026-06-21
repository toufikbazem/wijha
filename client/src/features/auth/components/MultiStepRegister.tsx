import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  accountTypeSchema,
  accountInfoSchema,
  jobseekerPersonalSchema,
  jobseekerProfessionalSchema,
  employerCompanySchema,
  employerContactSchema,
  employerProfileSchema,
  reviewSchema,
} from "../schema";

import StepIndicator from "./StepIndicator";
import StepNavigation from "./StepNavigation";
import StepAccountType from "./steps/StepAccountType";
import StepAccountInfo from "./steps/StepAccountInfo";
import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepProfessionalInfo from "./steps/StepProfessionalInfo";
import StepExperiences from "./steps/StepExperiences";
import StepEducation from "./steps/StepEducation";
import StepSkills from "./steps/StepSkills";
import StepCvUpload from "./steps/StepCvUpload";
import StepReviewJobseeker from "./steps/StepReviewJobseeker";
import StepCompanyInfo from "./steps/StepCompanyInfo";
import StepCompanyContact from "./steps/StepCompanyContact";
import StepCompanyProfile from "./steps/StepCompanyProfile";
import StepReviewEmployer from "./steps/StepReviewEmployer";

const defaultValues = {
  accountType: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  gender: "",
  profileImage: "",
  professionalTitle: "",
  educationLevel: "",
  experienceLevel: "",
  linkedin: "",
  professionalSummary: "",
  experiences: [],
  educations: [],
  skills: [],
  cv: "",
  companyName: "",
  industry: "",
  size: "",
  foundingYear: "",
  website: "",
  description: "",
  missions: [],
  logo: "",
  termsAndConditions: false,
};

function MultiStepRegister({
  setErrorMessage,
  setVerifyEmail,
}: {
  setErrorMessage: (msg: string) => void;
  setVerifyEmail: (email: string) => void;
}) {
  const { t } = useTranslation("auth");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    defaultValues,
    mode: "onChange",
  });

  const accountType = form.watch("accountType");
  const totalSteps = accountType === "employer" ? 6 : 9;

  const validateCurrent = async (): Promise<boolean> => {
    const v = form.getValues();
    let schema: any = null;
    let pickFields: string[] = [];

    if (step === 1) {
      schema = accountTypeSchema;
      pickFields = ["accountType"];
    } else if (step === 2) {
      schema = accountInfoSchema;
      pickFields = ["email", "password", "confirmPassword"];
    } else if (accountType === "jobseeker") {
      if (step === 3) {
        schema = jobseekerPersonalSchema;
        pickFields = [
          "firstName",
          "lastName",
          "address",
          "phoneNumber",
          "gender",
          "profileImage",
        ];
      } else if (step === 4) {
        schema = jobseekerProfessionalSchema;
        pickFields = [
          "professionalTitle",
          "educationLevel",
          "experienceLevel",
          "linkedin",
          "professionalSummary",
        ];
      } else if (step === 9) {
        schema = reviewSchema;
        pickFields = ["termsAndConditions"];
      } else {
        return true;
      }
    } else if (accountType === "employer") {
      if (step === 3) {
        schema = employerCompanySchema;
        pickFields = [
          "companyName",
          "address",
          "industry",
          "size",
          "foundingYear",
        ];
      } else if (step === 4) {
        schema = employerContactSchema;
        pickFields = ["phoneNumber", "linkedin", "website"];
      } else if (step === 5) {
        schema = employerProfileSchema;
        pickFields = ["description", "missions", "logo"];
      } else if (step === 6) {
        schema = reviewSchema;
        pickFields = ["termsAndConditions"];
      }
    }

    if (!schema) return true;

    const subset: Record<string, any> = {};
    pickFields.forEach((f) => (subset[f] = v[f]));

    const result = schema.safeParse(subset);
    if (result.success) {
      // clear any prior errors on these fields
      pickFields.forEach((f) => form.clearErrors(f as any));
      return true;
    }

    // map zod errors to react-hook-form
    form.clearErrors();
    result.error.issues.forEach((issue: any) => {
      // Preserve the full path so nested errors (e.g. an invalid array item
      // at ["missions", 0]) land at "missions.0" instead of colliding on
      // "missions". Falsy segments are skipped to keep the dotted path clean.
      const path = issue.path
        .filter((seg: any) => seg !== undefined && seg !== null)
        .join(".");
      if (path) {
        form.setError(path as any, { type: "manual", message: issue.message });
      }
    });
    return false;
  };

  const checkEmailAvailable = async (): Promise<boolean> => {
    const email = form.getValues("email");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        },
      );
      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(t(result.code_error));
        return false;
      }

      if (result.exists) {
        form.setError("email", {
          type: "manual",
          message: t("emailAlreadyExists"),
        });
        return false;
      }

      return true;
    } catch {
      setErrorMessage(t("errorDuringRegistration"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    const ok = await validateCurrent();
    if (!ok) return;

    // After the account-info step passes local validation, confirm the email
    // isn't already taken before letting the user continue.
    if (step === 2) {
      const available = await checkEmailAvailable();
      if (!available) return;
    }

    if (
      (accountType === "jobseeker" && step === 9) ||
      (accountType === "employer" && step === 6)
    ) {
      await onSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const goSkip = () => {
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    const v = form.getValues();

    const payload: any = {
      role: v.accountType,
      email: v.email,
      password: v.password,
    };

    if (v.accountType === "jobseeker") {
      Object.assign(payload, {
        firstName: v.firstName,
        lastName: v.lastName,
        address: v.address,
        phoneNumber: v.phoneNumber,
        gender: v.gender,
        professionalTitle: v.professionalTitle,
        educationLevel: v.educationLevel,
        experienceLevel: v.experienceLevel,
        profileImage: v.profileImage || undefined,
        linkedin: v.linkedin || undefined,
        professionalSummary: v.professionalSummary || undefined,
        cv: v.cv || undefined,
        skills: v.skills && v.skills.length > 0 ? v.skills : undefined,
        experiences:
          v.experiences && v.experiences.length > 0 ? v.experiences : undefined,
        educations:
          v.educations && v.educations.length > 0 ? v.educations : undefined,
      });
    } else {
      Object.assign(payload, {
        companyName: v.companyName,
        address: v.address,
        industry: v.industry,
        size: v.size,
        foundingYear: v.foundingYear,
        phoneNumber: v.phoneNumber,
        linkedin: v.linkedin || undefined,
        website: v.website || undefined,
        description: v.description || undefined,
        missions:
          Array.isArray(v.missions) && v.missions.length > 0
            ? v.missions
            : undefined,
        logo: v.logo || undefined,
      });
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.message || t(result.error_code));
      } else {
        toast.success(t("registrationSuccessful"), {
          position: "bottom-right",
        });
        setVerifyEmail(v.email);
      }
    } catch {
      setErrorMessage(t("errorDuringRegistration"));
    } finally {
      setLoading(false);
    }
  };

  const stepLabel = (() => {
    if (step === 1) return t("stepAccountType");
    if (step === 2) return t("stepAccountInfo");
    if (accountType === "jobseeker") {
      if (step === 3) return t("stepPersonalInfo");
      if (step === 4) return t("stepProfessionalInfo");
      if (step === 5) return t("stepExperiences");
      if (step === 6) return t("stepEducation");
      if (step === 7) return t("stepSkills");
      if (step === 8) return t("stepCv");
      if (step === 9) return t("stepReview");
    } else if (accountType === "employer") {
      if (step === 3) return t("stepCompanyInfo");
      if (step === 4) return t("stepCompanyContact");
      if (step === 5) return t("stepCompanyProfile");
      if (step === 6) return t("stepReview");
    }
    return "";
  })();

  const renderStep = () => {
    if (step === 1) return <StepAccountType form={form} />;
    if (step === 2) return <StepAccountInfo form={form} />;
    if (accountType === "jobseeker") {
      if (step === 3) return <StepPersonalInfo form={form} />;
      if (step === 4) return <StepProfessionalInfo form={form} />;
      if (step === 5) return <StepExperiences form={form} />;
      if (step === 6) return <StepEducation form={form} />;
      if (step === 7) return <StepSkills form={form} />;
      if (step === 8) return <StepCvUpload form={form} />;
      if (step === 9) return <StepReviewJobseeker form={form} />;
    } else if (accountType === "employer") {
      if (step === 3) return <StepCompanyInfo form={form} />;
      if (step === 4) return <StepCompanyContact form={form} />;
      if (step === 5) return <StepCompanyProfile form={form} />;
      if (step === 6) return <StepReviewEmployer form={form} />;
    }
    return null;
  };

  const isOptionalStep =
    accountType === "jobseeker" && [5, 6, 7, 8].includes(step);

  const isLastStep =
    (accountType === "jobseeker" && step === 9) ||
    (accountType === "employer" && step === 6);

  return (
    <div>
      <StepIndicator
        currentStep={step}
        totalSteps={totalSteps}
        stepLabel={stepLabel}
      />

      {/* Use a div instead of <form>; submission is handled by goNext on the last step */}
      <div>
        {renderStep()}

        <StepNavigation
          onBack={goBack}
          onNext={goNext}
          onSkip={isOptionalStep ? goSkip : undefined}
          isFirstStep={step === 1}
          isLastStep={isLastStep}
          showSkip={isOptionalStep}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default MultiStepRegister;

import {
  CheckCircle2,
  Download,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "react-i18next";

function StepCvUpload({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const cv: string | undefined = form.watch("cv");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 80 ? prev + 5 : prev));
    }, 150);

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("CV")
      .upload(`public/${fileName}`, file);

    clearInterval(interval);

    if (error) {
      console.error(error.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    const { data } = supabase.storage
      .from("CV")
      .getPublicUrl(`public/${fileName}`);

    if (data?.publicUrl) {
      form.setValue("cv", data.publicUrl, { shouldDirty: true });
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("uploadCv")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("uploadCvSubtitle")}</p>
      </div>

      <input
        type="file"
        id="cv-upload-step"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6 text-[#008CBA] animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {t("cvUploading")}
              </p>
              <p className="text-xs text-gray-500">{progress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-[#008CBA] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!uploading && cv && (
        <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#008CBA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {t("cvFileName")}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <p className="text-xs text-green-600 font-medium">
                  {t("cvUploadSuccess")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={cv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#008CBA] text-[#008CBA] text-sm font-medium hover:bg-[#E6F7FB] transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t("viewCv")}</span>
              </a>
              <label
                htmlFor="cv-upload-step"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">{t("replaceCv")}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {!uploading && !cv && (
        <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#008CBA]" />
          </div>
          <p className="text-gray-800 font-semibold mb-1">{t("noCvYet")}</p>
          <p className="text-sm text-gray-500 mb-5">{t("cvFormatsHint")}</p>
          <label
            htmlFor="cv-upload-step"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {t("uploadCv")}
          </label>
        </div>
      )}
    </div>
  );
}

export default StepCvUpload;

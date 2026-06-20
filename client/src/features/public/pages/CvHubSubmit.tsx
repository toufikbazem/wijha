import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  CheckCircle2,
  FileText,
  FolderOpen,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { educationLevels, experienceLevels } from "@/utils/data";
import type { PublicHub } from "@/features/employers/cvHub/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { toast } from "sonner";

/**
 * CvHubSubmit — public candidate-facing CV submission form.
 *
 * Reached via the hub's QR code / share link at /cv-hub/:slug. Loads the public
 * hub (active hubs only), lets the candidate fill in their details and upload a
 * CV to Supabase storage, then POSTs the submission. No authentication.
 */

export default function CvHubSubmit() {
  useDocumentTitle("meta.title.dashboard");
  const { slug = "" } = useParams();

  const [hub, setHub] = useState<PublicHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/cv-hub/public/${slug}`,
        );
        const data = await res.json();
        if (!res.ok) {
          setUnavailable(true);
          setHub(null);
          toast.error("Something went wrong");
        } else {
          setHub(data);
          setUnavailable(false);
        }
      } catch {
        toast.error("Something went wrong");
        setUnavailable(true);
        setHub(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {loading && (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {!loading && unavailable && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                This hub is not available
              </h1>
              <p className="text-gray-500">
                The link may be expired, or the hub is no longer accepting
                submissions.
              </p>
            </div>
          )}

          {!loading && hub && submitted && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                CV submitted!
              </h1>
              <p className="text-gray-500 max-w-md mx-auto">
                Thanks for applying to{" "}
                <span className="font-medium text-gray-700">{hub.name}</span>.
                Your CV has been added to the talent pool.
              </p>
            </div>
          )}

          {!loading && hub && !submitted && (
            <SubmissionForm
              slug={slug}
              hub={hub}
              onSubmitted={() => setSubmitted(true)}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const empty = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  experienceLevel: "",
  educationLevel: "",
};

function SubmissionForm({
  slug,
  hub,
  onSubmitted,
}: {
  slug: string;
  hub: PublicHub;
  onSubmitted: () => void;
}) {
  const [values, setValues] = useState({ ...empty });
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [cvUrl, setCvUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof empty, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const addSkill = () => {
    const skill = skillsInput.trim();
    if (skill && !skills.includes(skill) && skills.length < 15) {
      setSkills((s) => [...s, skill]);
    }
    setSkillsInput("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    const interval = setInterval(
      () => setProgress((p) => (p < 80 ? p + 5 : p)),
      150,
    );

    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("CV")
      .upload(`public/${fileName}`, file);

    clearInterval(interval);

    if (uploadError) {
      console.error(uploadError.message);
      setUploading(false);
      setProgress(0);
      setError("CV upload failed. Please try again.");
      return;
    }

    setProgress(100);
    const { data } = supabase.storage
      .from("CV")
      .getPublicUrl(`public/${fileName}`);
    if (data?.publicUrl) {
      setCvUrl(data.publicUrl);
      setError("");
    }
    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.firstName.trim() || !values.lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!values.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!cvUrl) {
      setError("Please upload your CV.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/cv-hub/public/${slug}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            title: values.title,
            email: values.email,
            phone: values.phone,
            location: values.location,
            experienceLevel: values.experienceLevel,
            educationLevel: values.educationLevel,
            skills,
            cvUrl,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
      } else {
        console.log(data);
        onSubmitted();
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Hub banner */}
      <div className="bg-linear-to-r from-[#008CBA] to-[#00a8db] px-6 py-8 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{hub.name}</h1>
            <p className="text-sm text-white/80">Submit your CV</p>
          </div>
        </div>
        {hub.description && (
          <p className="mt-4 text-sm text-white/90">{hub.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldBlock label="First name" required>
            <Input
              value={values.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="Amine"
              className="focus-visible:ring-[#008CBA]"
            />
          </FieldBlock>
          <FieldBlock label="Last name" required>
            <Input
              value={values.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Khelifi"
              className="focus-visible:ring-[#008CBA]"
            />
          </FieldBlock>
        </div>

        <FieldBlock label="Professional title">
          <Input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Frontend Engineer"
            className="focus-visible:ring-[#008CBA]"
          />
        </FieldBlock>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldBlock label="Email" required>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              className="focus-visible:ring-[#008CBA]"
            />
          </FieldBlock>
          <FieldBlock label="Phone">
            <Input
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+213 ..."
              className="focus-visible:ring-[#008CBA]"
            />
          </FieldBlock>
        </div>

        <FieldBlock label="Location">
          <Input
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="City, Country"
            className="focus-visible:ring-[#008CBA]"
          />
        </FieldBlock>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldBlock label="Experience level">
            <Select
              value={values.experienceLevel}
              onValueChange={(v) => set("experienceLevel", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldBlock>
          <FieldBlock label="Education level">
            <Select
              value={values.educationLevel}
              onValueChange={(v) => set("educationLevel", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldBlock>
        </div>

        {/* Skills */}
        <FieldBlock label="Skills">
          <div className="flex gap-2">
            <Input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="focus-visible:ring-[#008CBA]"
            />
          </div>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-md bg-[#008CBA]/8 px-2.5 py-1 text-xs font-medium text-[#008CBA] ring-1 ring-inset ring-[#008CBA]/15"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setSkills((s) => s.filter((x) => x !== skill))
                    }
                    className="cursor-pointer text-[#008CBA]/60 hover:text-[#008CBA]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </FieldBlock>

        {/* CV upload */}
        <FieldBlock label="CV" required>
          <input
            type="file"
            id="cv-hub-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading ? (
            <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-4">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="w-5 h-5 text-[#008CBA] animate-bounce" />
                <p className="text-sm font-medium text-gray-700">
                  Uploading… {progress}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#008CBA] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : cvUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-4">
              <FileText className="w-6 h-6 text-[#008CBA] shrink-0" />
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-medium text-emerald-600">
                  CV uploaded
                </p>
              </div>
              <label
                htmlFor="cv-hub-upload"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                Replace
              </label>
            </div>
          ) : (
            <label
              htmlFor="cv-hub-upload"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-6 text-center cursor-pointer hover:bg-[#F0FAFE] transition"
            >
              <Upload className="w-6 h-6 text-[#008CBA] mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload your CV
              </p>
              <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX</p>
            </label>
          )}
        </FieldBlock>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#008CBA] text-white font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? <Spinner className="h-5 w-5" /> : "Submit CV"}
        </button>
      </form>
    </div>
  );
}

function FieldBlock({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

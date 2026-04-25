import { useEffect, useState } from "react";
import { CheckCircle2, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { companyProfileSchema } from "../schema";
import DashCompanyProfileHeader from "../components/DashCompanyProfileHeader";
import DashCompanyProfileContent from "../components/DashCompanyProfileContent";
import type z from "zod";
import { useTranslation } from "react-i18next";

export default function DashCompanyProfile() {
  const [loading, setLoading] = useState(false);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    company_name: "",
    industry: "",
    size: "",
    phone_number: "",
    address: "",
    logo: "",
    cover_image: "",
    description: "",
    missions: [],
    founding_year: "",
    website: "",
    linkedin: "",
  });

  const { user } = useSelector((state: any) => state.user);
  const { t } = useTranslation("employer");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/employers/${user.user_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setCompanyInfo(data);
        } else {
          console.error("Failed to fetch company data");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const form = useForm<z.infer<typeof companyProfileSchema>>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      company_name: companyInfo.company_name,
      industry: companyInfo?.industry ? companyInfo.industry : "",
      size: companyInfo?.size ? companyInfo.size : "",
      phone_number: companyInfo?.phone_number ? companyInfo.phone_number : "",
      address: companyInfo.address,
      logo: companyInfo?.logo ? companyInfo.logo : "",
      cover_image: companyInfo?.cover_image ? companyInfo.cover_image : "",
      description: companyInfo?.description ? companyInfo.description : "",
      missions: companyInfo?.missions ? companyInfo.missions : [],
      website: companyInfo?.website ? companyInfo.website : "",
      linkedin: companyInfo?.linkedin ? companyInfo.linkedin : "",
      founding_year: companyInfo?.founding_year
        ? companyInfo.founding_year
        : "",
    },
  });

  useEffect(() => {
    if (companyInfo && companyInfo.company_name) {
      form.reset({
        company_name: companyInfo.company_name,
        industry: companyInfo.industry || "",
        size: companyInfo.size || "",
        phone_number: companyInfo.phone_number || "",
        address: companyInfo.address || "",
        logo: companyInfo.logo || "",
        cover_image: companyInfo.cover_image || "",
        description: companyInfo.description || "",
        missions: companyInfo.missions || [],
        founding_year: companyInfo.founding_year || "",
        website: companyInfo.website || "",
        linkedin: companyInfo.linkedin || "",
      });
    }
  }, [companyInfo]);

  const onSubmit = async (data: z.infer<typeof companyProfileSchema>) => {
    setLoadingEditMode(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/employers/${user.user_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const resData = await res.json();

      if (res.ok) {
        setEditMode(false);
        const updatedData = await res.json();
        toast.success(t("profileEditedSuccess"));
        setCompanyInfo(updatedData);
      } else {
        if (resData && resData.error_code === "EMPLOYER_INACTIVE") {
          toast.error(t("employerInactive"));
        } else {
          toast.error(t("errorOccurred"));
        }
      }
    } catch (error) {
      console.error("Error updating company data:", error);
      toast.error(t("errorOccurred"));
    } finally {
      setLoadingEditMode(false);
      setEditMode(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        {loading && (
          <div className="space-y-8">
            {/* ===== Header ===== */}
            <div className="relative">
              {/* Cover image */}
              <Skeleton className="h-48 w-full rounded-lg bg-gray-200" />

              {/* Avatar + name */}
              <div className="flex items-end gap-4 mt-[-40px] px-4">
                <Skeleton className="h-20 w-20 rounded-full bg-gray-200" />

                <div className="space-y-2 pb-2">
                  <Skeleton className="h-6 w-48 bg-gray-200" />
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                </div>
              </div>
            </div>

            {/* ===== Content ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-5 w-40" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                  <Skeleton className="h-4 w-9/12" />
                </div>

                {/* Section */}
                <Skeleton className="h-5 w-32 mt-4 bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200" />
                  <Skeleton className="h-4 w-4/6 bg-gray-200" />
                </div>
              </div>

              {/* Side content */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 bg-gray-200" />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200" />
                  <Skeleton className="h-4 w-4/6 bg-gray-200" />
                </div>

                <Skeleton className="h-5 w-28 mt-4 bg-gray-200" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("companyProfile")}
                </h1>
                <p className="mt-1 text-gray-600">{t("manageUpdate")}</p>
              </div>
              {editMode ? (
                <button
                  className="cursor-pointer flex items-center justify-center px-6 py-3 bg-[#008CBA] text-white font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg"
                  type="submit"
                >
                  {loadingEditMode ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                      {t("saveChanges")}
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditMode(true);
                  }}
                  className="cursor-pointer flex items-center justify-center !px-6 !py-3 bg-[#008CBA] text-white !font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg"
                >
                  <Pen className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  {t("editMode")}
                </button>
              )}
            </div>

            {/* profile header */}
            <DashCompanyProfileHeader
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
              editMode={editMode}
              form={form}
            />

            {/* Two Column Layout */}
            <DashCompanyProfileContent
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
              editMode={editMode}
              form={form}
            />
          </>
        )}
      </div>
    </form>
  );
}

import { useEffect, useState } from "react";
import {
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  Share2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router";
import Header from "@/features/public/components/Header";
import Footer from "@/features/public/components/Footer";

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [companyInfo, setCompanyInfo] = useState({
    company_name: "",
    email: "",
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
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/employers/${id}`,
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

  return (
    <div>
      <Header />
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
            {/* profile header */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              {/* Cover Image Section */}
              <div className="relative h-40 bg-[#008CBA]">
                {companyInfo.cover_image ? (
                  <img
                    src={
                      companyInfo.cover_image ||
                      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&h=400&fit=crop"
                    }
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#008CBA]" />
                )}
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-20">
                  {/* Logo with Edit Button Overlay */}
                  <div className="relative m-auto sm:m-0">
                    {companyInfo.logo ? (
                      <img
                        src={companyInfo.logo || ""}
                        alt="logo"
                        className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
                      />
                    ) : (
                      <span className="w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg bg-white text-4xl font-bold text-gray-900">
                        {companyInfo.company_name?.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 m-auto text-center sm:text-start sm:mt-16 flex flex-col gap-2">
                    {/* company name */}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {companyInfo.company_name}
                    </h2>
                    {/* industry */}
                    <span className="bg-[#008CBA] w-fit inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white">
                      {companyInfo.industry}
                    </span>

                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                      {/* Address */}
                      <div className="flex items-center gap-1 justify-center ">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{companyInfo.address}</span>
                        </div>
                      </div>

                      {/* company size */}
                      <div className="flex items-center gap-1 justify-center">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{companyInfo.size}</span>
                        </div>
                      </div>

                      {/* founding year */}
                      <div className="flex items-center gap-1 justify-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Founded {companyInfo.founding_year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Content Column */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* About Section */}
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      About Us
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {companyInfo.description}
                    </p>
                  </div>

                  {/* What We Do */}
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        What We Do
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {companyInfo?.missions?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="relative p-4 rounded-lg bg-[#008CBA10] border-t-3 border-[#008CBA]"
                          >
                            <p className="text-sm text-gray-600">{item}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                      <Mail className="w-5 h-5 mt-0.5 text-[#008CBA]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-0.5">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {companyInfo.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                      <Share2 className="w-5 h-5 mt-0.5 text-[#008CBA]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-0.5">LinkedIn</p>
                        <p className="text-sm font-medium text-gray-900">
                          {companyInfo.linkedin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                      <Globe className="w-5 h-5 mt-0.5 text-[#008CBA]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-0.5">Website</p>
                        <p className="text-sm font-medium text-gray-900">
                          {companyInfo.website}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

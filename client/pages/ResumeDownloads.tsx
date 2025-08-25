import { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Users,
  Briefcase,
  Mail,
  Filter,
  Search,
  FileText,
  Lock,
  Calendar,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { formatErrorMessage } from "../lib/error";
import * as XLSX from "xlsx";

interface JobApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  cover_letter: string;
  resume_url: string;
  status: string;
  created_at: string;
}

interface ResumeUpload {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  position_interested: string;
  experience_level: string;
  skills: string;
  resume_url: string;
  cover_letter: string;
  linkedin_url: string;
  portfolio_url: string;
  created_at: string;
}

export default function ResumeDownloads() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [resumeUploads, setResumeUploads] = useState<ResumeUpload[]>([]);
  const [activeTab, setActiveTab] = useState<"applications" | "resumes">(
    "applications",
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    JobApplication | ResumeUpload | null
  >(null);
  const [modalType, setModalType] = useState<"application" | "resume" | null>(
    null,
  );

  const ADMIN_PASSWORD = "admin2024";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      fetchData();
    } else {
      setPasswordError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch job applications
      const { data: applicationsData, error: appsError } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;
      setJobApplications(applicationsData || []);

      // Fetch resume uploads
      const { data: resumesData, error: resumesError } = await supabase
        .from("resume_uploads")
        .select("*")
        .order("created_at", { ascending: false });

      if (resumesError) throw resumesError;
      setResumeUploads(resumesData || []);
    } catch (error) {
      console.error("Error fetching data:", formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = jobApplications.filter((app) => {
    const searchTerm = filter.toLowerCase();
    return (
      app.full_name.toLowerCase().includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm) ||
      app.position.toLowerCase().includes(searchTerm)
    );
  });

  const filteredResumeUploads = resumeUploads.filter((resume) => {
    const searchTerm = filter.toLowerCase();
    return (
      resume.full_name.toLowerCase().includes(searchTerm) ||
      resume.email.toLowerCase().includes(searchTerm) ||
      resume.position_interested?.toLowerCase().includes(searchTerm) ||
      resume.skills?.toLowerCase().includes(searchTerm)
    );
  });

  // Export functions
  const exportToExcel = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Auto-size columns
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
    const columnWidths: any[] = [];
    for (let C = range.s.c; C <= range.e.c; C++) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; R++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell?.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
    }
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(
      workbook,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const exportAllToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Job Applications Sheet
    if (filteredApplications.length > 0) {
      const applicationsSheet = XLSX.utils.json_to_sheet(filteredApplications);
      XLSX.utils.book_append_sheet(
        workbook,
        applicationsSheet,
        "Job Applications",
      );
    }

    // Resume Uploads Sheet
    if (filteredResumeUploads.length > 0) {
      const resumesSheet = XLSX.utils.json_to_sheet(filteredResumeUploads);
      XLSX.utils.book_append_sheet(workbook, resumesSheet, "Resume Uploads");
    }

    XLSX.writeFile(
      workbook,
      `All_Resumes_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const openModal = (
    item: JobApplication | ResumeUpload,
    type: "application" | "resume",
  ) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <div className="bg-card border border-border-subtle rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Resume Downloads
                </h1>
                <p className="text-muted-foreground">
                  Enter the admin password to access resume downloads
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Access Downloads
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Resume <span className="text-gradient">Downloads</span>
            </h1>
            <p className="text-muted-foreground">
              Download and manage submitted resumes from job applications and
              general submissions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {jobApplications.length}
                  </h3>
                  <p className="text-muted-foreground">Job Applications</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {resumeUploads.length}
                  </h3>
                  <p className="text-muted-foreground">Resume Uploads</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Download className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {jobApplications.filter((app) => app.resume_url).length +
                      resumeUploads.filter((res) => res.resume_url).length}
                  </h3>
                  <p className="text-muted-foreground">Total Resumes</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {
                      new Set([
                        ...jobApplications.map((app) => app.email),
                        ...resumeUploads.map((res) => res.email),
                      ]).size
                    }
                  </h3>
                  <p className="text-muted-foreground">Unique Candidates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card border border-border-subtle rounded-xl mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "applications"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Job Applications ({jobApplications.length})
              </button>
              <button
                onClick={() => setActiveTab("resumes")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "resumes"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Resume Uploads ({resumeUploads.length})
              </button>
            </div>
          </div>

          {/* Filters and Export */}
          <div className="bg-card border border-border-subtle rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={`Search ${
                      activeTab === "applications"
                        ? "by name, email, position..."
                        : "by name, email, skills..."
                    }`}
                    className="w-full pl-12 pr-4 py-3 border border-border-subtle rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const data =
                      activeTab === "applications"
                        ? filteredApplications
                        : filteredResumeUploads;
                    const filename =
                      activeTab === "applications"
                        ? "job_applications"
                        : "resume_uploads";
                    exportToExcel(data, filename);
                  }}
                  className="px-4 py-3 bg-green-600/10 text-green-600 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors font-medium whitespace-nowrap"
                  disabled={
                    activeTab === "applications"
                      ? filteredApplications.length === 0
                      : filteredResumeUploads.length === 0
                  }
                >
                  Export Current
                </button>
                <button
                  onClick={exportAllToExcel}
                  className="px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors font-medium whitespace-nowrap"
                  disabled={
                    filteredApplications.length === 0 &&
                    filteredResumeUploads.length === 0
                  }
                >
                  Export All
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card border border-border-subtle rounded-xl">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : activeTab === "applications" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Applicant
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Position
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Applied
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-border-subtle/50 hover:bg-background/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-foreground">
                              {app.full_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {app.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {app.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {app.position}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {app.experience}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {app.resume_url &&
                              (app.resume_url.startsWith("placeholder://") ? (
                                <div
                                  className="p-2 bg-gray-500/10 text-gray-500 rounded-lg cursor-not-allowed"
                                  title="Resume file - Storage not configured"
                                >
                                  <Download className="w-4 h-4" />
                                </div>
                              ) : (
                                <a
                                  href={app.resume_url}
                                  download={`Resume_${app.full_name.replace(/\s+/g, "_")}.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                  title="Download Resume"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              ))}
                            <button
                              onClick={() => openModal(app, "application")}
                              className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredApplications.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    No job applications found.
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Candidate
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Position Interest
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResumeUploads.map((resume) => (
                      <tr
                        key={resume.id}
                        className="border-b border-border-subtle/50 hover:bg-background/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-foreground">
                              {resume.full_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {resume.email}
                            </div>
                            {resume.phone && (
                              <div className="text-sm text-muted-foreground">
                                {resume.phone}
                              </div>
                            )}
                            {resume.location && (
                              <div className="text-sm text-muted-foreground">
                                {resume.location}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {resume.position_interested || "-"}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {resume.experience_level || "-"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">
                          {new Date(resume.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {resume.resume_url &&
                              (resume.resume_url.startsWith(
                                "placeholder://",
                              ) ? (
                                <div
                                  className="p-2 bg-gray-500/10 text-gray-500 rounded-lg cursor-not-allowed"
                                  title="Resume file - Storage not configured"
                                >
                                  <Download className="w-4 h-4" />
                                </div>
                              ) : (
                                <a
                                  href={resume.resume_url}
                                  download={`Resume_${resume.full_name.replace(/\s+/g, "_")}.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                  title="Download Resume"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              ))}
                            <button
                              onClick={() => openModal(resume, "resume")}
                              className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredResumeUploads.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    No resume uploads found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-subtle rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="text-2xl font-bold text-foreground">
                {modalType === "application"
                  ? "Job Application Details"
                  : "Resume Upload Details"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-background/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {modalType === "application" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobApplication).full_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobApplication).email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobApplication).phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Position
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobApplication).position}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Experience
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobApplication).experience}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Applied Date
                      </label>
                      <p className="text-foreground">
                        {formatDate(
                          (selectedItem as JobApplication).created_at,
                        )}
                      </p>
                    </div>
                    {(selectedItem as JobApplication).resume_url && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Resume
                        </label>
                        {(selectedItem as JobApplication).resume_url.startsWith(
                          "placeholder://",
                        ) ? (
                          <p className="text-gray-500">
                            Resume file - Storage not configured
                          </p>
                        ) : (
                          <a
                            href={(selectedItem as JobApplication).resume_url}
                            download={`Resume_${(selectedItem as JobApplication).full_name.replace(/\s+/g, "_")}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Resume
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Cover Letter
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">
                        {(selectedItem as JobApplication).cover_letter ||
                          "No cover letter provided"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as ResumeUpload).full_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as ResumeUpload).email}
                      </p>
                    </div>
                    {(selectedItem as ResumeUpload).phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Phone
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as ResumeUpload).phone}
                        </p>
                      </div>
                    )}
                    {(selectedItem as ResumeUpload).location && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Location
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as ResumeUpload).location}
                        </p>
                      </div>
                    )}
                    {(selectedItem as ResumeUpload).position_interested && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Position Interest
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as ResumeUpload).position_interested}
                        </p>
                      </div>
                    )}
                    {(selectedItem as ResumeUpload).experience_level && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Experience Level
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as ResumeUpload).experience_level}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Submitted Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as ResumeUpload).created_at)}
                      </p>
                    </div>
                    {(selectedItem as ResumeUpload).resume_url && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Resume
                        </label>
                        {(selectedItem as ResumeUpload).resume_url.startsWith(
                          "placeholder://",
                        ) ? (
                          <p className="text-gray-500">
                            Resume file - Storage not configured
                          </p>
                        ) : (
                          <a
                            href={(selectedItem as ResumeUpload).resume_url}
                            download={`Resume_${(selectedItem as ResumeUpload).full_name.replace(/\s+/g, "_")}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Resume
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {(selectedItem as ResumeUpload).skills && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Skills
                      </label>
                      <div className="mt-2 p-4 bg-background/50 rounded-lg">
                        <p className="text-foreground">
                          {(selectedItem as ResumeUpload).skills}
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedItem as ResumeUpload).cover_letter && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Cover Letter / Message
                      </label>
                      <div className="mt-2 p-4 bg-background/50 rounded-lg">
                        <p className="text-foreground whitespace-pre-wrap">
                          {(selectedItem as ResumeUpload).cover_letter}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedItem as ResumeUpload).linkedin_url && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          LinkedIn
                        </label>
                        <a
                          href={(selectedItem as ResumeUpload).linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors break-all"
                        >
                          {(selectedItem as ResumeUpload).linkedin_url}
                        </a>
                      </div>
                    )}
                    {(selectedItem as ResumeUpload).portfolio_url && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Portfolio
                        </label>
                        <a
                          href={(selectedItem as ResumeUpload).portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors break-all"
                        >
                          {(selectedItem as ResumeUpload).portfolio_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border-subtle">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

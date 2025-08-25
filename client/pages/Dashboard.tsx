import { useState, useEffect } from "react";
import {
  Download,
  Users,
  Briefcase,
  Mail,
  FileText,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { formatErrorMessage } from "../lib/error";

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

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  created_at: string;
}

interface GetStartedRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  job_title: string;
  message: string;
  created_at: string;
}

interface ResumeUpload {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resume_url: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [getStartedRequests, setGetStartedRequests] = useState<
    GetStartedRequest[]
  >([]);
  const [resumeUploads, setResumeUploads] = useState<ResumeUpload[]>([]);
  const [activeTab, setActiveTab] = useState<
    "applications" | "contacts" | "get-started" | "resumes"
  >("applications");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch job applications
      const { data: appsData } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });
      setJobApplications(appsData || []);

      // Fetch contacts
      const { data: contactsData } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      setContacts(contactsData || []);

      // Fetch get started requests
      const { data: getStartedData } = await supabase
        .from("get_started_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setGetStartedRequests(getStartedData || []);

      // Fetch resume uploads (if separate table exists)
      const { data: resumesData } = await supabase
        .from("resume_uploads")
        .select("*")
        .order("created_at", { ascending: false });
      setResumeUploads(resumesData || []);
    } catch (error) {
      console.error("Error fetching data:", formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            // Escape commas and quotes
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setJobApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getFilteredData = () => {
    const filterBySearch = (items: any[], searchFields: string[]) => {
      if (!searchTerm) return items;
      return items.filter((item) =>
        searchFields.some((field) =>
          item[field]?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    };

    switch (activeTab) {
      case "applications":
        return filterBySearch(jobApplications, [
          "full_name",
          "email",
          "position",
        ]);
      case "contacts":
        return filterBySearch(contacts, ["name", "email", "company"]);
      case "get-started":
        return filterBySearch(getStartedRequests, [
          "first_name",
          "last_name",
          "email",
          "company",
        ]);
      case "resumes":
        return filterBySearch(resumeUploads, ["name", "email", "position"]);
      default:
        return [];
    }
  };

  // Basic admin check - in a real app you'd have proper role management
  if (!user || !user.email?.includes("admin")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="bg-card-bg border border-border-subtle rounded-xl p-12">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Access Denied
              </h1>
              <p className="text-foreground/70">
                You don't have permission to access the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-foreground/70">
              Manage all form submissions and exports
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-tech-blue/10 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-tech-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {jobApplications.length}
                  </h3>
                  <p className="text-foreground/70">Job Applications</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {contacts.length}
                  </h3>
                  <p className="text-foreground/70">Contact Messages</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {getStartedRequests.length}
                  </h3>
                  <p className="text-foreground/70">Get Started Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {resumeUploads.length}
                  </h3>
                  <p className="text-foreground/70">Resume Uploads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card-bg border border-border-subtle rounded-xl mb-6">
            <div className="flex overflow-x-auto">
              {[
                {
                  key: "applications",
                  label: "Job Applications",
                  icon: Briefcase,
                },
                { key: "contacts", label: "Contact Messages", icon: Mail },
                {
                  key: "get-started",
                  label: "Get Started Requests",
                  icon: Users,
                },
                { key: "resumes", label: "Resume Uploads", icon: FileText },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex-1 min-w-0 py-4 px-6 text-center font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${
                    activeTab === key
                      ? "bg-primary text-primary-foreground rounded-xl m-2"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Export */}
          <div className="bg-card-bg border border-border-subtle rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue"
                  />
                </div>
              </div>

              <button
                onClick={() => exportToCSV(getFilteredData(), activeTab)}
                className="bg-tech-blue hover:bg-tech-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Content Table */}
          <div className="bg-card-bg border border-border-subtle rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-tech-blue/30 border-t-tech-blue rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground/70">Loading...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {activeTab === "applications" && (
                  <table className="w-full">
                    <thead className="border-b border-border-subtle bg-background/50">
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
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Applied
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Resume
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData().map((app: JobApplication) => (
                        <tr
                          key={app.id}
                          className="border-b border-border-subtle/50 hover:bg-background/50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-foreground">
                                {app.full_name}
                              </div>
                              <div className="text-sm text-foreground/70">
                                {app.email}
                              </div>
                              <div className="text-sm text-foreground/70">
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
                          <td className="px-6 py-4">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(app.id, e.target.value)
                              }
                              className="bg-background border border-border-subtle rounded px-3 py-1 text-sm text-foreground"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-foreground/70 text-sm">
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {app.resume_url && (
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-tech-blue hover:text-tech-blue/80 text-sm"
                              >
                                View Resume
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "contacts" && (
                  <table className="w-full">
                    <thead className="border-b border-border-subtle bg-background/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Company
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Message
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData().map((contact: Contact) => (
                        <tr
                          key={contact.id}
                          className="border-b border-border-subtle/50 hover:bg-background/50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-foreground">
                                {contact.name}
                              </div>
                              <div className="text-sm text-foreground/70">
                                {contact.email}
                              </div>
                              {contact.phone && (
                                <div className="text-sm text-foreground/70">
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {contact.company || "-"}
                          </td>
                          <td className="px-6 py-4 text-foreground max-w-xs">
                            <div className="truncate" title={contact.message}>
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground/70 text-sm">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "get-started" && (
                  <table className="w-full">
                    <thead className="border-b border-border-subtle bg-background/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Company
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Job Title
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Message
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData().map((request: GetStartedRequest) => (
                        <tr
                          key={request.id}
                          className="border-b border-border-subtle/50 hover:bg-background/50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-foreground">
                                {request.first_name} {request.last_name}
                              </div>
                              <div className="text-sm text-foreground/70">
                                {request.email}
                              </div>
                              {request.phone && (
                                <div className="text-sm text-foreground/70">
                                  {request.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {request.company || "-"}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {request.job_title || "-"}
                          </td>
                          <td className="px-6 py-4 text-foreground max-w-xs">
                            <div className="truncate" title={request.message}>
                              {request.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground/70 text-sm">
                            {new Date(request.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "resumes" && (
                  <table className="w-full">
                    <thead className="border-b border-border-subtle bg-background/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Position
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Resume
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData().map((resume: ResumeUpload) => (
                        <tr
                          key={resume.id}
                          className="border-b border-border-subtle/50 hover:bg-background/50"
                        >
                          <td className="px-6 py-4 text-foreground font-medium">
                            {resume.name}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {resume.email}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {resume.position}
                          </td>
                          <td className="px-6 py-4">
                            {resume.resume_url && (
                              <a
                                href={resume.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-tech-blue hover:text-tech-blue/80 text-sm"
                              >
                                View Resume
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4 text-foreground/70 text-sm">
                            {new Date(resume.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {getFilteredData().length === 0 && (
                  <div className="p-12 text-center text-foreground/70">
                    No data found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

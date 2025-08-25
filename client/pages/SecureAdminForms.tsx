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
  X,
  Lock,
  FileSpreadsheet,
} from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { formatErrorMessage } from "../lib/error";
import * as XLSX from "xlsx";

interface Application {
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
  file_name: string;
  file_url: string;
  uploaded_at: string;
  // Add other fields as needed
}

export default function SecureAdminForms() {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [getStartedRequests, setGetStartedRequests] = useState<
    GetStartedRequest[]
  >([]);
  const [resumeUploads, setResumeUploads] = useState<ResumeUpload[]>([]);

  const [activeTab, setActiveTab] = useState<
    "applications" | "contacts" | "get-started" | "resumes"
  >("applications");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    Application | Contact | GetStartedRequest | ResumeUpload | null
  >(null);
  const [modalType, setModalType] = useState<
    "application" | "contact" | "get-started" | "resume" | null
  >(null);

  // Password protection - use a simple password for demo (in production, use proper authentication)
  const ADMIN_PASSWORD = "admin2024"; // Change this to your desired password

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

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch applications
      const { data: applicationsData, error: appsError } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;
      setApplications(applicationsData || []);

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactsError) throw contactsError;
      setContacts(contactsData || []);

      // Fetch get started requests
      const { data: getStartedData, error: getStartedError } = await supabase
        .from("get_started_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (getStartedError) throw getStartedError;
      setGetStartedRequests(getStartedData || []);

      // Note: Resume uploads might need a different table or storage query
      // For now, we'll show resume URLs from job applications
      const resumeData =
        applicationsData
          ?.filter((app) => app.resume_url)
          .map((app) => ({
            id: app.id,
            file_name: `Resume_${app.full_name.replace(/\s+/g, "_")}.pdf`,
            file_url: app.resume_url,
            uploaded_at: app.created_at,
            applicant_name: app.full_name,
            position: app.position,
          })) || [];

      setResumeUploads(resumeData as any);
    } catch (error) {
      console.error("Error fetching data:", formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(filter.toLowerCase()) ||
      app.email.toLowerCase().includes(filter.toLowerCase()) ||
      app.position.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.email.toLowerCase().includes(filter.toLowerCase()) ||
      contact.company?.toLowerCase().includes(filter.toLowerCase()),
  );

  const filteredGetStartedRequests = getStartedRequests.filter(
    (request) =>
      `${request.first_name} ${request.last_name}`
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      request.email.toLowerCase().includes(filter.toLowerCase()) ||
      request.company?.toLowerCase().includes(filter.toLowerCase()) ||
      request.job_title?.toLowerCase().includes(filter.toLowerCase()),
  );

  const filteredResumeUploads = resumeUploads.filter(
    (resume: any) =>
      resume.file_name.toLowerCase().includes(filter.toLowerCase()) ||
      resume.applicant_name?.toLowerCase().includes(filter.toLowerCase()),
  );

  // Excel export functions
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

  const getCurrentData = () => {
    switch (activeTab) {
      case "applications":
        return { data: filteredApplications, filename: "job_applications" };
      case "contacts":
        return { data: filteredContacts, filename: "contact_messages" };
      case "get-started":
        return {
          data: filteredGetStartedRequests,
          filename: "get_started_requests",
        };
      case "resumes":
        return { data: filteredResumeUploads, filename: "resume_uploads" };
      default:
        return { data: [], filename: "export" };
    }
  };

  const openModal = (
    item: Application | Contact | GetStartedRequest | ResumeUpload,
    type: "application" | "contact" | "get-started" | "resume",
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

  // Basic admin check
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
                You don't have permission to access this secure admin area.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tech-dark via-primary/10 to-background">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <div className="bg-card-bg border border-border-subtle rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Secure Admin Forms
                </h1>
                <p className="text-foreground/70">
                  Enter the admin password to access form management
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  Access Forms
                </button>
              </form>
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
              Secure <span className="text-gradient">Form Management</span>
            </h1>
            <p className="text-foreground/70">
              Manage all form submissions with Excel export capabilities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-tech-blue/10 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-tech-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {applications.length}
                  </h3>
                  <p className="text-foreground/70">Job Applications</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
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
                <div className="bg-coral/10 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-coral" />
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
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-green-500" />
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
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors whitespace-nowrap ${
                  activeTab === "applications"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Job Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors whitespace-nowrap ${
                  activeTab === "contacts"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Contact Messages ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab("get-started")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors whitespace-nowrap ${
                  activeTab === "get-started"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Get Started ({getStartedRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("resumes")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors whitespace-nowrap ${
                  activeTab === "resumes"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Resume Uploads ({resumeUploads.length})
              </button>
            </div>
          </div>

          {/* Filters and Export */}
          <div className="bg-card-bg border border-border-subtle rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={`Search ${
                      activeTab === "applications"
                        ? "by name, email, position..."
                        : activeTab === "contacts"
                          ? "by name, email, company..."
                          : activeTab === "get-started"
                            ? "by name, email, company, job title..."
                            : "by file name, applicant name..."
                    }`}
                    className="w-full pl-12 pr-4 py-3 border border-border-subtle rounded-lg bg-background/50 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tech-blue"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {activeTab === "applications" && (
                  <div className="sm:w-48">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full py-3 px-4 border border-border-subtle rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                {/* Excel Export Button */}
                <div>
                  <button
                    onClick={() => {
                      const { data, filename } = getCurrentData();
                      exportToExcel(data, filename);
                    }}
                    className="px-6 py-3 bg-green-600/10 text-green-600 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                    disabled={getCurrentData().data.length === 0}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tables */}
          <div className="bg-card-bg border border-border-subtle rounded-xl">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-tech-blue/30 border-t-tech-blue rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground/70">Loading...</p>
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
                        Status
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
                          <div className="flex gap-2">
                            {app.resume_url && (
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-tech-blue/10 text-tech-blue rounded-lg hover:bg-tech-blue/20 transition-colors"
                                title="Download Resume"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => openModal(app, "application")}
                              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
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
                  <div className="p-12 text-center text-foreground/70">
                    No applications found.
                  </div>
                )}
              </div>
            ) : activeTab === "contacts" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
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
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
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
                        <td
                          className="px-6 py-4 text-foreground max-w-xs truncate"
                          title={contact.message}
                        >
                          {contact.message}
                        </td>
                        <td className="px-6 py-4 text-foreground/70 text-sm">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openModal(contact, "contact")}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredContacts.length === 0 && (
                  <div className="p-12 text-center text-foreground/70">
                    No contact messages found.
                  </div>
                )}
              </div>
            ) : activeTab === "get-started" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Company & Role
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Message
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGetStartedRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-border-subtle/50 hover:bg-background/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {request.first_name} {request.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-foreground">
                              {request.email}
                            </div>
                            {request.phone && (
                              <div className="text-sm text-foreground/70">
                                {request.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-foreground">
                              {request.company || "-"}
                            </div>
                            {request.job_title && (
                              <div className="text-sm text-foreground/70">
                                {request.job_title}
                              </div>
                            )}
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 text-foreground max-w-xs truncate"
                          title={request.message}
                        >
                          {request.message}
                        </td>
                        <td className="px-6 py-4 text-foreground/70 text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openModal(request, "get-started")}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredGetStartedRequests.length === 0 && (
                  <div className="p-12 text-center text-foreground/70">
                    No get started requests found.
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        File Name
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Applicant
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Position
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Upload Date
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResumeUploads.map((resume: any) => (
                      <tr
                        key={resume.id}
                        className="border-b border-border-subtle/50 hover:bg-background/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {resume.file_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {resume.applicant_name || "-"}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {resume.position || "-"}
                        </td>
                        <td className="px-6 py-4 text-foreground/70 text-sm">
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <a
                              href={resume.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-tech-blue/10 text-tech-blue rounded-lg hover:bg-tech-blue/20 transition-colors"
                              title="Download Resume"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => openModal(resume, "resume")}
                              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
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
                  <div className="p-12 text-center text-foreground/70">
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
          <div className="bg-card-bg border border-border-subtle rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="text-2xl font-bold text-foreground">
                {modalType === "application" && "Job Application Details"}
                {modalType === "contact" && "Contact Message Details"}
                {modalType === "get-started" && "Get Started Request Details"}
                {modalType === "resume" && "Resume Upload Details"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-background/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {modalType === "application" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Full Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Application).full_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Email
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Application).email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Phone
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Application).phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Position
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Application).position}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Experience
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Application).experience}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Status
                      </label>
                      <p className="text-foreground capitalize">
                        {(selectedItem as Application).status}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Applied Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as Application).created_at)}
                      </p>
                    </div>
                    {(selectedItem as Application).resume_url && (
                      <div>
                        <label className="text-sm font-medium text-foreground/70">
                          Resume
                        </label>
                        <a
                          href={(selectedItem as Application).resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-tech-blue hover:text-tech-blue/80 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Resume
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Cover Letter
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">
                        {(selectedItem as Application).cover_letter}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "contact" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Contact).name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Email
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as Contact).email}
                      </p>
                    </div>
                    {(selectedItem as Contact).phone && (
                      <div>
                        <label className="text-sm font-medium text-foreground/70">
                          Phone
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as Contact).phone}
                        </p>
                      </div>
                    )}
                    {(selectedItem as Contact).company && (
                      <div>
                        <label className="text-sm font-medium text-foreground/70">
                          Company
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as Contact).company}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Contact Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as Contact).created_at)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Message
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">
                        {(selectedItem as Contact).message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "get-started" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        First Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as GetStartedRequest).first_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Last Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as GetStartedRequest).last_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Email
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as GetStartedRequest).email}
                      </p>
                    </div>
                    {(selectedItem as GetStartedRequest).phone && (
                      <div>
                        <label className="text-sm font-medium text-foreground/70">
                          Phone
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as GetStartedRequest).phone}
                        </p>
                      </div>
                    )}
                    {(selectedItem as GetStartedRequest).company && (
                      <div>
                        <label className="text-sm font-medium text-foreground/70">
                          Company
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as GetStartedRequest).company}
                        </p>
                      </div>
                    )}
                    {(selectedItem as GetStartedRequest).job_title && (
                      <div>
                        <label className="text-sm font-medium text-foreground/70">
                          Job Title
                        </label>
                        <p className="text-foreground">
                          {(selectedItem as GetStartedRequest).job_title}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Request Date
                      </label>
                      <p className="text-foreground">
                        {formatDate(
                          (selectedItem as GetStartedRequest).created_at,
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Message
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">
                        {(selectedItem as GetStartedRequest).message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "resume" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        File Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as any).file_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Applicant Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as any).applicant_name || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Position
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as any).position || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Upload Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as any).uploaded_at)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-foreground/70">
                        File URL
                      </label>
                      <a
                        href={(selectedItem as any).file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-tech-blue hover:text-tech-blue/80 transition-colors break-all"
                      >
                        <Download className="w-4 h-4 flex-shrink-0" />
                        Download Resume
                      </a>
                    </div>
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
    </div>
  );
}

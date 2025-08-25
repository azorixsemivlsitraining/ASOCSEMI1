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
  ExternalLink,
  X,
  Lock,
  Edit,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";
import Header from "../components/Header";
import BlogEditor from "../components/BlogEditor";
import JobEditor from "../components/JobEditor";
import GoogleSheetsWidget from "../components/GoogleSheetsWidget";
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

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

interface ResumeUpload {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
  applicant_name?: string;
  position?: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  salary_range?: string;
  experience_level: string;
  skills_required: string[];
  status: "active" | "inactive" | "closed";
  posted_date: string;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [resumeUploads, setResumeUploads] = useState<ResumeUpload[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [getStartedRequests, setGetStartedRequests] = useState<
    GetStartedRequest[]
  >([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<
    NewsletterSubscriber[]
  >([]);
  const [actualResumeUploads, setActualResumeUploads] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [activeTab, setActiveTab] = useState<
    | "applications"
    | "contacts"
    | "resumes"
    | "blogs"
    | "jobs"
    | "getstarted"
    | "newsletter"
  >("applications");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    Application | Contact | ResumeUpload | BlogPost | JobPosting | null
  >(null);
  const [modalType, setModalType] = useState<
    "application" | "contact" | "resume" | "blog" | "job" | null
  >(null);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showJobEditor, setShowJobEditor] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

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
      console.log("🔄 Starting data fetch from Supabase...");

      // Fetch applications
      console.log("📋 Fetching job applications...");
      const { data: applicationsData, error: appsError } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (appsError) {
        console.error("❌ Job applications error:", appsError);
        throw appsError;
      }
      console.log(
        "✅ Job applications data:",
        applicationsData?.length || 0,
        "records",
      );
      setApplications(applicationsData || []);

      // Fetch contacts
      console.log("📞 Fetching contacts...");
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactsError) {
        console.error("❌ Contacts error:", contactsError);
        throw contactsError;
      }
      console.log("✅ Contacts data:", contactsData?.length || 0, "records");
      setContacts(contactsData || []);

      // Fetch get started requests
      console.log("🚀 Fetching get started requests...");
      const { data: getStartedData, error: getStartedError } = await supabase
        .from("get_started_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (getStartedError) {
        console.error("❌ Get started requests error:", getStartedError);
        throw getStartedError;
      }
      console.log(
        "✅ Get started requests data:",
        getStartedData?.length || 0,
        "records",
      );
      setGetStartedRequests(getStartedData || []);

      // Fetch newsletter subscribers
      console.log("📧 Fetching newsletter subscribers...");
      const { data: newsletterData, error: newsletterError } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (newsletterError) {
        console.error("❌ Newsletter subscribers error:", newsletterError);
        throw newsletterError;
      }
      console.log(
        "✅ Newsletter subscribers data:",
        newsletterData?.length || 0,
        "records",
      );
      setNewsletterSubscribers(newsletterData || []);

      // Fetch actual resume uploads table
      console.log("📄 Fetching resume uploads...");
      const { data: actualResumeData, error: resumeError } = await supabase
        .from("resume_uploads")
        .select("*")
        .order("created_at", { ascending: false });

      if (resumeError) {
        console.error("❌ Resume uploads error:", resumeError);
        throw resumeError;
      }
      console.log(
        "✅ Resume uploads data:",
        actualResumeData?.length || 0,
        "records",
      );
      setActualResumeUploads(actualResumeData || []);

      // Combine resume uploads from job applications and direct resume uploads
      const jobAppResumes =
        applicationsData
          ?.filter((app) => app.resume_url)
          .map((app) => ({
            id: app.id,
            file_name: `Resume_${app.full_name.replace(/\s+/g, "_")}.pdf`,
            file_url: app.resume_url,
            uploaded_at: app.created_at,
            applicant_name: app.full_name,
            position: app.position,
            source: "job_application",
          })) || [];

      const directResumes =
        actualResumeData
          ?.filter((resume) => resume.resume_url)
          .map((resume) => ({
            id: resume.id,
            file_name: `Resume_${resume.full_name.replace(/\s+/g, "_")}.pdf`,
            file_url: resume.resume_url,
            uploaded_at: resume.created_at,
            applicant_name: resume.full_name,
            position: resume.position_interested || "General Application",
            source: "direct_upload",
          })) || [];

      setResumeUploads([...jobAppResumes, ...directResumes]);

      // Fetch blog posts from API
      console.log("📝 Fetching blog posts...");
      const blogsResponse = await fetch("/api/blogs");
      if (blogsResponse.ok) {
        const blogsResult = await blogsResponse.json();
        if (blogsResult.success) {
          console.log(
            "✅ Blog posts data:",
            blogsResult.data?.length || 0,
            "records",
          );
          setBlogPosts(blogsResult.data);
        } else {
          console.error("❌ Blog posts API error:", blogsResult.error);
        }
      } else {
        console.error("❌ Blog posts HTTP error:", blogsResponse.status);
      }

      // Fetch job postings from API
      console.log("💼 Fetching job postings...");
      const jobsResponse = await fetch("/api/jobs");
      if (jobsResponse.ok) {
        const jobsResult = await jobsResponse.json();
        if (jobsResult.success) {
          console.log(
            "✅ Job postings data:",
            jobsResult.data?.length || 0,
            "records",
          );
          setJobPostings(jobsResult.data);
        } else {
          console.error("❌ Job postings API error:", jobsResult.error);
        }
      } else {
        console.error("❌ Job postings HTTP error:", jobsResponse.status);
      }

      console.log("🎉 Data fetch completed successfully!");
    } catch (error) {
      console.error("Error fetching data:", formatErrorMessage(error));

      // Check if it's a table not found error
      const errorMessage = formatErrorMessage(error);
      if (
        errorMessage.includes("relation") &&
        errorMessage.includes("does not exist")
      ) {
        console.error(
          "🚨 SUPABASE SETUP REQUIRED: Database tables are missing!",
        );
        console.error(
          "📋 Please check SUPABASE_DEBUG.md for setup instructions",
        );
      }
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

  const filteredResumeUploads = resumeUploads.filter(
    (resume) =>
      resume.file_name.toLowerCase().includes(filter.toLowerCase()) ||
      resume.applicant_name?.toLowerCase().includes(filter.toLowerCase()) ||
      resume.position?.toLowerCase().includes(filter.toLowerCase()),
  );

  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.author.toLowerCase().includes(filter.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())),
  );

  const filteredJobPostings = jobPostings.filter(
    (job) =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.department.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase()) ||
      job.skills_required.some((skill) => skill.toLowerCase().includes(filter.toLowerCase())),
  );

  // Blog management functions
  const saveBlogPost = async (post: BlogPost) => {
    try {
      if (editingBlog) {
        // Update existing post
        const response = await fetch(`/api/blogs/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setBlogPosts((prev) =>
              prev.map((p) => (p.id === post.id ? result.data : p)),
            );
          }
        }
      } else {
        // Create new post
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setBlogPosts((prev) => [...prev, result.data]);
          }
        }
      }

      setShowBlogEditor(false);
      setEditingBlog(null);
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Error saving blog post. Please try again.");
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setBlogPosts((prev) => prev.filter((p) => p.id !== id));
          }
        }
      } catch (error) {
        console.error("Error deleting blog post:", error);
        alert("Error deleting blog post. Please try again.");
      }
    }
  };

  const startEditBlog = (post: BlogPost) => {
    setEditingBlog(post);
    setShowBlogEditor(true);
  };

  const startNewBlog = () => {
    setEditingBlog(null);
    setShowBlogEditor(true);
  };

  // Job management functions
  const saveJobPosting = async (job: JobPosting) => {
    try {
      if (editingJob) {
        // Update existing job
        const response = await fetch(`/api/jobs/${job.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setJobPostings((prev) =>
              prev.map((j) => (j.id === job.id ? result.data : j)),
            );
          }
        }
      } else {
        // Create new job
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setJobPostings((prev) => [...prev, result.data]);
          }
        }
      }

      setShowJobEditor(false);
      setEditingJob(null);
    } catch (error) {
      console.error("Error saving job posting:", error);
      alert("Error saving job posting. Please try again.");
    }
  };

  const deleteJobPosting = async (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await fetch(`/api/jobs/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setJobPostings((prev) => prev.filter((j) => j.id !== id));
          }
        }
      } catch (error) {
        console.error("Error deleting job posting:", error);
        alert("Error deleting job posting. Please try again.");
      }
    }
  };

  const startEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setShowJobEditor(true);
  };

  const startNewJob = () => {
    setEditingJob(null);
    setShowJobEditor(true);
  };

  const updateJobStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setJobPostings((prev) =>
            prev.map((job) => (job.id === id ? { ...job, status } : job)),
          );
        }
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

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

    // Contact Messages Sheet
    if (filteredContacts.length > 0) {
      const contactsSheet = XLSX.utils.json_to_sheet(filteredContacts);
      XLSX.utils.book_append_sheet(workbook, contactsSheet, "Contact Messages");
    }

    // Resume Uploads Sheet
    if (filteredResumeUploads.length > 0) {
      const resumesSheet = XLSX.utils.json_to_sheet(filteredResumeUploads);
      XLSX.utils.book_append_sheet(workbook, resumesSheet, "Resume Uploads");
    }

    // Get Started Requests Sheet
    if (filteredGetStarted.length > 0) {
      const getStartedSheet = XLSX.utils.json_to_sheet(filteredGetStarted);
      XLSX.utils.book_append_sheet(
        workbook,
        getStartedSheet,
        "Get Started Requests",
      );
    }

    // Newsletter Subscribers Sheet
    if (filteredNewsletter.length > 0) {
      const newsletterSheet = XLSX.utils.json_to_sheet(filteredNewsletter);
      XLSX.utils.book_append_sheet(
        workbook,
        newsletterSheet,
        "Newsletter Subscribers",
      );
    }

    XLSX.writeFile(
      workbook,
      `All_Forms_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const filteredGetStarted = getStartedRequests.filter(
    (request) =>
      request.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      request.last_name.toLowerCase().includes(filter.toLowerCase()) ||
      request.email.toLowerCase().includes(filter.toLowerCase()) ||
      request.company?.toLowerCase().includes(filter.toLowerCase()),
  );

  const filteredNewsletter = newsletterSubscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(filter.toLowerCase()),
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case "applications":
        return { data: filteredApplications, filename: "job_applications" };
      case "contacts":
        return { data: filteredContacts, filename: "contact_messages" };
      case "resumes":
        return { data: filteredResumeUploads, filename: "resume_uploads" };
      case "getstarted":
        return { data: filteredGetStarted, filename: "get_started_requests" };
      case "newsletter":
        return { data: filteredNewsletter, filename: "newsletter_subscribers" };
      case "blogs":
        return { data: filteredBlogPosts, filename: "blog_posts" };
      case "jobs":
        return { data: filteredJobPostings, filename: "job_postings" };
      default:
        return { data: [], filename: "export" };
    }
  };

  const openModal = (
    item: Application | Contact | ResumeUpload | BlogPost | JobPosting,
    type: "application" | "contact" | "resume" | "blog" | "job",
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
                  System
                </h1>
                <p className="text-foreground/70">
                  Enter the admin password to access the system
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
                  Access System
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  <span className="text-gradient">System</span> Dashboard
                </h1>
                <p className="text-foreground/70">
                  Manage job applications, contact inquiries, and resume
                  downloads
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="/resume-downloads"
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Resume Downloads
                </a>
              </div>
            </div>
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
                  <p className="text-foreground/70">Total Applications</p>
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
                    {
                      applications.filter((app) => app.status === "pending")
                        .length
                    }
                  </h3>
                  <p className="text-foreground/70">Pending Review</p>
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
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <Download className="w-6 h-6 text-green-500" />
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

          {/* Second row for blog stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {blogPosts.length}
                  </h3>
                  <p className="text-foreground/70">Total Blog Posts</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-500" />
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
                    {
                      newsletterSubscribers.filter((sub) => sub.is_active)
                        .length
                    }
                  </h3>
                  <p className="text-foreground/70">Newsletter Subscribers</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/10 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {jobPostings.filter((job) => job.status === "active").length}
                  </h3>
                  <p className="text-foreground/70">Active Job Postings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Sheets Integration Widget */}
          <div className="mb-6">
            <GoogleSheetsWidget
              totalContacts={contacts.length}
              totalApplications={applications.length}
              totalGetStarted={getStartedRequests.length}
              totalResumes={resumeUploads.length}
              totalNewsletter={
                newsletterSubscribers.filter((sub) => sub.is_active).length
              }
            />
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card-bg border border-border-subtle rounded-xl mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "applications"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Job Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "contacts"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Contact Messages ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab("resumes")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "resumes"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Resumes ({resumeUploads.length})
              </button>
              <button
                onClick={() => setActiveTab("getstarted")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "getstarted"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Get Started ({getStartedRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("newsletter")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "newsletter"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Newsletter ({newsletterSubscribers.length})
              </button>
              <button
                onClick={() => setActiveTab("blogs")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "blogs"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Blog Posts ({blogPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "jobs"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Job Postings ({jobPostings.length})
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
                          : activeTab === "getstarted"
                            ? "by name, email, company..."
                            : activeTab === "newsletter"
                              ? "by email..."
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

                {/* Export Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const { data, filename } = getCurrentData();
                      exportToCSV(data, filename);
                    }}
                    className="px-4 py-3 bg-tech-blue/10 text-tech-blue border border-tech-blue/20 rounded-lg hover:bg-tech-blue/20 transition-colors font-medium whitespace-nowrap"
                    disabled={getCurrentData().data.length === 0}
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      const { data, filename } = getCurrentData();
                      exportToExcel(data, filename);
                    }}
                    className="px-4 py-3 bg-green-600/10 text-green-600 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors font-medium whitespace-nowrap"
                    disabled={getCurrentData().data.length === 0}
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={exportAllToExcel}
                    className="px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors font-medium whitespace-nowrap"
                    disabled={
                      filteredApplications.length === 0 &&
                      filteredResumeUploads.length === 0
                    }
                  >
                    Export All (2 Sheets)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
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
                                  className="p-2 bg-tech-blue/10 text-tech-blue rounded-lg hover:bg-tech-blue/20 transition-colors"
                                  title="Download Resume as PDF"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              ))}
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
            ) : activeTab === "getstarted" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Job Title
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Request Date
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGetStarted.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-border-subtle/50 hover:bg-background/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {request.first_name} {request.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {request.email}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {request.company || "-"}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {request.job_title || "-"}
                        </td>
                        <td className="px-6 py-4 text-foreground/70 text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              openModal(request as any, "getstarted" as any)
                            }
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

                {filteredGetStarted.length === 0 && (
                  <div className="p-12 text-center text-foreground/70">
                    No get started requests found.
                  </div>
                )}
              </div>
            ) : activeTab === "newsletter" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Subscribed Date
                      </th>
                      <th className="px-6 py-4 text-left text-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNewsletter.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="border-b border-border-subtle/50 hover:bg-background/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {subscriber.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subscriber.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground/70 text-sm">
                          {new Date(
                            subscriber.subscribed_at,
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              openModal(subscriber as any, "newsletter" as any)
                            }
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

                {filteredNewsletter.length === 0 && (
                  <div className="p-12 text-center text-foreground/70">
                    No newsletter subscribers found.
                  </div>
                )}
              </div>
            ) : activeTab === "blogs" ? (
              <div>
                {/* Blog Management Header */}
                <div className="p-6 border-b border-border-subtle flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Blog Posts Management
                  </h3>
                  <button
                    onClick={startNewBlog}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Blog Post
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border-subtle">
                      <tr>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Author
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Created
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogPosts.map((post) => (
                        <tr
                          key={post.id}
                          className="border-b border-border-subtle/50 hover:bg-background/50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-foreground">
                                {post.title}
                              </div>
                              <div className="text-sm text-foreground/70 line-clamp-1">
                                {post.excerpt}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {post.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {post.author}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  post.published
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {post.published ? "Published" : "Draft"}
                              </span>
                              {post.featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground/70 text-sm">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(post, "blog")}
                                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => startEditBlog(post)}
                                className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                                title="Edit Post"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteBlogPost(post.id)}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="Delete Post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredBlogPosts.length === 0 && (
                    <div className="p-12 text-center text-foreground/70">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                      <p className="text-lg font-medium mb-2">
                        No blog posts found
                      </p>
                      <p className="text-sm">
                        Create your first blog post to get started
                      </p>
                      <button
                        onClick={startNewBlog}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Create Blog Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === "jobs" ? (
              <div>
                {/* Job Management Header */}
                <div className="p-6 border-b border-border-subtle flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Job Postings Management
                  </h3>
                  <button
                    onClick={startNewJob}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Job Posting
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border-subtle">
                      <tr>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Job Title
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Department
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Posted Date
                        </th>
                        <th className="px-6 py-4 text-left text-foreground font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobPostings.map((job) => (
                        <tr
                          key={job.id}
                          className="border-b border-border-subtle/50 hover:bg-background/50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-foreground">
                                {job.title}
                              </div>
                              <div className="text-sm text-foreground/70 line-clamp-2">
                                {job.description}
                              </div>
                              {job.skills_required.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {job.skills_required.slice(0, 3).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {job.skills_required.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{job.skills_required.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {job.department}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {job.location}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {job.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={job.status}
                              onChange={(e) => updateJobStatus(job.id, e.target.value)}
                              className={`px-2 py-1 text-xs rounded-full border-0 font-medium ${
                                job.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : job.status === "inactive"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-foreground/70 text-sm">
                            {new Date(job.posted_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(job, "job")}
                                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => startEditJob(job)}
                                className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                                title="Edit Job"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteJobPosting(job.id)}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredJobPostings.length === 0 && (
                    <div className="p-12 text-center text-foreground/70">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                      <p className="text-lg font-medium mb-2">
                        No job postings found
                      </p>
                      <p className="text-sm">
                        Create your first job posting to get started
                      </p>
                      <button
                        onClick={startNewJob}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Create Job Posting
                      </button>
                    </div>
                  )}
                </div>
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
                    {filteredResumeUploads.map((resume) => (
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
                              download={`${resume.file_name.replace(/\.[^/.]+$/, "")}.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-tech-blue/10 text-tech-blue rounded-lg hover:bg-tech-blue/20 transition-colors"
                              title="Download Resume as PDF"
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
                {modalType === "resume" && "Resume Upload Details"}
                {modalType === "blog" && "Blog Post Details"}
                {modalType === "job" && "Job Posting Details"}
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
                          download={`Resume_${(selectedItem as Application).full_name.replace(/\s+/g, "_")}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-tech-blue hover:text-tech-blue/80 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Resume as PDF
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

              {modalType === "resume" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        File Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as ResumeUpload).file_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Applicant Name
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as ResumeUpload).applicant_name || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Position
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as ResumeUpload).position || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Upload Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as ResumeUpload).uploaded_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Resume File
                      </label>
                      <a
                        href={(selectedItem as ResumeUpload).file_url}
                        download={`${(selectedItem as ResumeUpload).file_name.replace(/\.[^/.]+$/, "")}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-tech-blue hover:text-tech-blue/80 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Resume as PDF
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "blog" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Title
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as BlogPost).title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Author
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as BlogPost).author}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Status
                      </label>
                      <div className="flex gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (selectedItem as BlogPost).published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {(selectedItem as BlogPost).published
                            ? "Published"
                            : "Draft"}
                        </span>
                        {(selectedItem as BlogPost).featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Read Time
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as BlogPost).readTime}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Created Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as BlogPost).created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Updated Date
                      </label>
                      <p className="text-foreground">
                        {formatDate((selectedItem as BlogPost).updated_at)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Excerpt
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg">
                      <p className="text-foreground">
                        {(selectedItem as BlogPost).excerpt}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(selectedItem as BlogPost).tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {(selectedItem as BlogPost).image && (
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Featured Image
                      </label>
                      <div className="mt-2">
                        <img
                          src={(selectedItem as BlogPost).image}
                          alt={(selectedItem as BlogPost).title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Content
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg max-h-60 overflow-y-auto">
                      <div className="text-foreground whitespace-pre-wrap">
                        {(selectedItem as BlogPost).content}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "job" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Job Title
                      </label>
                      <p className="text-foreground font-medium">
                        {(selectedItem as JobPosting).title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Department
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobPosting).department}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Location
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobPosting).location}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Job Type
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobPosting).type}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          (selectedItem as JobPosting).status === "active"
                            ? "bg-green-100 text-green-800"
                            : (selectedItem as JobPosting).status === "inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(selectedItem as JobPosting).status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Experience Level
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobPosting).experience_level || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Salary Range
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobPosting).salary_range || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Posted Date
                      </label>
                      <p className="text-foreground">
                        {new Date((selectedItem as JobPosting).posted_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Application Deadline
                      </label>
                      <p className="text-foreground">
                        {(selectedItem as JobPosting).application_deadline
                          ? new Date((selectedItem as JobPosting).application_deadline!).toLocaleDateString()
                          : "No deadline specified"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Skills Required
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(selectedItem as JobPosting).skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70">
                      Job Description
                    </label>
                    <div className="mt-2 p-4 bg-background/50 rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">
                        {(selectedItem as JobPosting).description}
                      </p>
                    </div>
                  </div>
                  {(selectedItem as JobPosting).requirements && (
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Requirements
                      </label>
                      <div className="mt-2 p-4 bg-background/50 rounded-lg max-h-60 overflow-y-auto">
                        <p className="text-foreground whitespace-pre-wrap">
                          {(selectedItem as JobPosting).requirements}
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedItem as JobPosting).responsibilities && (
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Responsibilities
                      </label>
                      <div className="mt-2 p-4 bg-background/50 rounded-lg max-h-60 overflow-y-auto">
                        <p className="text-foreground whitespace-pre-wrap">
                          {(selectedItem as JobPosting).responsibilities}
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedItem as JobPosting).benefits && (
                    <div>
                      <label className="text-sm font-medium text-foreground/70">
                        Benefits & Perks
                      </label>
                      <div className="mt-2 p-4 bg-background/50 rounded-lg max-h-60 overflow-y-auto">
                        <p className="text-foreground whitespace-pre-wrap">
                          {(selectedItem as JobPosting).benefits}
                        </p>
                      </div>
                    </div>
                  )}
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

      {/* Blog Editor Modal */}
      {showBlogEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background border border-border-subtle rounded-xl w-full h-full max-w-none max-h-none overflow-y-auto">
            <BlogEditor
              post={editingBlog || undefined}
              onSave={saveBlogPost}
              onCancel={() => {
                setShowBlogEditor(false);
                setEditingBlog(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Job Editor Modal */}
      {showJobEditor && (
        <JobEditor
          isOpen={showJobEditor}
          onClose={() => {
            setShowJobEditor(false);
            setEditingJob(null);
          }}
          onSave={saveJobPosting}
          editingJob={editingJob}
        />
      )}
    </div>
  );
}

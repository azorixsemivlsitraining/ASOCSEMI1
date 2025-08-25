import { useEffect, useState, useRef } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Send,
  Upload,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplicationModal from "../components/ApplicationModal";
import { supabase } from "../lib/supabase";
import { googleSheetsService } from "../services/googleSheets";
import Swal from "sweetalert2";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

function Section({ children, className = "" }: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Careers() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [jobOpenings, setJobOpenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeFormData, setResumeFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    positionInterested: "",
    experienceLevel: "",
    skills: "",
    coverLetter: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeFile: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setIsVisible(true);
    fetchJobOpenings();
  }, []);

  const fetchJobOpenings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs?status=active");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setJobOpenings(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching job openings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleResumeInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setResumeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFormData((prev) => ({
      ...prev,
      resumeFile: file,
    }));
  };

  const uploadResumeFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Resume uploaded successfully: ${result.data.url}`);
        return result.data.url;
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading resume file:", error);
      throw error;
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    Swal.fire({
      title: "Submitting Resume...",
      text: "Please wait while we process your submission",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFormData.resumeFile) {
        resumeUrl = await uploadResumeFile(resumeFormData.resumeFile);
      }

      // Submit to resume_uploads table
      const resumeData = {
        full_name: resumeFormData.fullName,
        email: resumeFormData.email,
        phone: resumeFormData.phone,
        location: resumeFormData.location,
        position_interested: resumeFormData.positionInterested,
        experience_level: resumeFormData.experienceLevel,
        skills: resumeFormData.skills,
        cover_letter: resumeFormData.coverLetter,
        linkedin_url: resumeFormData.linkedinUrl,
        portfolio_url: resumeFormData.portfolioUrl,
        resume_url: resumeUrl,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("resume_uploads")
        .insert([resumeData]);

      if (error) throw error;

      // Sync to Google Sheets in background
      googleSheetsService.syncResumeUpload(resumeData).catch((err) => {
        console.error("Failed to sync resume upload to Google Sheets:", err);
      });

      Swal.fire({
        title: "Resume Submitted!",
        text: "Thank you for submitting your resume. We'll review it and get back to you for suitable opportunities.",
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#649e7d",
      });

      // Reset form and close modal
      setResumeFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        positionInterested: "",
        experienceLevel: "",
        skills: "",
        coverLetter: "",
        linkedinUrl: "",
        portfolioUrl: "",
        resumeFile: null,
      });
      setIsResumeModalOpen(false);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: `Failed to submit resume: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Environment",
      description:
        "Work with talented professionals in a supportive team atmosphere",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Career Growth",
      description:
        "Continuous learning opportunities and clear advancement paths",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-dark-bg via-background to-card-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Join Our <span className="text-gradient">Team</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Build the future of technology with ASOCSEMI
              </p>
              <p className="text-lg text-muted-foreground">
                We're looking for passionate individuals who want to make a
                difference in the world of technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose <span className="text-gradient">ASOCSEMI</span>?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join a company that values innovation, growth, and work-life
                  balance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border-subtle rounded-xl p-8 text-center card-hover group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-tech-blue mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Job Openings */}
      <Section>
        <section className="py-20 bg-card-bg">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Current <span className="text-gradient">Openings</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover exciting opportunities to advance your career
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobOpenings.map((job, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border-subtle rounded-xl p-6 card-hover group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-tech-blue transition-colors">
                        {job.title}
                      </h3>
                      <span className="bg-tech-blue/10 text-tech-blue px-3 py-1 rounded-full text-sm">
                        {job.type}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyClick(job)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      Apply Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Contact Section */}
      <Section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border-subtle rounded-2xl p-8 lg:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Don't See the Right Role?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    We're always looking for talented individuals. Send us your
                    resume and we'll keep you in mind for future opportunities.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Contact Our HR Team
                    </h3>
                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        Email: careers@asocsemi.com
                      </p>
                      <p className="text-muted-foreground">
                        Phone: +91 40-71553446
                      </p>
                      <p className="text-muted-foreground">
                        Address: ASOCSEMI, ANANTHA SOFTWARE SOLUTIONS PVT LTD,
                        WeWork Rajapushpa Summit Rajapushpa Summit, Financial
                        District, Hyderabad, Telangana 500032.
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setIsResumeModalOpen(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg text-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      <Send className="w-5 h-5" />
                      Send Your Resume
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Section>

      <Footer />

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          jobTitle={selectedJob.title}
          jobDepartment={selectedJob.department}
          jobLocation={selectedJob.location}
        />
      )}

      {/* Resume Upload Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border-subtle rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Submit Your Resume
                </h2>
                <p className="text-muted-foreground mt-1">
                  Share your details for future opportunities
                </p>
              </div>
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleResumeSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={resumeFormData.fullName}
                    onChange={handleResumeInputChange}
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={resumeFormData.email}
                    onChange={handleResumeInputChange}
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={resumeFormData.phone}
                    onChange={handleResumeInputChange}
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={resumeFormData.location}
                    onChange={handleResumeInputChange}
                    placeholder="City, Country"
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Position of Interest
                  </label>
                  <input
                    type="text"
                    name="positionInterested"
                    value={resumeFormData.positionInterested}
                    onChange={handleResumeInputChange}
                    placeholder="e.g., VLSI Engineer, Software Developer"
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={resumeFormData.experienceLevel}
                    onChange={handleResumeInputChange}
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-6">4-6 years</option>
                    <option value="7-10">7-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-2 text-sm font-medium">
                  Key Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={resumeFormData.skills}
                  onChange={handleResumeInputChange}
                  placeholder="e.g., VLSI Design, Verilog, SystemVerilog, Python"
                  className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-foreground mb-2 text-sm font-medium">
                  Cover Letter / Message
                </label>
                <textarea
                  name="coverLetter"
                  value={resumeFormData.coverLetter}
                  onChange={handleResumeInputChange}
                  placeholder="Tell us about yourself and what opportunities you're looking for..."
                  rows={4}
                  className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={resumeFormData.linkedinUrl}
                    onChange={handleResumeInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={resumeFormData.portfolioUrl}
                    onChange={handleResumeInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-2 text-sm font-medium">
                  Upload Resume *
                </label>
                <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileChange}
                    className="hidden"
                    required
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {resumeFormData.resumeFile
                        ? resumeFormData.resumeFile.name
                        : "Click to upload resume"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, DOC, or DOCX (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(false)}
                  className="flex-1 border border-border-subtle hover:border-primary text-foreground py-3 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {uploading ? "Submitting..." : "Submit Resume"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

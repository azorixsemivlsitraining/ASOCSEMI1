import { useState } from "react";
import { X, Upload, Send } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabase";
import { googleSheetsService } from "../services/googleSheets";
import { useAuth } from "../contexts/AuthContext";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobDepartment: string;
  jobLocation: string;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  jobTitle,
  jobDepartment,
  jobLocation,
}: ApplicationModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    position: jobTitle,
    experience: "",
    coverLetter: "",
    linkedinUrl: "",
    cvFile: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      cvFile: file,
    }));
  };

  const uploadResume = async (file: File): Promise<string | null> => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Show loading
    Swal.fire({
      title: "Submitting Application...",
      text: "Please wait while we process your application",
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
      if (formData.cvFile) {
        resumeUrl = await uploadResume(formData.cvFile);
      }

      // Submit application to database
      const applicationData = {
        user_id: user?.id || null,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        experience: formData.experience,
        cover_letter: formData.coverLetter,
        resume_url: resumeUrl,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("job_applications")
        .insert([applicationData]);

      if (error) throw error;

      // Sync to Google Sheets in background
      googleSheetsService.syncJobApplication(applicationData).catch((err) => {
        console.error("Failed to sync job application to Google Sheets:", err);
      });

      Swal.fire({
        title: "Application Submitted!",
        text: `Thank you for applying for the ${jobTitle} position. We'll review your application and get back to you soon.`,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#FF6B5A",
      });

      // Reset form and close modal
      setFormData({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        phone: "",
        position: jobTitle,
        experience: "",
        coverLetter: "",
        linkedinUrl: "",
        cvFile: null,
      });
      onClose();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: `Failed to submit application: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border-subtle rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Apply for Position
            </h2>
            <p className="text-muted-foreground mt-1">
              {jobTitle} - {jobDepartment}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                First name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Last name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer, VLSI Designer"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Years of Experience *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
              required
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="2-3">2-3 years</option>
              <option value="4-6">4-6 years</option>
              <option value="7-10">7-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => handleInputChange(e as any)}
              placeholder="Tell us why you're interested in this position..."
              rows={4}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tech-blue transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              UPLOAD RESUME *
            </label>
            <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 text-center hover:border-tech-blue transition-colors">
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {formData.cvFile ? formData.cvFile.name : "Upload File"}
                </p>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 accent-tech-blue"
                required
              />
              <span className="text-muted-foreground">
                List in CV/Available
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border-subtle hover:border-tech-blue text-foreground py-3 rounded-lg transition-all duration-200"
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
              {uploading ? "Submitting..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

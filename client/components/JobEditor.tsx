import React, { useState, useEffect } from "react";
import { X, Save, Plus, Minus } from "lucide-react";

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

interface JobEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobPosting) => void;
  editingJob?: JobPosting | null;
}

export default function JobEditor({
  isOpen,
  onClose,
  onSave,
  editingJob,
}: JobEditorProps) {
  const [formData, setFormData] = useState<Partial<JobPosting>>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    salary_range: "",
    experience_level: "",
    skills_required: [],
    status: "active",
    posted_date: new Date().toISOString().split("T")[0],
    application_deadline: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setFormData(editingJob);
    } else {
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        salary_range: "",
        experience_level: "",
        skills_required: [],
        status: "active",
        posted_date: new Date().toISOString().split("T")[0],
        application_deadline: "",
      });
    }
  }, [editingJob, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills_required?.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills_required: [...(prev.skills_required || []), newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required?.filter(
        (skill) => skill !== skillToRemove,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.department ||
        !formData.location ||
        !formData.type ||
        !formData.description
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const jobData: JobPosting = {
        id: editingJob?.id || Date.now().toString(),
        title: formData.title || "",
        department: formData.department || "",
        location: formData.location || "",
        type: formData.type || "Full-time",
        description: formData.description || "",
        requirements: formData.requirements || "",
        responsibilities: formData.responsibilities || "",
        benefits: formData.benefits || "",
        salary_range: formData.salary_range,
        experience_level: formData.experience_level || "",
        skills_required: formData.skills_required || [],
        status: formData.status || "active",
        posted_date: formData.posted_date || new Date().toISOString().split("T")[0],
        application_deadline: formData.application_deadline,
        created_at: editingJob?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await onSave(jobData);
      onClose();
    } catch (error) {
      console.error("Error saving job posting:", error);
      alert("Error saving job posting. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border-subtle rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {editingJob
                ? "Update the job posting details"
                : "Add a new job opportunity to the careers page"}
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                placeholder="e.g., Senior VLSI Design Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Department *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department || ""}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                placeholder="e.g., Engineering"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                placeholder="e.g., Bangalore, India"
                required
              />
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type || "Full-time"}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Status
              </label>
              <select
                name="status"
                value={formData.status || "active"}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Experience Level
              </label>
              <input
                type="text"
                name="experience_level"
                value={formData.experience_level || ""}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                placeholder="e.g., 3+ years"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Salary Range
              </label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range || ""}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                placeholder="e.g., ₹10-15 LPA"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2 text-sm font-medium">
                Application Deadline
              </label>
              <input
                type="date"
                name="application_deadline"
                value={formData.application_deadline || ""}
                onChange={handleInputChange}
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Skills Required
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                className="flex-1 bg-background border border-border-subtle rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills_required?.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
              placeholder="Brief description of the role and what the candidate will be doing..."
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements || ""}
              onChange={handleInputChange}
              rows={6}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
              placeholder="List the qualifications, experience, and skills required for this position..."
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Responsibilities
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities || ""}
              onChange={handleInputChange}
              rows={6}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
              placeholder="Describe the key responsibilities and duties of this role..."
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-foreground mb-2 text-sm font-medium">
              Benefits & Perks
            </label>
            <textarea
              name="benefits"
              value={formData.benefits || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
              placeholder="List the benefits, perks, and compensation details..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border-subtle hover:border-primary text-foreground py-3 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

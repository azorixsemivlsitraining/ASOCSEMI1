import { RequestHandler } from "express";

export interface JobPosting {
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

// Mock data storage - In production, use a real database
let jobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior VLSI Design Engineer",
    department: "Engineering",
    location: "Bangalore, India",
    type: "Full-time",
    description: "Lead VLSI design projects for next-generation semiconductor solutions.",
    requirements: "- Bachelor's/Master's degree in Electronics/VLSI Engineering\n- 5+ years of experience in VLSI design\n- Proficiency in Verilog/SystemVerilog\n- Experience with EDA tools (Synopsys, Cadence)\n- Strong analytical and problem-solving skills",
    responsibilities: "- Design and develop complex VLSI circuits\n- Collaborate with verification and physical design teams\n- Optimize designs for power, performance, and area\n- Mentor junior engineers\n- Review design specifications and architectures",
    benefits: "- Competitive salary and benefits\n- Flexible working hours\n- Professional development opportunities\n- Health insurance\n- Performance bonuses",
    salary_range: "₹15-25 LPA",
    experience_level: "5+ years",
    skills_required: ["VLSI Design", "Verilog", "SystemVerilog", "Synopsys", "Cadence"],
    status: "active",
    posted_date: "2024-12-20",
    application_deadline: "2025-01-31",
    created_at: "2024-12-20T10:00:00.000Z",
    updated_at: "2024-12-20T10:00:00.000Z",
  },
  {
    id: "2", 
    title: "Design verification engineer",
    department: "Semiconductors Development",
    location: "Hyderabad, India",
    type: "Full-time",
    description: "Understanding of PG-Grid optimization, including identification of high vs low current density paths & layer/via optimization, Adaptive PDN experience",
    requirements: "- Bachelor's degree in Electronics/Computer Engineering\n- 3+ years of verification experience\n- Strong knowledge of SystemVerilog/UVM\n- Experience with verification methodologies\n- Knowledge of scripting languages (Python/Perl)",
    responsibilities: "- Develop comprehensive verification plans\n- Create testbenches using SystemVerilog/UVM\n- Debug and analyze design issues\n- Collaborate with design teams\n- Ensure functional and timing closure",
    benefits: "- Competitive compensation\n- Learning and development programs\n- Flexible work arrangements\n- Team building activities\n- Annual performance reviews",
    salary_range: "₹8-15 LPA",
    experience_level: "3+ years",
    skills_required: ["SystemVerilog", "UVM", "Verification", "Python", "Perl"],
    status: "active",
    posted_date: "2024-12-18",
    application_deadline: "2025-01-30",
    created_at: "2024-12-18T10:00:00.000Z",
    updated_at: "2024-12-18T10:00:00.000Z",
  },
  {
    id: "3",
    title: "Hardware Verification Engineer", 
    department: "Verification",
    location: "Chennai, India",
    type: "Full-time",
    description: "Verify complex hardware designs using industry-standard methodologies.",
    requirements: "- Bachelor's/Master's degree in Electronics Engineering\n- 4+ years in hardware verification\n- Expertise in SystemVerilog and UVM\n- Experience with formal verification tools\n- Knowledge of protocols (PCIe, DDR, USB)",
    responsibilities: "- Design and implement verification environments\n- Develop test scenarios and coverage models\n- Perform functional and formal verification\n- Work with design teams to resolve issues\n- Create verification reports and documentation",
    benefits: "- Excellent career growth opportunities\n- Comprehensive health benefits\n- Remote work options\n- Training and certification support\n- Employee referral programs",
    salary_range: "₹10-18 LPA",
    experience_level: "4+ years",
    skills_required: ["SystemVerilog", "UVM", "Formal Verification", "PCIe", "DDR"],
    status: "active",
    posted_date: "2024-12-15",
    application_deadline: "2025-01-25",
    created_at: "2024-12-15T10:00:00.000Z",
    updated_at: "2024-12-15T10:00:00.000Z",
  },
  {
    id: "4",
    title: "STA Engineer",
    department: "Semiconductors Development", 
    location: "Mumbai, India",
    type: "Full-time",
    description: "Experience of multiple power domain implementation with complex UPF/CPF definition required.",
    requirements: "- Bachelor's degree in Electronics/VLSI Engineering\n- 3+ years of STA experience\n- Proficiency in Synopsys PrimeTime\n- Knowledge of UPF/CPF for power domains\n- Experience with advanced process nodes",
    responsibilities: "- Perform static timing analysis on complex designs\n- Handle multi-power domain timing closure\n- Work with physical design teams on timing constraints\n- Debug timing violations and propose solutions\n- Generate timing reports and documentation",
    benefits: "- Competitive salary package\n- Skill development programs\n- Work-life balance initiatives\n- Health and wellness programs\n- Innovation and research opportunities",
    salary_range: "₹8-14 LPA",
    experience_level: "3+ years",
    skills_required: ["STA", "PrimeTime", "UPF", "CPF", "Timing Analysis"],
    status: "active",
    posted_date: "2024-12-12",
    application_deadline: "2025-01-20",
    created_at: "2024-12-12T10:00:00.000Z",
    updated_at: "2024-12-12T10:00:00.000Z",
  },
  {
    id: "5",
    title: "RTL Design Engineer",
    department: "Infrastructure",
    location: "Remote", 
    type: "Full-time",
    description: "Hands-on experience in Linting, CDC – analysis of reports, identify ways to fix the violations",
    requirements: "- Bachelor's degree in Electronics/Computer Engineering\n- 2+ years of RTL design experience\n- Strong knowledge of Verilog/SystemVerilog\n- Experience with CDC analysis and linting tools\n- Understanding of design methodologies",
    responsibilities: "- Design and develop RTL modules\n- Perform linting and CDC analysis\n- Fix design rule violations\n- Collaborate with verification teams\n- Participate in design reviews",
    benefits: "- Remote work opportunity\n- Flexible working hours\n- Professional development budget\n- Technology allowance\n- Regular team meetups",
    salary_range: "₹6-12 LPA",
    experience_level: "2+ years",
    skills_required: ["RTL Design", "Verilog", "SystemVerilog", "CDC", "Linting"],
    status: "active",
    posted_date: "2024-12-10",
    application_deadline: "2025-02-28",
    created_at: "2024-12-10T10:00:00.000Z",
    updated_at: "2024-12-10T10:00:00.000Z",
  },
  {
    id: "6",
    title: "DFT Engineer",
    department: "Design",
    location: "Pune, India",
    type: "Full-time", 
    description: "Proficient in Scan, specializing in ATPG and Pattern verification at Block and Full chip level.",
    requirements: "- Bachelor's/Master's degree in Electronics Engineering\n- 4+ years of DFT experience\n- Expertise in scan design and ATPG\n- Experience with DFT tools (Synopsys DFT Compiler)\n- Knowledge of pattern verification",
    responsibilities: "- Implement DFT features in complex designs\n- Generate and verify test patterns\n- Perform scan insertion and optimization\n- Work on both block and full-chip level\n- Collaborate with design and verification teams",
    benefits: "- Competitive compensation and benefits\n- Career advancement opportunities\n- Technical training and certifications\n- Health and life insurance\n- Employee stock options",
    salary_range: "₹12-20 LPA",
    experience_level: "4+ years",
    skills_required: ["DFT", "Scan Design", "ATPG", "Pattern Verification", "DFT Compiler"],
    status: "active",
    posted_date: "2024-12-08",
    application_deadline: "2025-01-15",
    created_at: "2024-12-08T10:00:00.000Z",
    updated_at: "2024-12-08T10:00:00.000Z",
  },
];

// Get all job postings
export const getAllJobs: RequestHandler = (req, res) => {
  try {
    const { status, department, location, type, limit } = req.query;

    let filteredJobs = [...jobPostings];

    // Filter by status
    if (status) {
      filteredJobs = filteredJobs.filter((job) => job.status === status);
    }

    // Filter by department
    if (department) {
      filteredJobs = filteredJobs.filter((job) => 
        job.department.toLowerCase().includes((department as string).toLowerCase())
      );
    }

    // Filter by location
    if (location) {
      filteredJobs = filteredJobs.filter((job) => 
        job.location.toLowerCase().includes((location as string).toLowerCase())
      );
    }

    // Filter by type
    if (type) {
      filteredJobs = filteredJobs.filter((job) => job.type === type);
    }

    // Sort by posted date (newest first)
    filteredJobs.sort(
      (a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
    );

    // Apply limit if specified
    if (limit && !isNaN(Number(limit))) {
      filteredJobs = filteredJobs.slice(0, Number(limit));
    }

    res.json({
      success: true,
      data: filteredJobs,
      total: filteredJobs.length,
    });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch job postings",
    });
  }
};

// Get single job posting by ID
export const getJobById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const job = jobPostings.find((j) => j.id === id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job posting not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job posting:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch job posting",
    });
  }
};

// Create new job posting
export const createJob: RequestHandler = (req, res) => {
  try {
    const {
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      benefits,
      salary_range,
      experience_level,
      skills_required,
      status,
      posted_date,
      application_deadline,
    } = req.body;

    // Validate required fields
    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, department, location, type, description",
      });
    }

    const newJob: JobPosting = {
      id: Date.now().toString(),
      title,
      department,
      location,
      type,
      description,
      requirements: requirements || "",
      responsibilities: responsibilities || "",
      benefits: benefits || "",
      salary_range,
      experience_level: experience_level || "",
      skills_required: skills_required || [],
      status: status || "active",
      posted_date: posted_date || new Date().toISOString().split("T")[0],
      application_deadline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    jobPostings.push(newJob);

    res.status(201).json({
      success: true,
      data: newJob,
    });
  } catch (error) {
    console.error("Error creating job posting:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create job posting",
    });
  }
};

// Update existing job posting
export const updateJob: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const jobIndex = jobPostings.findIndex((j) => j.id === id);

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Job posting not found",
      });
    }

    const {
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      benefits,
      salary_range,
      experience_level,
      skills_required,
      status,
      posted_date,
      application_deadline,
    } = req.body;

    // Validate required fields
    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, department, location, type, description",
      });
    }

    const updatedJob: JobPosting = {
      ...jobPostings[jobIndex],
      title,
      department,
      location,
      type,
      description,
      requirements: requirements || "",
      responsibilities: responsibilities || "",
      benefits: benefits || "",
      salary_range,
      experience_level: experience_level || "",
      skills_required: skills_required || [],
      status: status !== undefined ? status : jobPostings[jobIndex].status,
      posted_date: posted_date || jobPostings[jobIndex].posted_date,
      application_deadline,
      updated_at: new Date().toISOString(),
    };

    jobPostings[jobIndex] = updatedJob;

    res.json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job posting:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update job posting",
    });
  }
};

// Delete job posting
export const deleteJob: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const jobIndex = jobPostings.findIndex((j) => j.id === id);

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Job posting not found",
      });
    }

    const deletedJob = jobPostings.splice(jobIndex, 1)[0];

    res.json({
      success: true,
      data: deletedJob,
    });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete job posting",
    });
  }
};

// Update job status
export const updateJobStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["active", "inactive", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'active', 'inactive', or 'closed'",
      });
    }

    const jobIndex = jobPostings.findIndex((j) => j.id === id);

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Job posting not found",
      });
    }

    jobPostings[jobIndex] = {
      ...jobPostings[jobIndex],
      status,
      updated_at: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: jobPostings[jobIndex],
    });
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update job status",
    });
  }
};

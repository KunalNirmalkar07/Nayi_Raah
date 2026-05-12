import { 
  Cpu, 
  Brain, 
  HeartPulse, 
  Wrench, 
  Building, 
  Scale, 
  TrendingUp, 
  Users, 
  Palette, 
  FileText, 
  Heart, 
  Briefcase, 
  Compass, 
  BookOpen, 
  Lightbulb, 
  Target,
  Sprout,
  LucideIcon
} from "lucide-react";

export interface CareerPath {
  id: string;
  name: string;
  stream: string;
  description: string;
  matchScore: number;
  requiredExams: string[];
  topColleges: { name: string; location: string }[];
  skills: string[];
  icon: LucideIcon;
  traits: {
    analytical: number;
    creative: number;
    social: number;
    practical: number;
  };
  timeline: {
    phase: string;
    title: string;
    duration: string;
    tasks: string[];
  }[];
}

export const careerPathsData: Record<string, CareerPath> = {
  "software-engineer": {
    id: "software-engineer",
    name: "Software Engineer",
    stream: "Science",
    description: "Design and develop software applications, websites, and systems",
    matchScore: 0,
    icon: Cpu,
    traits: { analytical: 4, creative: 3, social: 2, practical: 3 },
    requiredExams: ["JEE Main", "JEE Advanced", "State CETs"],
    topColleges: [
      { name: "IIT Bombay", location: "Mumbai" },
      { name: "IIT Delhi", location: "New Delhi" },
      { name: "IIT Madras", location: "Chennai" },
      { name: "NIT Trichy", location: "Tiruchirappalli" },
      { name: "BIT Durg", location: "Durg, Chhattisgarh" },
    ],
    skills: ["Programming", "Problem Solving", "Data Structures", "Algorithms"],
    timeline: [
      {
        phase: "1",
        title: "Board Exam & JEE Preparation",
        duration: "Class 11-12 (2 years)",
        tasks: [
          "Master Physics, Chemistry, Mathematics",
          "Join JEE coaching or self-study",
          "Practice previous year papers",
          "Score 85%+ in board exams",
        ],
      },
      {
        phase: "2",
        title: "B.Tech Computer Science",
        duration: "4 Years",
        tasks: [
          "Focus on programming fundamentals",
          "Learn Data Structures & Algorithms",
          "Build personal projects",
          "Participate in hackathons",
        ],
      },
      {
        phase: "3",
        title: "Internships & Skill Building",
        duration: "During B.Tech (2nd-4th year)",
        tasks: [
          "Complete 2-3 internships",
          "Contribute to open source",
          "Learn web/mobile development",
          "Prepare for placements",
        ],
      },
      {
        phase: "4",
        title: "Campus Placement",
        duration: "Final Year",
        tasks: [
          "Apply to product companies",
          "Clear coding interviews",
          "Negotiate salary packages",
          "Start your tech career!",
        ],
      },
    ],
  },
  "doctor": {
    id: "doctor",
    name: "Doctor (MBBS)",
    stream: "Science",
    description: "Diagnose and treat patients, become a medical professional",
    matchScore: 0,
    icon: HeartPulse,
    traits: { analytical: 4, creative: 2, social: 4, practical: 4 },
    requiredExams: ["NEET UG", "AIIMS", "JIPMER"],
    topColleges: [
      { name: "AIIMS Delhi", location: "New Delhi" },
      { name: "CMC Vellore", location: "Tamil Nadu" },
      { name: "JIPMER", location: "Puducherry" },
    ],
    skills: ["Biology", "Patient Care", "Critical Thinking", "Communication"],
    timeline: [
      {
        phase: "1",
        title: "NEET Preparation",
        duration: "Class 11-12 (2 years)",
        tasks: [
          "Master Biology, Chemistry, Physics",
          "Join NEET coaching",
          "Solve NCERT thoroughly",
          "Target 650+ in NEET",
        ],
      },
      {
        phase: "2",
        title: "MBBS Degree",
        duration: "5.5 Years",
        tasks: [
          "Complete pre-clinical subjects",
          "Clinical rotations in hospitals",
          "Internship training",
          "Prepare for NEXT exam",
        ],
      },
      {
        phase: "3",
        title: "Specialization (MD/MS)",
        duration: "3 Years",
        tasks: [
          "Choose specialization field",
          "Clear NEET PG exam",
          "Complete residency",
          "Gain expertise in chosen field",
        ],
      },
    ],
  },
  "chartered-accountant": {
    id: "chartered-accountant",
    name: "Chartered Accountant",
    stream: "Commerce",
    description: "Financial expert handling audits, taxation, and business advisory",
    matchScore: 0,
    icon: Scale,
    traits: { analytical: 5, creative: 1, social: 3, practical: 3 },
    requiredExams: ["CA Foundation", "CA Intermediate", "CA Final"],
    topColleges: [
      { name: "ICAI", location: "Pan India" },
      { name: "SRCC Delhi", location: "New Delhi" },
      { name: "Loyola College", location: "Chennai" },
    ],
    skills: ["Accounting", "Taxation", "Auditing", "Financial Analysis"],
    timeline: [
      {
        phase: "1",
        title: "CA Foundation",
        duration: "After Class 12 (4 months)",
        tasks: [
          "Register with ICAI",
          "Complete foundation course",
          "Clear all 4 papers",
          "Score 40%+ in each subject",
        ],
      },
      {
        phase: "2",
        title: "CA Intermediate + Articleship",
        duration: "2.5-3 Years",
        tasks: [
          "Clear both groups of Intermediate",
          "Start 3-year articleship",
          "Gain practical experience",
          "Learn taxation & auditing",
        ],
      },
      {
        phase: "3",
        title: "CA Final",
        duration: "1 Year",
        tasks: [
          "Prepare for Final exams",
          "Complete articleship",
          "Clear both groups",
          "Become a qualified CA!",
        ],
      },
    ],
  },
  "civil-services": {
    id: "civil-services",
    name: "Civil Services (IAS/IPS)",
    stream: "Any",
    description: "Administrative officer serving the nation through governance",
    matchScore: 0,
    icon: Briefcase,
    traits: { analytical: 4, creative: 2, social: 5, practical: 3 },
    requiredExams: ["UPSC CSE Prelims", "UPSC CSE Mains", "Interview"],
    topColleges: [
      { name: "Any Graduation", location: "Any recognized university" },
      { name: "Delhi University", location: "New Delhi" },
      { name: "JNU", location: "New Delhi" },
    ],
    skills: ["Current Affairs", "Analytical Skills", "Ethics", "Communication"],
    timeline: [
      {
        phase: "1",
        title: "Graduation",
        duration: "3-4 Years",
        tasks: [
          "Complete any bachelor's degree",
          "Build strong foundation in subjects",
          "Stay updated with current affairs",
          "Start basic UPSC preparation",
        ],
      },
      {
        phase: "2",
        title: "UPSC Preparation",
        duration: "2-3 Years",
        tasks: [
          "Clear Prelims exam",
          "Prepare for Mains (7 papers)",
          "Select optional subject wisely",
          "Practice answer writing",
        ],
      },
      {
        phase: "3",
        title: "Interview & Training",
        duration: "1 Year",
        tasks: [
          "Clear personality test",
          "Join LBSNAA for training",
          "Complete district training",
          "Start your service career!",
        ],
      },
    ],
  },
  "architect": {
    id: "architect",
    name: "Architect",
    stream: "Science",
    description: "Design buildings and spaces that are functional and beautiful",
    matchScore: 0,
    icon: Building,
    traits: { analytical: 3, creative: 5, social: 2, practical: 4 },
    requiredExams: ["NATA", "JEE Main Paper 2"],
    topColleges: [
      { name: "SPA Delhi", location: "New Delhi" },
      { name: "IIT Roorkee", location: "Roorkee" },
      { name: "CEPT Ahmedabad", location: "Gujarat" },
    ],
    skills: ["Design", "Creativity", "Technical Drawing", "3D Modeling"],
    timeline: [
      {
        phase: "1",
        title: "NATA/JEE Paper 2 Prep",
        duration: "Class 11-12",
        tasks: [
          "Develop drawing skills",
          "Practice sketching daily",
          "Study Mathematics & Physics",
          "Clear NATA with 120+ score",
        ],
      },
      {
        phase: "2",
        title: "B.Arch Degree",
        duration: "5 Years",
        tasks: [
          "Learn design principles",
          "Master AutoCAD, SketchUp, Revit",
          "Complete design projects",
          "Internship with architecture firms",
        ],
      },
    ],
  },
  "journalist": {
    id: "journalist",
    name: "Journalist",
    stream: "Arts",
    description: "Report news, create content, and shape public discourse",
    matchScore: 0,
    icon: FileText,
    traits: { analytical: 3, creative: 4, social: 4, practical: 2 },
    requiredExams: ["IIMC Entrance", "JMI Mass Communication", "University Entrance"],
    topColleges: [
      { name: "IIMC", location: "New Delhi" },
      { name: "Jamia Millia Islamia", location: "New Delhi" },
      { name: "ACJ Chennai", location: "Chennai" },
    ],
    skills: ["Writing", "Communication", "Research", "Critical Thinking"],
    timeline: [
      {
        phase: "1",
        title: "Bachelor's in Mass Communication",
        duration: "3 Years",
        tasks: [
          "Study journalism fundamentals",
          "Learn multimedia production",
          "Write for college publications",
          "Build a portfolio",
        ],
      },
      {
        phase: "2",
        title: "Internships & Experience",
        duration: "During & After Degree",
        tasks: [
          "Intern with news organizations",
          "Start a blog or YouTube channel",
          "Network with industry professionals",
          "Apply for entry-level positions",
        ],
      },
    ],
  },
  "defence-officer": {
    id: "defence-officer",
    name: "Defence Officer",
    stream: "Any",
    description: "Serve the nation through armed forces — Army, Navy, or Air Force",
    matchScore: 0,
    icon: Target,
    traits: { analytical: 3, creative: 1, social: 3, practical: 5 },
    requiredExams: ["NDA", "CDS", "AFCAT", "Indian Navy SSR"],
    topColleges: [
      { name: "National Defence Academy", location: "Pune" },
      { name: "Indian Military Academy", location: "Dehradun" },
      { name: "Indian Naval Academy", location: "Ezhimala, Kerala" },
    ],
    skills: ["Physical Fitness", "Leadership", "Discipline", "Quick Decision Making"],
    timeline: [
      {
        phase: "1",
        title: "NDA/CDS Preparation",
        duration: "Class 11-12 or After Graduation",
        tasks: [
          "Prepare for NDA after 12th or CDS after graduation",
          "Focus on Mathematics & General Ability",
          "Maintain physical fitness — running, exercises",
          "Clear the written exam & SSB interview",
        ],
      },
      {
        phase: "2",
        title: "Training at Academy",
        duration: "3-4 Years (NDA) / 1 Year (CDS)",
        tasks: [
          "Complete rigorous military training",
          "Specialize in Army/Navy/Air Force",
          "Develop leadership & combat skills",
          "Graduate as a commissioned officer",
        ],
      },
    ],
  },
  "designer": {
    id: "designer",
    name: "Designer (UX/Fashion)",
    stream: "Arts",
    description: "Create innovative designs in fashion, products, or digital experiences",
    matchScore: 0,
    icon: Palette,
    traits: { analytical: 2, creative: 5, social: 3, practical: 3 },
    requiredExams: ["NID Entrance", "NIFT Entrance", "UCEED", "CEED"],
    topColleges: [
      { name: "NID Ahmedabad", location: "Ahmedabad" },
      { name: "NIFT Delhi", location: "New Delhi" },
      { name: "IIT Bombay (IDC)", location: "Mumbai" },
    ],
    skills: ["Creativity", "Visual Thinking", "Sketching", "Software Tools"],
    timeline: [
      {
        phase: "1",
        title: "NID/NIFT Preparation",
        duration: "Class 11-12",
        tasks: [
          "Build a strong design portfolio",
          "Practice sketching & creative thinking",
          "Study for NID/NIFT entrance exams",
          "Learn basics of design software",
        ],
      },
      {
        phase: "2",
        title: "Design Degree",
        duration: "4 Years",
        tasks: [
          "Complete B.Des in chosen specialization",
          "Build real-world projects & internships",
          "Master tools like Figma, Adobe Suite",
          "Participate in design competitions",
        ],
      },
    ],
  },
  "agriculture-scientist": {
    id: "agriculture-scientist",
    name: "Agriculture Scientist",
    stream: "Science",
    description: "Research and develop solutions for farming, food security, or animal health",
    matchScore: 0,
    icon: Sprout, // Wait, Sprout is not in my imports. I'll use Wrench or something else if needed, but Sprout is standard.
    traits: { analytical: 4, creative: 3, social: 1, practical: 4 }, // Based on logic in hook
    requiredExams: ["ICAR AIEEA", "State Agriculture CET", "NEET (Veterinary)"],
    topColleges: [
      { name: "IARI New Delhi", location: "New Delhi" },
      { name: "TNAU Coimbatore", location: "Tamil Nadu" },
      { name: "PAU Ludhiana", location: "Punjab" },
    ],
    skills: ["Biology", "Research", "Field Work", "Environmental Science"],
    timeline: [
      {
        phase: "1",
        title: "Entrance Exam Preparation",
        duration: "Class 11-12",
        tasks: [
          "Focus on Biology, Chemistry, Physics",
          "Prepare for ICAR AIEEA or state exams",
          "Visit farms and understand agriculture",
          "Score well in board exams",
        ],
      },
      {
        phase: "2",
        title: "B.Sc Agriculture / B.V.Sc",
        duration: "4-5 Years",
        tasks: [
          "Complete undergraduate degree",
          "Gain field experience through internships",
          "Specialize in crop science, soil science, or veterinary",
          "Pursue M.Sc or PhD for research careers",
        ],
      },
    ],
  },
  "pharmacist": {
    id: "pharmacist",
    name: "Pharmacist",
    stream: "Science",
    description: "Develop, dispense, and research medicines for better healthcare",
    matchScore: 0,
    icon: HeartPulse,
    traits: { analytical: 4, creative: 1, social: 3, practical: 4 },
    requiredExams: ["NEET", "State Pharmacy CET", "GPAT"],
    topColleges: [
      { name: "NIPER Mohali", location: "Punjab" },
      { name: "Jamia Hamdard", location: "New Delhi" },
      { name: "Manipal College of Pharmacy", location: "Karnataka" },
    ],
    skills: ["Chemistry", "Biology", "Patient Care", "Research"],
    timeline: [
      {
        phase: "1",
        title: "Entrance & Board Preparation",
        duration: "Class 11-12",
        tasks: [
          "Focus on PCB/PCM subjects",
          "Prepare for pharmacy entrance exams",
          "Score well in board exams",
          "Research pharmacy vs nursing vs allied health",
        ],
      },
      {
        phase: "2",
        title: "B.Pharm / D.Pharm",
        duration: "4 Years (B.Pharm) / 2 Years (D.Pharm)",
        tasks: [
          "Complete pharmacy degree",
          "Hospital/clinical pharmacy internship",
          "Prepare for GPAT for M.Pharm",
          "Explore industry or research roles",
        ],
      },
    ],
  },
  "lawyer": {
    id: "lawyer",
    name: "Lawyer",
    stream: "Arts",
    description: "Practice law, defend clients, and uphold justice in courts or corporate firms",
    matchScore: 0,
    icon: Scale,
    traits: { analytical: 4, creative: 2, social: 4, practical: 2 },
    requiredExams: ["CLAT", "AILET", "LSAT India", "State Law CET"],
    topColleges: [
      { name: "NLSIU Bangalore", location: "Bangalore" },
      { name: "NALSAR Hyderabad", location: "Hyderabad" },
      { name: "NLU Delhi", location: "New Delhi" },
      { name: "NUJS Kolkata", location: "Kolkata" },
    ],
    skills: ["Argumentation", "Legal Research", "Critical Thinking", "Communication"],
    timeline: [
      {
        phase: "1",
        title: "CLAT / Law Entrance Preparation",
        duration: "Class 11-12",
        tasks: [
          "Study English, GK, Legal Reasoning, Logical Reasoning, Maths",
          "Practice CLAT mock tests regularly",
          "Read newspapers daily for current affairs",
          "Score well in board exams",
        ],
      },
      {
        phase: "2",
        title: "BA LLB / BBA LLB Degree",
        duration: "5 Years (Integrated)",
        tasks: [
          "Study constitutional, criminal, and civil law",
          "Participate in moot courts & debates",
          "Intern with law firms or courts",
          "Specialize in corporate, criminal, or IP law",
        ],
      },
      {
        phase: "3",
        title: "Bar Council & Practice",
        duration: "1-2 Years",
        tasks: [
          "Clear All India Bar Examination (AIBE)",
          "Join a law firm or start independent practice",
          "Consider judicial services or corporate law",
          "Build a client base and reputation",
        ],
      },
    ],
  },
  "data-scientist": {
    id: "data-scientist",
    name: "Data Scientist",
    stream: "Science",
    description: "Analyze data and build AI/ML models to solve complex business problems",
    matchScore: 0,
    icon: Brain,
    traits: { analytical: 5, creative: 2, social: 1, practical: 3 },
    requiredExams: ["JEE Main", "GATE", "University Entrance"],
    topColleges: [
      { name: "IIT Madras", location: "Chennai" },
      { name: "IISc Bangalore", location: "Bangalore" },
      { name: "IIT Hyderabad", location: "Hyderabad" },
      { name: "ISI Kolkata", location: "Kolkata" },
    ],
    skills: ["Statistics", "Python/R Programming", "Machine Learning", "Data Visualization"],
    timeline: [
      {
        phase: "1",
        title: "Strong Foundation in Maths & CS",
        duration: "Class 11-12",
        tasks: [
          "Excel in Mathematics and Computer Science",
          "Learn basics of Python programming",
          "Prepare for JEE or university entrance exams",
          "Explore online courses on data science basics",
        ],
      },
      {
        phase: "2",
        title: "B.Tech / B.Sc in CS / Statistics",
        duration: "3-4 Years",
        tasks: [
          "Study statistics, linear algebra, and probability",
          "Learn Python, R, SQL in depth",
          "Complete Kaggle competitions and projects",
          "Intern at data-driven companies",
        ],
      },
      {
        phase: "3",
        title: "Specialization & Career",
        duration: "1-2 Years",
        tasks: [
          "Pursue M.Tech/MS in AI/ML or Data Science",
          "Build a strong portfolio of ML projects",
          "Clear GATE for PSU or M.Tech admissions",
          "Apply for data scientist roles at top companies",
        ],
      },
    ],
  },
  "hotel-management": {
    id: "hotel-management",
    name: "Hotel Management",
    stream: "Any",
    description: "Manage hotels, restaurants, and tourism operations with world-class service",
    matchScore: 0,
    icon: Building,
    traits: { analytical: 2, creative: 3, social: 5, practical: 4 },
    requiredExams: ["NCHMCT JEE", "State Hotel Management CET", "IIHM eCHAT"],
    topColleges: [
      { name: "IHM Mumbai", location: "Mumbai" },
      { name: "IHM Delhi (Pusa)", location: "New Delhi" },
      { name: "WGSHA Manipal", location: "Karnataka" },
      { name: "IHM Chennai", location: "Chennai" },
    ],
    skills: ["Hospitality", "Communication", "Management", "Culinary Arts"],
    timeline: [
      {
        phase: "1",
        title: "NCHMCT JEE Preparation",
        duration: "Class 12",
        tasks: [
          "Prepare for NCHMCT JEE entrance exam",
          "Study English, GK, Reasoning, Aptitude",
          "Research hotel management career options",
          "Score well in Class 12 boards",
        ],
      },
      {
        phase: "2",
        title: "B.Sc in Hospitality / Hotel Management",
        duration: "3-4 Years",
        tasks: [
          "Learn food production, F&B service, housekeeping",
          "Complete industrial training at hotels",
          "Develop communication and management skills",
          "Explore specializations: culinary, events, tourism",
        ],
      },
    ],
  },
  "teacher": {
    id: "teacher",
    name: "Teacher",
    stream: "Any",
    description: "Shape future generations through teaching, training, and educational leadership",
    matchScore: 0,
    icon: BookOpen,
    traits: { analytical: 3, creative: 3, social: 5, practical: 2 },
    requiredExams: ["CTET", "State TET", "UGC NET", "B.Ed Entrance"],
    topColleges: [
      { name: "NCERT", location: "New Delhi" },
      { name: "Jamia Millia Islamia", location: "New Delhi" },
      { name: "Lady Shri Ram College", location: "New Delhi" },
      { name: "TISS Mumbai", location: "Mumbai" },
    ],
    skills: ["Communication", "Patience", "Subject Expertise", "Classroom Management"],
    timeline: [
      {
        phase: "1",
        title: "Bachelor's Degree",
        duration: "3-4 Years",
        tasks: [
          "Complete graduation in your chosen subject",
          "Maintain strong academic record",
          "Volunteer as a tutor to gain experience",
          "Decide on school teaching vs college teaching",
        ],
      },
      {
        phase: "2",
        title: "B.Ed / M.Ed",
        duration: "2 Years",
        tasks: [
          "Clear B.Ed entrance exam",
          "Complete Bachelor of Education degree",
          "Practice teaching in schools",
          "Clear CTET or State TET for government jobs",
        ],
      },
      {
        phase: "3",
        title: "Career & Higher Studies",
        duration: "1-2 Years",
        tasks: [
          "Apply for school teaching positions",
          "Clear UGC NET for college-level teaching",
          "Pursue M.Ed or PhD for academic leadership",
          "Explore EdTech opportunities",
        ],
      },
    ],
  },
  "psychologist": {
    id: "psychologist",
    name: "Psychologist",
    stream: "Arts",
    description: "Help people with mental health, behavior, and emotional well-being",
    matchScore: 0,
    icon: Heart,
    traits: { analytical: 3, creative: 3, social: 5, practical: 2 },
    requiredExams: ["CUET", "University Entrance", "RCI Registration"],
    topColleges: [
      { name: "Delhi University", location: "New Delhi" },
      { name: "Christ University", location: "Bangalore" },
      { name: "TISS Mumbai", location: "Mumbai" },
      { name: "Ambedkar University", location: "New Delhi" },
    ],
    skills: ["Empathy", "Active Listening", "Research", "Counseling Techniques"],
    timeline: [
      {
        phase: "1",
        title: "BA / B.Sc in Psychology",
        duration: "3 Years",
        tasks: [
          "Study psychology fundamentals",
          "Learn research methodology and statistics",
          "Complete practical training and case studies",
          "Volunteer at counseling centers or NGOs",
        ],
      },
      {
        phase: "2",
        title: "MA / M.Sc in Psychology",
        duration: "2 Years",
        tasks: [
          "Specialize in clinical, counseling, or organizational psychology",
          "Complete supervised clinical hours",
          "Pursue internship at hospitals or clinics",
          "Register with RCI for clinical practice",
        ],
      },
      {
        phase: "3",
        title: "Professional Practice",
        duration: "Ongoing",
        tasks: [
          "Start private practice or join a hospital",
          "Get certified in specialized therapies (CBT, DBT)",
          "Pursue MPhil/PhD for advanced specialization",
          "Build a professional network",
        ],
      },
    ],
  },
  "pilot": {
    id: "pilot",
    name: "Pilot",
    stream: "Science",
    description: "Fly commercial or private aircraft, or work in aviation management",
    matchScore: 0,
    icon: Compass,
    traits: { analytical: 3, creative: 1, social: 2, practical: 5 },
    requiredExams: ["DGCA CPL Exams", "IGRUA Entrance", "Airline Selection Tests"],
    topColleges: [
      { name: "IGRUA Rae Bareli", location: "Uttar Pradesh" },
      { name: "Indira Gandhi Rashtriya Uran Akademi", location: "Rae Bareli" },
      { name: "Rajiv Gandhi Academy", location: "Hyderabad" },
      { name: "Bombay Flying Club", location: "Mumbai" },
    ],
    skills: ["Physics", "Mathematics", "Quick Decision Making", "Communication"],
    timeline: [
      {
        phase: "1",
        title: "Class 12 Science + Medical Fitness",
        duration: "Class 11-12",
        tasks: [
          "Study Physics and Mathematics thoroughly",
          "Get Class 2 medical certificate from DGCA",
          "Score 50%+ in Class 12 with PCM",
          "Research flying schools and costs",
        ],
      },
      {
        phase: "2",
        title: "Commercial Pilot License (CPL)",
        duration: "2-3 Years",
        tasks: [
          "Enroll in a DGCA-approved flying school",
          "Complete 200+ flying hours",
          "Clear all DGCA CPL examinations",
          "Get instrument rating and multi-engine rating",
        ],
      },
      {
        phase: "3",
        title: "Airline Career",
        duration: "1-2 Years",
        tasks: [
          "Apply to airlines as First Officer",
          "Complete airline type-rating training",
          "Build flying hours for promotion to Captain",
          "Maintain medical fitness and license renewal",
        ],
      },
    ],
  },
  "entrepreneur": {
    id: "entrepreneur",
    name: "Entrepreneur",
    stream: "Any",
    description: "Build your own business, innovate, and create jobs for others",
    matchScore: 0,
    icon: Lightbulb,
    traits: { analytical: 3, creative: 4, social: 4, practical: 4 },
    requiredExams: ["CAT (optional)", "University Entrance", "No mandatory exam"],
    topColleges: [
      { name: "IIM Ahmedabad", location: "Ahmedabad" },
      { name: "IIM Bangalore", location: "Bangalore" },
      { name: "ISB Hyderabad", location: "Hyderabad" },
      { name: "BITS Pilani", location: "Pilani" },
    ],
    skills: ["Leadership", "Problem Solving", "Financial Planning", "Marketing"],
    timeline: [
      {
        phase: "1",
        title: "Education & Skill Building",
        duration: "3-4 Years",
        tasks: [
          "Complete graduation in any field",
          "Learn business fundamentals and marketing",
          "Build technical or domain expertise",
          "Start small projects or freelancing",
        ],
      },
      {
        phase: "2",
        title: "Ideation & MVP",
        duration: "6 Months - 1 Year",
        tasks: [
          "Identify a real problem to solve",
          "Build a Minimum Viable Product (MVP)",
          "Talk to potential customers for feedback",
          "Apply to incubators or accelerators",
        ],
      },
      {
        phase: "3",
        title: "Launch & Scale",
        duration: "2-3 Years",
        tasks: [
          "Register company and build a team",
          "Seek funding from investors or government schemes",
          "Scale operations and revenue",
          "Explore Startup India, MSME schemes, and grants",
        ],
      },
    ],
  },
};

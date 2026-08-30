import { RCIConfig } from "@/lib/config";
import {
  SiteSettings,
  DirectorProfile,
  HomepageSettings,
  AnnouncementSettings,
  AboutSection,
  HomepageFeature,
  HomepageStat,
  ContactSettings,
  SocialLink,
  NavigationLink,
  SeoSettings,
} from "@/types/cms";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default",
  site_name: RCIConfig.instituteName,
  short_name: RCIConfig.shortName,
  tagline: RCIConfig.tagline,
  logo_url: "/logo.png",
  favicon_url: "/favicon.png",
  primary_color: "#07152F",
  secondary_color: "#155EEF",
  accent_color: "#D4A72C",
  browser_title: `${RCIConfig.instituteName} | Practical IT & Computer Education`,
};

export const DEFAULT_DIRECTOR_PROFILE: DirectorProfile = {
  id: "default",
  name: RCIConfig.directorName,
  photo_url: null,
  designation: RCIConfig.directorTitle,
  message:
    "At Rohit Computer Institute, our goal is to bridge the gap between theoretical knowledge and practical industry skills. We empower our students with hands-on lab training, experienced mentorship, and government/MSME recognized certifications to launch successful digital careers.",
  signature_url: null,
  established_year: "2010",
};

export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  id: "default",
  hero_badge: "Trusted Computer Education",
  hero_title: "Build Your Digital Future",
  hero_highlight: "With Practical IT Skills",
  hero_description:
    "Master modern computer applications, Tally Prime accounting, web development, and programming with hands-on lab training and QR-verifiable certificates.",
  hero_image_url: null,
  hero_bg_url: null,
  primary_cta_text: "Explore Courses",
  primary_cta_url: "/courses",
  secondary_cta_text: "Student Login",
  secondary_cta_url: "/student/login",
};

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
  id: "default",
  is_enabled: true,
  message: "Admissions Open for New Batches 2026! Enroll today for DCA, ADCA & Tally Prime.",
  link_text: "Apply Now",
  link_url: "/admission",
  start_at: null,
  end_at: null,
};

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  id: "default",
  phone: RCIConfig.phoneFormatted,
  whatsapp: RCIConfig.whatsappNumber,
  email: RCIConfig.email,
  address: RCIConfig.address,
  maps_url: RCIConfig.mapsUrl,
  office_hours: "Mon - Sat: 8:00 AM - 7:00 PM",
};

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  id: "default",
  site_title: `${RCIConfig.instituteName} | Practical IT & Computer Education`,
  meta_description:
    "Rohit Computer Institute (RCI) provides practical computer training, DCA diploma, Tally Prime accounting, Web Development, Python, and QR-verifiable certificates.",
  keywords:
    "Rohit Computer Institute, RCI Kanpur, Computer Institute Kanpur, DCA Course, Tally Prime GST Course, Web Development Training, Certificate Verification RCI",
  og_title: `${RCIConfig.instituteName} | Practical IT & Computer Education`,
  og_description:
    "Build career-oriented computer skills with expert faculty, modern labs, and verifiable certificates.",
  og_image_url: "/banner.png",
  twitter_title: `${RCIConfig.instituteName} | Practical IT Education`,
  twitter_description:
    "Build skills and build your career with RCI computer courses and verifiable certifications.",
  twitter_image_url: "/banner.png",
  canonical_url: RCIConfig.siteUrl,
};

export const DEFAULT_ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "default-about",
    section_key: "about_rci",
    heading: "About Rohit Computer Institute",
    short_description: "Empowering Kanpur youth with practical tech education since 2010.",
    content:
      "Rohit Computer Institute (RCI) is a premier computer training institute dedicated to offering practical, industry-aligned IT education. With state-of-the-art computer labs, experienced faculty, and comprehensive curriculum, we prepare students for real-world job opportunities.",
    image_url: null,
    is_active: true,
  },
  {
    id: "default-mission",
    section_key: "mission",
    heading: "Our Mission",
    short_description: "Quality computer education accessible to everyone.",
    content:
      "To empower every student with practical, job-oriented computer skills and industry certifications that open doors to rewarding career opportunities.",
    image_url: null,
    is_active: true,
  },
  {
    id: "default-vision",
    section_key: "vision",
    heading: "Our Vision",
    short_description: "Leading digital skill development in Uttar Pradesh.",
    content:
      "To be the most trusted and innovative computer education institute in the region, known for practical training, student success, and technological excellence.",
    image_url: null,
    is_active: true,
  },
];

export const DEFAULT_FEATURES: HomepageFeature[] = [
  {
    id: "f1",
    title: "Experienced Faculty",
    description: "Learn directly from certified IT professionals with years of teaching experience.",
    icon: "Users",
    display_order: 1,
    is_active: true,
  },
  {
    id: "f2",
    title: "Practical Lab Training",
    description: "1:1 computer access with hands-on practice sessions for every topic.",
    icon: "Laptop",
    display_order: 2,
    is_active: true,
  },
  {
    id: "f3",
    title: "Affordable Fee Structure",
    description: "High quality education with flexible installment options.",
    icon: "BadgeCheck",
    display_order: 3,
    is_active: true,
  },
  {
    id: "f4",
    title: "Recognized Certificates",
    description: "MSME & Government registered certificates with instant QR verification.",
    icon: "Award",
    display_order: 4,
    is_active: true,
  },
  {
    id: "f5",
    title: "Career Guidance & Placement",
    description: "Resume building, mock interviews, and job placement assistance.",
    icon: "Briefcase",
    display_order: 5,
    is_active: true,
  },
  {
    id: "f6",
    title: "Modern Lab Infrastructure",
    description: "High-speed internet, latest software, and comfortable learning environment.",
    icon: "Server",
    display_order: 6,
    is_active: true,
  },
];

export const DEFAULT_STATS: HomepageStat[] = [
  { id: "s1", label: "Students Trained", value: "5000+", icon: "Users", display_order: 1, is_active: true },
  { id: "s2", label: "Courses Offered", value: "15+", icon: "BookOpen", display_order: 2, is_active: true },
  { id: "s3", label: "Certificates Issued", value: "4500+", icon: "Award", display_order: 3, is_active: true },
  { id: "s4", label: "Years of Experience", value: "14+", icon: "Clock", display_order: 4, is_active: true },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: "soc-1", platform: "Facebook", url: "https://facebook.com", is_active: true, display_order: 1 },
  { id: "soc-2", platform: "Instagram", url: "https://instagram.com", is_active: true, display_order: 2 },
  { id: "soc-3", platform: "YouTube", url: "https://youtube.com", is_active: true, display_order: 3 },
  { id: "soc-4", platform: "WhatsApp", url: RCIConfig.getWhatsAppUrl(), is_active: true, display_order: 4 },
];

export const DEFAULT_NAV_LINKS: NavigationLink[] = [
  { id: "n1", location: "header", label: "Home", url: "/", open_new_tab: false, display_order: 1, is_active: true, is_system: false },
  { id: "n2", location: "header", label: "About", url: "/about", open_new_tab: false, display_order: 2, is_active: true, is_system: false },
  { id: "n3", location: "header", label: "Courses", url: "/courses", open_new_tab: false, display_order: 3, is_active: true, is_system: false },
  { id: "n4", location: "header", label: "Admissions", url: "/admission", open_new_tab: false, display_order: 4, is_active: true, is_system: false },
  { id: "n5", location: "header", label: "Verify Certificate", url: "/verify", open_new_tab: false, display_order: 5, is_active: true, is_system: true },
  { id: "n6", location: "header", label: "Contact", url: "/contact", open_new_tab: false, display_order: 6, is_active: true, is_system: false },
  { id: "nf1", location: "footer_quick", label: "Home", url: "/", open_new_tab: false, display_order: 1, is_active: true, is_system: false },
  { id: "nf2", location: "footer_quick", label: "About Us", url: "/about", open_new_tab: false, display_order: 2, is_active: true, is_system: false },
  { id: "nf3", location: "footer_quick", label: "Our Courses", url: "/courses", open_new_tab: false, display_order: 3, is_active: true, is_system: false },
  { id: "nf4", location: "footer_quick", label: "Admission Workflow", url: "/admission", open_new_tab: false, display_order: 4, is_active: true, is_system: false },
  { id: "nf5", location: "footer_quick", label: "Contact Us", url: "/contact", open_new_tab: false, display_order: 5, is_active: true, is_system: false },
  { id: "nu1", location: "footer_useful", label: "Verify Certificate", url: "/verify", open_new_tab: false, display_order: 1, is_active: true, is_system: true },
  { id: "nu2", location: "footer_useful", label: "Student Portal Login", url: "/student/login", open_new_tab: false, display_order: 2, is_active: true, is_system: true },
  { id: "nu3", location: "footer_useful", label: "Admin Control Panel", url: "/admin/login", open_new_tab: false, display_order: 3, is_active: true, is_system: true },
];

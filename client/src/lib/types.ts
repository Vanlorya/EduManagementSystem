// Import types from schema to extend and use in frontend components
import {
  User,
  Role,
  SportCategory,
  Instructor,
  Venue,
  Class,
  Schedule,
  Booking,
  Student,
  Payment,
  Promotion
} from "@shared/schema";

// Dashboard data types
export interface DashboardStats {
  totalStudents: number;
  activeClasses: number;
  totalRevenue: number;
  totalInstructors: number;
  studentGrowthPercent: number;
  newStudentsThisMonth: number;
}

export interface DashboardData {
  stats: DashboardStats;
  todayBookings: TodayBooking[];
  recentBookings: RecentBooking[];
  availableInstructors: AvailableInstructor[];
}

export interface TodayBooking {
  id: number;
  title: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  students: number;
  sportType: string;
  position: "start" | "middle" | "end";
  color: "blue" | "orange";
}

export interface RecentBooking {
  id: number;
  userId: number;
  status: "confirmed" | "pending_payment" | "new";
  user: {
    id: number;
    fullName: string;
  };
  class: {
    id: number;
    name: string;
    ageGroup: string;
  };
  schedule: {
    startTime: string;
  };
  sportCategory?: {
    id: number;
    name: string;
    color: string;
  };
}

export interface AvailableInstructor {
  id: number;
  userId: number;
  status: "available" | "unavailable" | "on_leave";
  leaveUntil?: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  sportCategory: {
    id: number;
    name: string;
  };
  classesTaught: {
    id: number;
    name: string;
    ageGroup?: string;
  }[];
  availability: string;
}

// Enhanced instructor type for frontend display
export interface InstructorWithDetails extends Instructor {
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  sportCategory: SportCategory;
  classesTaught: {
    id: number;
    name: string;
    ageGroup?: string;
  }[];
  availabilityFormatted?: string;
}

// Enhanced student type for frontend display
export interface StudentWithDetails extends Student {
  user: User;
  classes: {
    id: number;
    name: string;
    ageGroup?: string;
  }[];
  age?: number;
  status: "active" | "inactive";
}

// Enhanced payment type for frontend display
export interface PaymentWithDetails extends Payment {
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  booking?: {
    id: number;
    classId: number;
    class: {
      name: string;
      price: number;
    };
  };
  formattedAmount?: string;
  formattedDate?: string;
}

// Enhanced promotion type for frontend display
export interface PromotionWithDetails extends Promotion {
  sportCategory?: SportCategory;
  progress?: number;
  isExpired?: boolean;
}

// Message type for email and SMS management
export interface Message {
  id: number;
  type: "email" | "sms";
  subject: string;
  content: string;
  recipientCount: number;
  sentAt: string | null;
  status: "sent" | "scheduled" | "draft";
  category: "announcement" | "reminder" | "promotion" | "event";
}

// Report types
export interface RevenueData {
  month: string;
  amount: number;
}

export interface StudentData {
  month: string;
  count: number;
}

export interface SportCategoryData {
  name: string;
  students: number;
  percentage: number;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  roleId: number;
}

// Calendar types
export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  classId: number;
  instructorId: number;
  venueId?: number;
  bookings?: number;
  capacity: number;
}

export interface CalendarResource {
  id: string;
  title: string;
  type: "instructor" | "venue";
}

export interface BookingFormData {
  userId: number;
  classId: number;
  scheduleId: number;
  bookingDate: string;
}

// Settings types
export interface GeneralSettings {
  centerName: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingNotifications: boolean;
  paymentNotifications: boolean;
  reminderNotifications: boolean;
}

export interface UserSettings {
  defaultRole: string;
  registrationOpen: boolean;
  requireApproval: boolean;
}

export interface PaymentSettings {
  currency: string;
  momoEnabled: boolean;
  zaloPayEnabled: boolean;
  bankTransferEnabled: boolean;
  cashEnabled: boolean;
  bankAccount: string;
}

export interface LanguageSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
}

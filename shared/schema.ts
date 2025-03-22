import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // admin, instructor, staff, student
  permissions: jsonb("permissions").notNull().$type<string[]>(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  roleId: integer("role_id").notNull().references(() => roles.id),
  language: text("language").default("vi"),
  active: boolean("active").default(true),
});

// Sport categories
export const sportCategories = pgTable("sport_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#1E88E5"),
});

// Instructors table
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sportCategoryId: integer("sport_category_id").references(() => sportCategories.id).notNull(),
  bio: text("bio"),
  specialties: text("specialties").array(),
  yearsExperience: integer("years_experience"),
  availability: jsonb("availability").notNull().$type<string[]>(), // ["MON", "TUE", "WED", "THU", "FRI"]
  status: text("status").notNull().default("available"), // available, unavailable, on_leave
  leaveUntil: date("leave_until"),
});

// Venues/facilities
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  capacity: integer("capacity"),
  available: boolean("available").default(true),
});

// Classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sportCategoryId: integer("sport_category_id").references(() => sportCategories.id).notNull(),
  description: text("description"),
  ageGroup: text("age_group"), // U10, U12, U15, etc.
  capacity: integer("capacity").notNull(),
  instructorId: integer("instructor_id").references(() => instructors.id).notNull(),
  venueId: integer("venue_id").references(() => venues.id),
  price: integer("price").notNull(), // in VND
  active: boolean("active").default(true),
});

// Class schedule
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  dayOfWeek: text("day_of_week").notNull(), // MON, TUE, WED, THU, FRI, SAT, SUN
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  recurring: boolean("recurring").default(true),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  scheduleId: integer("schedule_id").references(() => schedules.id).notNull(),
  bookingDate: date("booking_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Student profiles
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  parentName: text("parent_name"),
  parentEmail: text("parent_email"),
  parentPhone: text("parent_phone"),
  dateOfBirth: date("date_of_birth"),
  emergencyContact: text("emergency_contact"),
  medicalNotes: text("medical_notes"),
  membershipType: text("membership_type").default("standard"), // standard, premium, gold
  membershipExpiry: date("membership_expiry"),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id),
  amount: integer("amount").notNull(), // in VND
  paymentMethod: text("payment_method").notNull(), // credit_card, momo, zalopay, cash, bank_transfer
  status: text("status").notNull(), // pending, completed, failed, refunded
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Promotions and coupons
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountPercent: integer("discount_percent"),
  discountAmount: integer("discount_amount"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxUses: integer("max_uses"),
  useCount: integer("use_count").default(0),
  sportCategoryId: integer("sport_category_id").references(() => sportCategories.id),
  description: text("description"),
  active: boolean("active").default(true),
});

// Schema validation
export const insertRoleSchema = createInsertSchema(roles);
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSportCategorySchema = createInsertSchema(sportCategories).omit({ id: true });
export const insertInstructorSchema = createInsertSchema(instructors).omit({ id: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true });
export const insertScheduleSchema = createInsertSchema(schedules).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export const insertPromotionSchema = createInsertSchema(promotions).omit({ id: true });

// Types
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SportCategory = typeof sportCategories.$inferSelect;
export type InsertSportCategory = z.infer<typeof insertSportCategorySchema>;

export type Instructor = typeof instructors.$inferSelect;
export type InsertInstructor = z.infer<typeof insertInstructorSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;

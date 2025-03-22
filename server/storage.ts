import { 
  users, roles, sportCategories, instructors, venues, classes, schedules, 
  bookings, students, payments, promotions,
  type User, type InsertUser, type Role, type InsertRole, type SportCategory, 
  type InsertSportCategory, type Instructor, type InsertInstructor, 
  type Venue, type InsertVenue, type Class, type InsertClass, 
  type Schedule, type InsertSchedule, type Booking, type InsertBooking, 
  type Student, type InsertStudent, type Payment, type InsertPayment, 
  type Promotion, type InsertPromotion
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  listUsers(roleId?: number): Promise<User[]>;
  
  // Role operations
  getRole(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  listRoles(): Promise<Role[]>;
  
  // Sport Category operations
  getSportCategory(id: number): Promise<SportCategory | undefined>;
  createSportCategory(category: InsertSportCategory): Promise<SportCategory>;
  listSportCategories(): Promise<SportCategory[]>;
  
  // Instructor operations
  getInstructor(id: number): Promise<Instructor | undefined>;
  getInstructorByUserId(userId: number): Promise<Instructor | undefined>;
  createInstructor(instructor: InsertInstructor): Promise<Instructor>;
  updateInstructor(id: number, instructor: Partial<InsertInstructor>): Promise<Instructor>;
  listInstructors(sportCategoryId?: number): Promise<Instructor[]>;
  
  // Venue operations
  getVenue(id: number): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue>;
  listVenues(): Promise<Venue[]>;
  
  // Class operations
  getClass(id: number): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, classData: Partial<InsertClass>): Promise<Class>;
  listClasses(sportCategoryId?: number): Promise<Class[]>;
  
  // Schedule operations
  getSchedule(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule>;
  listSchedules(classId?: number): Promise<Schedule[]>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking>;
  listBookings(userId?: number, classId?: number, status?: string): Promise<Booking[]>;
  
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student>;
  listStudents(): Promise<Student[]>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment>;
  listPayments(userId?: number, bookingId?: number): Promise<Payment[]>;
  
  // Promotion operations
  getPromotion(id: number): Promise<Promotion | undefined>;
  getPromotionByCode(code: string): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, promotion: Partial<InsertPromotion>): Promise<Promotion>;
  listPromotions(active?: boolean): Promise<Promotion[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private rolesMap: Map<number, Role>;
  private sportCategoriesMap: Map<number, SportCategory>;
  private instructorsMap: Map<number, Instructor>;
  private venuesMap: Map<number, Venue>;
  private classesMap: Map<number, Class>;
  private schedulesMap: Map<number, Schedule>;
  private bookingsMap: Map<number, Booking>;
  private studentsMap: Map<number, Student>;
  private paymentsMap: Map<number, Payment>;
  private promotionsMap: Map<number, Promotion>;

  private userIdCounter: number;
  private roleIdCounter: number;
  private sportCategoryIdCounter: number;
  private instructorIdCounter: number;
  private venueIdCounter: number;
  private classIdCounter: number;
  private scheduleIdCounter: number;
  private bookingIdCounter: number;
  private studentIdCounter: number;
  private paymentIdCounter: number;
  private promotionIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.rolesMap = new Map();
    this.sportCategoriesMap = new Map();
    this.instructorsMap = new Map();
    this.venuesMap = new Map();
    this.classesMap = new Map();
    this.schedulesMap = new Map();
    this.bookingsMap = new Map();
    this.studentsMap = new Map();
    this.paymentsMap = new Map();
    this.promotionsMap = new Map();

    this.userIdCounter = 1;
    this.roleIdCounter = 1;
    this.sportCategoryIdCounter = 1;
    this.instructorIdCounter = 1;
    this.venueIdCounter = 1;
    this.classIdCounter = 1;
    this.scheduleIdCounter = 1;
    this.bookingIdCounter = 1;
    this.studentIdCounter = 1;
    this.paymentIdCounter = 1;
    this.promotionIdCounter = 1;

    // Initialize with some default roles
    this.createRole({ name: "admin", permissions: ["*"] });
    this.createRole({ name: "instructor", permissions: ["read:classes", "read:schedules", "update:schedules"] });
    this.createRole({ name: "student", permissions: ["read:classes", "read:schedules", "create:bookings"] });
    
    // Initialize with some default sport categories
    this.createSportCategory({ name: "Bóng đá", description: "Các lớp bóng đá cho mọi lứa tuổi", color: "#1E88E5" });
    this.createSportCategory({ name: "Bơi lội", description: "Các lớp bơi lội từ cơ bản đến nâng cao", color: "#43A047" });
    this.createSportCategory({ name: "Võ thuật", description: "Các lớp võ thuật truyền thống", color: "#E53935" });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.usersMap.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser = { ...existingUser, ...user };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  async listUsers(roleId?: number): Promise<User[]> {
    const users = Array.from(this.usersMap.values());
    if (roleId !== undefined) {
      return users.filter(user => user.roleId === roleId);
    }
    return users;
  }

  // Role operations
  async getRole(id: number): Promise<Role | undefined> {
    return this.rolesMap.get(id);
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    return Array.from(this.rolesMap.values()).find(role => role.name === name);
  }

  async createRole(role: InsertRole): Promise<Role> {
    const id = this.roleIdCounter++;
    const newRole: Role = { ...role, id };
    this.rolesMap.set(id, newRole);
    return newRole;
  }

  async listRoles(): Promise<Role[]> {
    return Array.from(this.rolesMap.values());
  }

  // Sport Category operations
  async getSportCategory(id: number): Promise<SportCategory | undefined> {
    return this.sportCategoriesMap.get(id);
  }

  async createSportCategory(category: InsertSportCategory): Promise<SportCategory> {
    const id = this.sportCategoryIdCounter++;
    const newCategory: SportCategory = { ...category, id };
    this.sportCategoriesMap.set(id, newCategory);
    return newCategory;
  }

  async listSportCategories(): Promise<SportCategory[]> {
    return Array.from(this.sportCategoriesMap.values());
  }

  // Instructor operations
  async getInstructor(id: number): Promise<Instructor | undefined> {
    return this.instructorsMap.get(id);
  }

  async getInstructorByUserId(userId: number): Promise<Instructor | undefined> {
    return Array.from(this.instructorsMap.values()).find(instructor => instructor.userId === userId);
  }

  async createInstructor(instructor: InsertInstructor): Promise<Instructor> {
    const id = this.instructorIdCounter++;
    const newInstructor: Instructor = { ...instructor, id };
    this.instructorsMap.set(id, newInstructor);
    return newInstructor;
  }

  async updateInstructor(id: number, instructor: Partial<InsertInstructor>): Promise<Instructor> {
    const existingInstructor = await this.getInstructor(id);
    if (!existingInstructor) {
      throw new Error("Instructor not found");
    }
    const updatedInstructor = { ...existingInstructor, ...instructor };
    this.instructorsMap.set(id, updatedInstructor);
    return updatedInstructor;
  }

  async listInstructors(sportCategoryId?: number): Promise<Instructor[]> {
    const instructors = Array.from(this.instructorsMap.values());
    if (sportCategoryId !== undefined) {
      return instructors.filter(instructor => instructor.sportCategoryId === sportCategoryId);
    }
    return instructors;
  }

  // Venue operations
  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venuesMap.get(id);
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const id = this.venueIdCounter++;
    const newVenue: Venue = { ...venue, id };
    this.venuesMap.set(id, newVenue);
    return newVenue;
  }

  async updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue> {
    const existingVenue = await this.getVenue(id);
    if (!existingVenue) {
      throw new Error("Venue not found");
    }
    const updatedVenue = { ...existingVenue, ...venue };
    this.venuesMap.set(id, updatedVenue);
    return updatedVenue;
  }

  async listVenues(): Promise<Venue[]> {
    return Array.from(this.venuesMap.values());
  }

  // Class operations
  async getClass(id: number): Promise<Class | undefined> {
    return this.classesMap.get(id);
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const id = this.classIdCounter++;
    const newClass: Class = { ...classData, id };
    this.classesMap.set(id, newClass);
    return newClass;
  }

  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class> {
    const existingClass = await this.getClass(id);
    if (!existingClass) {
      throw new Error("Class not found");
    }
    const updatedClass = { ...existingClass, ...classData };
    this.classesMap.set(id, updatedClass);
    return updatedClass;
  }

  async listClasses(sportCategoryId?: number): Promise<Class[]> {
    const classes = Array.from(this.classesMap.values());
    if (sportCategoryId !== undefined) {
      return classes.filter(cls => cls.sportCategoryId === sportCategoryId);
    }
    return classes;
  }

  // Schedule operations
  async getSchedule(id: number): Promise<Schedule | undefined> {
    return this.schedulesMap.get(id);
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const id = this.scheduleIdCounter++;
    const newSchedule: Schedule = { ...schedule, id };
    this.schedulesMap.set(id, newSchedule);
    return newSchedule;
  }

  async updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule> {
    const existingSchedule = await this.getSchedule(id);
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }
    const updatedSchedule = { ...existingSchedule, ...schedule };
    this.schedulesMap.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async listSchedules(classId?: number): Promise<Schedule[]> {
    const schedules = Array.from(this.schedulesMap.values());
    if (classId !== undefined) {
      return schedules.filter(schedule => schedule.classId === classId);
    }
    return schedules;
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookingsMap.get(id);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const newBooking: Booking = { ...booking, id, createdAt: new Date() };
    this.bookingsMap.set(id, newBooking);
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking> {
    const existingBooking = await this.getBooking(id);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }
    const updatedBooking = { ...existingBooking, ...booking };
    this.bookingsMap.set(id, updatedBooking);
    return updatedBooking;
  }

  async listBookings(userId?: number, classId?: number, status?: string): Promise<Booking[]> {
    let bookings = Array.from(this.bookingsMap.values());
    
    if (userId !== undefined) {
      bookings = bookings.filter(booking => booking.userId === userId);
    }
    
    if (classId !== undefined) {
      bookings = bookings.filter(booking => booking.classId === classId);
    }
    
    if (status !== undefined) {
      bookings = bookings.filter(booking => booking.status === status);
    }
    
    return bookings;
  }

  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    return this.studentsMap.get(id);
  }

  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    return Array.from(this.studentsMap.values()).find(student => student.userId === userId);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = this.studentIdCounter++;
    const newStudent: Student = { ...student, id };
    this.studentsMap.set(id, newStudent);
    return newStudent;
  }

  async updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student> {
    const existingStudent = await this.getStudent(id);
    if (!existingStudent) {
      throw new Error("Student not found");
    }
    const updatedStudent = { ...existingStudent, ...student };
    this.studentsMap.set(id, updatedStudent);
    return updatedStudent;
  }

  async listStudents(): Promise<Student[]> {
    return Array.from(this.studentsMap.values());
  }

  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.paymentsMap.get(id);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const newPayment: Payment = { ...payment, id, createdAt: new Date() };
    this.paymentsMap.set(id, newPayment);
    return newPayment;
  }

  async updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment> {
    const existingPayment = await this.getPayment(id);
    if (!existingPayment) {
      throw new Error("Payment not found");
    }
    const updatedPayment = { ...existingPayment, ...payment };
    this.paymentsMap.set(id, updatedPayment);
    return updatedPayment;
  }

  async listPayments(userId?: number, bookingId?: number): Promise<Payment[]> {
    let payments = Array.from(this.paymentsMap.values());
    
    if (userId !== undefined) {
      payments = payments.filter(payment => payment.userId === userId);
    }
    
    if (bookingId !== undefined) {
      payments = payments.filter(payment => payment.bookingId === bookingId);
    }
    
    return payments;
  }

  // Promotion operations
  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotionsMap.get(id);
  }

  async getPromotionByCode(code: string): Promise<Promotion | undefined> {
    return Array.from(this.promotionsMap.values()).find(promo => promo.code === code);
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const id = this.promotionIdCounter++;
    const newPromotion: Promotion = { ...promotion, id };
    this.promotionsMap.set(id, newPromotion);
    return newPromotion;
  }

  async updatePromotion(id: number, promotion: Partial<InsertPromotion>): Promise<Promotion> {
    const existingPromotion = await this.getPromotion(id);
    if (!existingPromotion) {
      throw new Error("Promotion not found");
    }
    const updatedPromotion = { ...existingPromotion, ...promotion };
    this.promotionsMap.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async listPromotions(active?: boolean): Promise<Promotion[]> {
    const promotions = Array.from(this.promotionsMap.values());
    if (active !== undefined) {
      return promotions.filter(promo => promo.active === active);
    }
    return promotions;
  }
}

// Create and export storage instance
export const storage = new MemStorage();

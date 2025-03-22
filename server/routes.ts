import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertClassSchema, insertBookingSchema, insertPaymentSchema, insertPromotionSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Helper function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Helper function to compare passwords
const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup session
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "edusport-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 1 day
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Auth middlewares
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  const hasRole = (roles: string[]) => async (req: Request, res: Response, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    const role = await storage.getRole(user.roleId);
    
    if (!role || !roles.includes(role.name)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };
  
  // Auth routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  
  // User registration
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password
      userData.password = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Create student profile if role is student
      if (userData.roleId === 3) { // assuming 3 is student role id
        await storage.createStudent({ userId: user.id });
      }
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // User routes
  app.get("/api/users", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const roleId = req.query.roleId ? Number(req.query.roleId) : undefined;
      const users = await storage.listUsers(roleId);
      
      // Don't send passwords
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        roleId: user.roleId,
        language: user.language,
        active: user.active
      }));
      
      res.json(safeUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only admin or the user themselves can access this
      const currentUser = req.user as any;
      const currentRole = await storage.getRole(currentUser.roleId);
      
      if (currentUser.id !== userId && currentRole?.name !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Don't send password
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Sport Category routes
  app.get("/api/sport-categories", async (req, res) => {
    try {
      const categories = await storage.listSportCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Instructor routes
  app.get("/api/instructors", async (req, res) => {
    try {
      const sportCategoryId = req.query.sportCategoryId 
        ? Number(req.query.sportCategoryId) 
        : undefined;
      
      const instructors = await storage.listInstructors(sportCategoryId);
      
      // Fetch user details for each instructor
      const instructorsWithDetails = await Promise.all(
        instructors.map(async (instructor) => {
          const user = await storage.getUser(instructor.userId);
          const sportCategory = await storage.getSportCategory(instructor.sportCategoryId);
          
          return {
            ...instructor,
            user: user ? {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              phone: user.phone
            } : null,
            sportCategory: sportCategory || null
          };
        })
      );
      
      res.json(instructorsWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Class routes
  app.get("/api/classes", async (req, res) => {
    try {
      const sportCategoryId = req.query.sportCategoryId 
        ? Number(req.query.sportCategoryId) 
        : undefined;
      
      const classes = await storage.listClasses(sportCategoryId);
      
      // Fetch related details for each class
      const classesWithDetails = await Promise.all(
        classes.map(async (cls) => {
          const instructor = await storage.getInstructor(cls.instructorId);
          const sportCategory = await storage.getSportCategory(cls.sportCategoryId);
          const venue = cls.venueId ? await storage.getVenue(cls.venueId) : null;
          const schedules = await storage.listSchedules(cls.id);
          
          let instructorUser = null;
          if (instructor) {
            const user = await storage.getUser(instructor.userId);
            if (user) {
              instructorUser = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
              };
            }
          }
          
          return {
            ...cls,
            instructor: instructor ? {
              ...instructor,
              user: instructorUser
            } : null,
            sportCategory,
            venue,
            schedules
          };
        })
      );
      
      res.json(classesWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/classes", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const classData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass(classData);
      res.status(201).json(newClass);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Booking routes
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const currentUser = req.user as any;
      const currentRole = await storage.getRole(currentUser.roleId);
      
      let userId: number | undefined = undefined;
      const classId = req.query.classId ? Number(req.query.classId) : undefined;
      const status = req.query.status as string | undefined;
      
      // If not admin, only show user's own bookings
      if (currentRole?.name !== 'admin') {
        userId = currentUser.id;
      } else if (req.query.userId) {
        userId = Number(req.query.userId);
      }
      
      const bookings = await storage.listBookings(userId, classId, status);
      
      // Fetch related details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const user = await storage.getUser(booking.userId);
          const cls = await storage.getClass(booking.classId);
          const schedule = await storage.getSchedule(booking.scheduleId);
          const payments = await storage.listPayments(booking.userId, booking.id);
          
          return {
            ...booking,
            user: user ? {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              phone: user.phone
            } : null,
            class: cls,
            schedule,
            payments
          };
        })
      );
      
      res.json(bookingsWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Validate class exists
      const cls = await storage.getClass(bookingData.classId);
      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      // Validate schedule exists
      const schedule = await storage.getSchedule(bookingData.scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      
      // Check if class is at capacity
      const existingBookings = await storage.listBookings(
        undefined, 
        bookingData.classId, 
        "confirmed"
      );
      
      if (existingBookings.length >= cls.capacity) {
        return res.status(400).json({ message: "Class is at full capacity" });
      }
      
      // Create booking
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.patch("/api/bookings/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const bookingId = Number(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      const updatedBooking = await storage.updateBooking(bookingId, req.body);
      res.json(updatedBooking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Payment routes
  app.post("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      
      // Validate booking if provided
      if (paymentData.bookingId) {
        const booking = await storage.getBooking(paymentData.bookingId);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
      }
      
      // Create payment
      const payment = await storage.createPayment(paymentData);
      
      // If payment is for a booking, update booking status
      if (payment.bookingId && payment.status === "completed") {
        await storage.updateBooking(payment.bookingId, { status: "confirmed" });
      }
      
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Promotion routes
  app.get("/api/promotions", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const promotions = await storage.listPromotions(active);
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/promotions", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const promotionData = insertPromotionSchema.parse(req.body);
      
      // Check if code already exists
      const existingPromo = await storage.getPromotionByCode(promotionData.code);
      if (existingPromo) {
        return res.status(400).json({ message: "Promotion code already exists" });
      }
      
      const promotion = await storage.createPromotion(promotionData);
      res.status(201).json(promotion);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.get("/api/promotions/validate/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const promotion = await storage.getPromotionByCode(code);
      
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      
      // Check if promotion is active
      if (!promotion.active) {
        return res.status(400).json({ message: "Promotion is inactive" });
      }
      
      // Check dates
      const now = new Date();
      if (now < promotion.startDate || now > promotion.endDate) {
        return res.status(400).json({ message: "Promotion is not valid at this time" });
      }
      
      // Check usage limits
      if (promotion.maxUses && promotion.useCount >= promotion.maxUses) {
        return res.status(400).json({ message: "Promotion usage limit reached" });
      }
      
      res.json(promotion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard data
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const students = await storage.listUsers(3); // Assuming roleId 3 is for students
      const classes = await storage.listClasses();
      const instructors = await storage.listInstructors();
      const bookings = await storage.listBookings();
      const payments = await storage.listPayments();
      
      // Calculate total revenue
      const totalRevenue = payments
        .filter(payment => payment.status === "completed")
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      // Get confirmed bookings for today
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const todayBookings = bookings.filter(
        booking => booking.bookingDate.toISOString().split('T')[0] === todayString
      );
      
      // Get recent bookings
      const recentBookings = bookings
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);
      
      // Enhanced recent bookings with user and class details
      const recentBookingsWithDetails = await Promise.all(
        recentBookings.map(async (booking) => {
          const user = await storage.getUser(booking.userId);
          const cls = await storage.getClass(booking.classId);
          const schedule = await storage.getSchedule(booking.scheduleId);
          const sportCategory = cls ? await storage.getSportCategory(cls.sportCategoryId) : null;
          
          return {
            ...booking,
            user: user ? {
              id: user.id,
              fullName: user.fullName
            } : null,
            class: cls ? {
              id: cls.id,
              name: cls.name,
              ageGroup: cls.ageGroup
            } : null,
            schedule,
            sportCategory
          };
        })
      );
      
      // Calculate monthly growth
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthString = lastMonth.toISOString().split('T')[0].slice(0, 7); // YYYY-MM
      const thisMonthString = today.toISOString().split('T')[0].slice(0, 7); // YYYY-MM
      
      const lastMonthStudents = students.filter(
        student => student.createdAt && student.createdAt.toISOString().slice(0, 7) === lastMonthString
      ).length;
      
      const thisMonthStudents = students.filter(
        student => student.createdAt && student.createdAt.toISOString().slice(0, 7) === thisMonthString
      ).length;
      
      const studentGrowthPercent = lastMonthStudents 
        ? Math.round((thisMonthStudents - lastMonthStudents) / lastMonthStudents * 100) 
        : 0;
      
      // Get instructor availability (mock for now since we need more implementation)
      const availableInstructors = instructors.filter(
        instructor => instructor.status === "available"
      );
      
      const instructorsWithDetails = await Promise.all(
        availableInstructors.map(async (instructor) => {
          const user = await storage.getUser(instructor.userId);
          const sportCategory = await storage.getSportCategory(instructor.sportCategoryId);
          
          // Get classes taught by this instructor
          const instructorClasses = classes.filter(cls => cls.instructorId === instructor.id);
          
          return {
            ...instructor,
            user: user ? {
              id: user.id,
              fullName: user.fullName,
              email: user.email
            } : null,
            sportCategory,
            classesTaught: instructorClasses.map(cls => ({
              id: cls.id,
              name: cls.name,
              ageGroup: cls.ageGroup
            })),
            availability: instructor.availability.join(", ")
          };
        })
      );
      
      res.json({
        stats: {
          totalStudents: students.length,
          activeClasses: classes.filter(cls => cls.active).length,
          totalRevenue,
          totalInstructors: instructors.length,
          studentGrowthPercent,
          newStudentsThisMonth: thisMonthStudents
        },
        todayBookings,
        recentBookings: recentBookingsWithDetails,
        availableInstructors: instructorsWithDetails
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}

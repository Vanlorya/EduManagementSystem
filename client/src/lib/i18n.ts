import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Available languages
export type Language = 'vi' | 'en';

// Translation dictionary type
export type TranslationDict = Record<string, Record<string, string>>;

// Default translations
const translations: TranslationDict = {
  // Vietnamese translations (primary)
  vi: {
    // General
    'app.name': 'EduSport',
    'app.tagline': 'Quản lý Trung tâm Thể thao',
    
    // Navigation
    'nav.dashboard': 'Trang chủ',
    'nav.calendar': 'Lịch học & Đặt lịch',
    'nav.students': 'Học viên',
    'nav.instructors': 'Huấn luyện viên',
    'nav.payments': 'Thanh toán',
    'nav.promotions': 'Khuyến mãi',
    'nav.messages': 'Email & SMS',
    'nav.settings': 'Cài đặt',
    'nav.reports': 'Báo cáo',
    'nav.management': 'Quản lý',
    'nav.marketing': 'Marketing',
    'nav.system': 'Hệ thống',
    
    // Dashboard
    'dashboard.stats.totalStudents': 'Tổng học viên',
    'dashboard.stats.activeClasses': 'Lớp học kích hoạt',
    'dashboard.stats.monthlyRevenue': 'Doanh thu tháng',
    'dashboard.stats.instructors': 'Huấn luyện viên',
    'dashboard.stats.increase': 'Tăng',
    'dashboard.stats.decrease': 'Giảm',
    'dashboard.stats.noChange': 'Không thay đổi',
    'dashboard.schedule.title': 'Lịch hôm nay',
    'dashboard.schedule.allSports': 'Tất cả',
    'dashboard.schedule.football': 'Bóng đá',
    'dashboard.schedule.swimming': 'Bơi lội',
    'dashboard.schedule.martialArts': 'Võ thuật',
    'dashboard.bookings.title': 'Đăng ký gần đây',
    'dashboard.bookings.viewAll': 'Xem tất cả',
    'dashboard.bookings.confirmed': 'Đã xác nhận',
    'dashboard.bookings.pendingPayment': 'Chờ thanh toán',
    'dashboard.bookings.new': 'Mới đăng ký',
    'dashboard.instructors.title': 'Huấn luyện viên sẵn sàng',
    'dashboard.instructors.weekSchedule': 'Lịch tuần này',
    'dashboard.instructors.available': 'Có mặt',
    'dashboard.instructors.unavailable': 'Không có mặt',
    'dashboard.instructors.onLeave': 'Nghỉ phép',
    'dashboard.instructors.setSchedule': 'Đặt lịch',
    'dashboard.actions.addStudent': 'Thêm học viên',
    'dashboard.actions.createClass': 'Tạo lớp học mới',
    'dashboard.actions.promotions': 'Mã khuyến mãi',
    'dashboard.actions.reports': 'Báo cáo',
    
    // Calendar
    'calendar.title': 'Lịch học & Đặt lịch',
    'calendar.newBooking': 'Đặt lịch mới',
    'calendar.filters': 'Bộ lọc',
    'calendar.filters.date': 'Ngày',
    'calendar.filters.instructor': 'Huấn luyện viên',
    'calendar.filters.sport': 'Bộ môn',
    'calendar.filters.venue': 'Địa điểm',
    'calendar.filters.apply': 'Áp dụng',
    'calendar.schedule': 'Lịch học',
    'calendar.today': 'Hôm nay',
    
    // Status labels
    'status.active': 'Hoạt động',
    'status.inactive': 'Không hoạt động',
    'status.available': 'Có mặt',
    'status.unavailable': 'Không có mặt',
    'status.onLeave': 'Nghỉ phép',
    'status.confirmed': 'Đã xác nhận',
    'status.pendingPayment': 'Chờ thanh toán',
    'status.completed': 'Hoàn tất',
    'status.cancelled': 'Đã hủy',
    'status.new': 'Mới',
    'status.sent': 'Đã gửi',
    'status.scheduled': 'Đã lên lịch',
    'status.draft': 'Bản nháp',
    'status.expired': 'Hết hạn',
    'status.active': 'Kích hoạt',
    'status.paused': 'Tạm dừng',
    
    // Form labels
    'form.search': 'Tìm kiếm...',
    'form.filter': 'Lọc',
    'form.save': 'Lưu',
    'form.cancel': 'Hủy',
    'form.delete': 'Xóa',
    'form.edit': 'Sửa',
    'form.add': 'Thêm',
    'form.view': 'Xem',
    'form.download': 'Tải xuống',
    'form.export': 'Xuất báo cáo',
    'form.create': 'Tạo mới',
    
    // Errors and messages
    'error.notFound': 'Không tìm thấy',
    'error.serverError': 'Lỗi máy chủ',
    'error.unauthorized': 'Không có quyền truy cập',
    'message.saved': 'Đã lưu thành công',
    'message.deleted': 'Đã xóa thành công',
    'message.copied': 'Đã sao chép',
  },
  
  // English translations (secondary)
  en: {
    // General
    'app.name': 'EduSport',
    'app.tagline': 'Sports Center Management',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.calendar': 'Calendar & Bookings',
    'nav.students': 'Students',
    'nav.instructors': 'Instructors',
    'nav.payments': 'Payments',
    'nav.promotions': 'Promotions',
    'nav.messages': 'Email & SMS',
    'nav.settings': 'Settings',
    'nav.reports': 'Reports',
    'nav.management': 'Management',
    'nav.marketing': 'Marketing',
    'nav.system': 'System',
    
    // Dashboard
    'dashboard.stats.totalStudents': 'Total Students',
    'dashboard.stats.activeClasses': 'Active Classes',
    'dashboard.stats.monthlyRevenue': 'Monthly Revenue',
    'dashboard.stats.instructors': 'Instructors',
    'dashboard.stats.increase': 'Increase',
    'dashboard.stats.decrease': 'Decrease',
    'dashboard.stats.noChange': 'No Change',
    'dashboard.schedule.title': 'Today\'s Schedule',
    'dashboard.schedule.allSports': 'All',
    'dashboard.schedule.football': 'Football',
    'dashboard.schedule.swimming': 'Swimming',
    'dashboard.schedule.martialArts': 'Martial Arts',
    'dashboard.bookings.title': 'Recent Bookings',
    'dashboard.bookings.viewAll': 'View All',
    'dashboard.bookings.confirmed': 'Confirmed',
    'dashboard.bookings.pendingPayment': 'Pending Payment',
    'dashboard.bookings.new': 'New Registration',
    'dashboard.instructors.title': 'Available Instructors',
    'dashboard.instructors.weekSchedule': 'This Week\'s Schedule',
    'dashboard.instructors.available': 'Available',
    'dashboard.instructors.unavailable': 'Unavailable',
    'dashboard.instructors.onLeave': 'On Leave',
    'dashboard.instructors.setSchedule': 'Set Schedule',
    'dashboard.actions.addStudent': 'Add Student',
    'dashboard.actions.createClass': 'Create New Class',
    'dashboard.actions.promotions': 'Promotion Codes',
    'dashboard.actions.reports': 'Reports',
    
    // Calendar
    'calendar.title': 'Calendar & Bookings',
    'calendar.newBooking': 'New Booking',
    'calendar.filters': 'Filters',
    'calendar.filters.date': 'Date',
    'calendar.filters.instructor': 'Instructor',
    'calendar.filters.sport': 'Sport',
    'calendar.filters.venue': 'Venue',
    'calendar.filters.apply': 'Apply',
    'calendar.schedule': 'Schedule',
    'calendar.today': 'Today',
    
    // Status labels
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.available': 'Available',
    'status.unavailable': 'Unavailable',
    'status.onLeave': 'On Leave',
    'status.confirmed': 'Confirmed',
    'status.pendingPayment': 'Pending Payment',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.new': 'New',
    'status.sent': 'Sent',
    'status.scheduled': 'Scheduled',
    'status.draft': 'Draft',
    'status.expired': 'Expired',
    'status.active': 'Active',
    'status.paused': 'Paused',
    
    // Form labels
    'form.search': 'Search...',
    'form.filter': 'Filter',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.delete': 'Delete',
    'form.edit': 'Edit',
    'form.add': 'Add',
    'form.view': 'View',
    'form.download': 'Download',
    'form.export': 'Export Report',
    'form.create': 'Create',
    
    // Errors and messages
    'error.notFound': 'Not Found',
    'error.serverError': 'Server Error',
    'error.unauthorized': 'Unauthorized',
    'message.saved': 'Saved successfully',
    'message.deleted': 'Deleted successfully',
    'message.copied': 'Copied to clipboard',
  }
};

// Translation context
interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (key) => key,
});

// Translation provider component
interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const I18nProvider = ({ children, defaultLanguage = 'vi' }: I18nProviderProps) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language]?.[key] || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(`{{${param}}}`, value),
        translation
      );
    }
    
    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use translations
export const useTranslation = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  
  return context;
};

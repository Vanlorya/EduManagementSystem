import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import RecentBookings from "@/components/dashboard/RecentBookings";
import InstructorAvailability from "@/components/dashboard/InstructorAvailability";
import QuickActions from "@/components/dashboard/QuickActions";

// Dashboard data type
interface DashboardData {
  stats: {
    totalStudents: number;
    activeClasses: number;
    totalRevenue: number;
    totalInstructors: number;
    studentGrowthPercent: number;
    newStudentsThisMonth: number;
  };
  todayBookings: any[];
  recentBookings: any[];
  availableInstructors: any[];
}

// Sample data - In a real app, this would come from an API
const sampleData: DashboardData = {
  stats: {
    totalStudents: 245,
    activeClasses: 18,
    totalRevenue: 42500000, // 42.5M VND
    totalInstructors: 12,
    studentGrowthPercent: 12,
    newStudentsThisMonth: 28
  },
  todayBookings: [],
  recentBookings: [],
  availableInstructors: []
};

const Dashboard: React.FC = () => {
  console.log("Dashboard component rendering");
  
  // In a real app, this would fetch from the API
  // const { data, isLoading } = useQuery({ 
  //   queryKey: ['/api/dashboard'], 
  // });

  // Using sample data for now
  const data = sampleData;
  const isLoading = false;

  // Format currency (VND)
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return amount.toLocaleString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  console.log("Rendering Dashboard return...");
  return (
    <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-primary-700">Dashboard Trung tâm Thể thao</h1>
    
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <StatCard 
          title="Tổng học viên" 
          value={data.stats.totalStudents} 
          change={data.stats.studentGrowthPercent}
          helpText={`Tăng ${data.stats.newStudentsThisMonth} học viên trong tháng`}
        />
        
        <StatCard 
          title="Lớp học kích hoạt" 
          value={data.stats.activeClasses} 
          change={8}
          helpText="Tăng 2 lớp trong tháng"
        />
        
        <StatCard 
          title="Doanh thu tháng" 
          value={formatCurrency(data.stats.totalRevenue)} 
          change={15}
          helpText="VND (Tăng 5.5M so với tháng trước)"
        />
        
        <StatCard 
          title="Huấn luyện viên" 
          value={data.stats.totalInstructors} 
          change={0}
          helpText="Không thay đổi"
        />
      </div>

      {/* Today's Schedule & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TodaySchedule />
        <RecentBookings />
      </div>

      {/* Instructor Availability */}
      <div className="mb-4 sm:mb-6">
        <InstructorAvailability />
      </div>

      {/* Quick Actions */}
      <div className="mb-4 sm:mb-6">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;

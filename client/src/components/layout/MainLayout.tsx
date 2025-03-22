import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Bell } from "lucide-react";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const getPageTitle = (path: string): string => {
  const pathMapping: Record<string, string> = {
    "/": "Trang chủ",
    "/calendar": "Lịch học & Đặt lịch",
    "/students": "Học viên",
    "/instructors": "Huấn luyện viên",
    "/payments": "Thanh toán",
    "/promotions": "Khuyến mãi",
    "/messages": "Email & SMS",
    "/settings": "Cài đặt",
    "/reports": "Báo cáo",
  };
  
  return pathMapping[path] || "Trang không tìm thấy";
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  console.log("MainLayout component rendering");
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const pageTitle = getPageTitle(location);
  console.log("Children in MainLayout:", children);
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-3 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4 md:mb-0">{pageTitle}</h2>
            <div className="flex flex-wrap items-center gap-3 md:space-x-4">
              <div className="relative flex-grow md:flex-grow-0 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              
              <div className="flex items-center">
                <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600">
                  <span className="absolute top-0 right-0 h-2 w-2 bg-error-500 rounded-full"></span>
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center">
                <img 
                  src="https://ui-avatars.com/api/?name=Admin+User&background=1E88E5&color=fff" 
                  alt="Admin User" 
                  className="h-8 w-8 rounded-full"
                />
                <span className="ml-2 text-sm font-medium">Quản trị viên</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-3 md:p-6 w-full border border-gray-200 rounded-lg bg-white">
          {children ? children : <div>Không có nội dung</div>}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

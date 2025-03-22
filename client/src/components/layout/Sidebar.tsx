import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutGrid,
  Calendar,
  Users,
  User,
  CreditCard,
  Tag,
  Mail,
  BarChart3,
  Settings
} from "lucide-react";

type SidebarItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

type SidebarCategory = {
  title: string;
  items: SidebarItem[];
};

const Sidebar = () => {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories: SidebarCategory[] = [
    {
      title: "Quản lý",
      items: [
        { name: "Trang chủ", icon: <LayoutGrid className="h-5 w-5 mr-3" />, path: "/" },
        { name: "Lịch học & Đặt lịch", icon: <Calendar className="h-5 w-5 mr-3" />, path: "/calendar" },
        { name: "Học viên", icon: <Users className="h-5 w-5 mr-3" />, path: "/students" },
        { name: "Huấn luyện viên", icon: <User className="h-5 w-5 mr-3" />, path: "/instructors" },
        { name: "Thanh toán", icon: <CreditCard className="h-5 w-5 mr-3" />, path: "/payments" },
      ]
    },
    {
      title: "Marketing",
      items: [
        { name: "Khuyến mãi", icon: <Tag className="h-5 w-5 mr-3" />, path: "/promotions" },
        { name: "Email & SMS", icon: <Mail className="h-5 w-5 mr-3" />, path: "/messages" },
      ]
    },
    {
      title: "Hệ thống",
      items: [
        { name: "Cài đặt", icon: <Settings className="h-5 w-5 mr-3" />, path: "/settings" },
        { name: "Báo cáo", icon: <BarChart3 className="h-5 w-5 mr-3" />, path: "/reports" },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h1 className="font-heading font-bold text-2xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            EduSport
          </h1>
          <p className="text-sm text-gray-400 mt-1">Quản lý Trung tâm Thể thao</p>
        </div>
        
        <nav className="p-2 pb-20">
          {categories.map((category, index) => (
            <div className="mb-3" key={index}>
              <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-3 mb-2">
                {category.title}
              </h3>
              {category.items.map((item, itemIndex) => (
                <Link 
                  key={itemIndex} 
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg mb-1 ${
                    location === item.path 
                      ? 'text-gray-100 bg-primary-600' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="bg-gray-800 text-white w-full h-16 flex md:hidden items-center justify-between px-4 sticky top-0 z-10">
        <h1 className="font-heading font-bold text-xl flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          EduSport
        </h1>
        <button 
          className="text-gray-300 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h1 className="font-heading font-bold text-xl flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                EduSport
              </h1>
              <button 
                className="text-gray-300 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="p-2">
              {categories.map((category, index) => (
                <div className="mb-3" key={index}>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-3 mb-2">
                    {category.title}
                  </h3>
                  {category.items.map((item, itemIndex) => (
                    <Link 
                      key={itemIndex} 
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg mb-1 ${
                        location === item.path 
                          ? 'text-gray-100 bg-primary-600' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

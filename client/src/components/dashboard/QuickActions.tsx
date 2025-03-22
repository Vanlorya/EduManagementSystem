import { UserPlus, Calendar, Tag, BarChart3 } from "lucide-react";
import { Link } from "wouter";

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Thêm học viên",
      description: "Tạo thông tin học viên mới và quản lý lớp học",
      icon: <UserPlus className="h-6 w-6" />,
      link: "/students/new"
    },
    {
      title: "Tạo lớp học mới",
      description: "Mở lớp học mới với thông tin thời gian và huấn luyện viên",
      icon: <Calendar className="h-6 w-6" />,
      link: "/calendar/new-class"
    },
    {
      title: "Mã khuyến mãi",
      description: "Tạo mã giảm giá và ưu đãi cho học viên đăng ký mới",
      icon: <Tag className="h-6 w-6" />,
      link: "/promotions/new"
    },
    {
      title: "Báo cáo",
      description: "Xem báo cáo doanh thu và thống kê học viên tham gia",
      icon: <BarChart3 className="h-6 w-6" />,
      link: "/reports"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {actions.map((action, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
            {action.icon}
          </div>
          <h3 className="text-lg font-heading font-semibold mb-2">{action.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{action.description}</p>
          <Link 
            href={action.link}
            className="bg-primary-600 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-primary-700 transition-colors mt-auto"
          >
            {action.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;

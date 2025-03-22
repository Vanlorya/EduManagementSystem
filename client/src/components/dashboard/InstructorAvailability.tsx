import { useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";

interface Instructor {
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

// Sample data - this would be replaced with API data
const sampleInstructors: Instructor[] = [
  {
    id: 1,
    userId: 5,
    status: "available",
    user: {
      id: 5,
      fullName: "Nguyễn Văn Trung",
      email: "trung@example.com"
    },
    sportCategory: {
      id: 1,
      name: "Bóng đá"
    },
    classesTaught: [
      { id: 1, name: "Bóng đá", ageGroup: "U10" },
      { id: 2, name: "Bóng đá", ageGroup: "U12" }
    ],
    availability: "CN, T3, T5"
  },
  {
    id: 2,
    userId: 6,
    status: "available",
    user: {
      id: 6,
      fullName: "Trần Minh Thắng",
      email: "thang@example.com"
    },
    sportCategory: {
      id: 1,
      name: "Bóng đá"
    },
    classesTaught: [
      { id: 3, name: "Bóng đá", ageGroup: "U15" },
      { id: 4, name: "Bóng đá", ageGroup: "U17" }
    ],
    availability: "T2, T4, T6"
  },
  {
    id: 3,
    userId: 7,
    status: "on_leave",
    leaveUntil: "2023-08-20",
    user: {
      id: 7,
      fullName: "Lê Thu Hà",
      email: "ha@example.com"
    },
    sportCategory: {
      id: 2,
      name: "Bơi lội"
    },
    classesTaught: [
      { id: 5, name: "Bơi lội", ageGroup: "Cơ bản" },
      { id: 6, name: "Bơi lội", ageGroup: "Nâng cao" }
    ],
    availability: ""
  }
];

const getStatusBadgeClasses = (status: string) => {
  switch(status) {
    case "available":
      return "bg-success-100 text-success-800";
    case "unavailable":
      return "bg-gray-100 text-gray-800";
    case "on_leave":
      return "bg-error-100 text-error-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch(status) {
    case "available":
      return "Có mặt";
    case "unavailable":
      return "Không có mặt";
    case "on_leave":
      return "Nghỉ phép";
    default:
      return status;
  }
};

const InstructorAvailability: React.FC = () => {
  // In a real app, this would fetch from the API
  // const { data: instructors, isLoading } = useQuery({ 
  //   queryKey: ['/api/instructors/available'], 
  // });

  // Using sample data for now
  const instructors = sampleInstructors;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Huấn luyện viên sẵn sàng</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse">
            {/* Loading state */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Huấn luyện viên sẵn sàng</h2>
          <div className="flex space-x-2">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Lịch tuần này
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Huấn luyện viên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bộ môn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp học</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoảng trống</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.user.fullName)}&background=random`} 
                          alt={instructor.user.fullName} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{instructor.user.fullName}</div>
                        <div className="text-sm text-gray-500">{instructor.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.sportCategory.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {instructor.classesTaught.map(c => c.ageGroup).join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(instructor.status)}`}>
                      {getStatusLabel(instructor.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {instructor.status === "on_leave" 
                      ? `- Nghỉ đến ${instructor.leaveUntil}` 
                      : instructor.availability}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {instructor.status === "available" ? (
                      <button className="text-primary-600 hover:text-primary-900 mr-3">Đặt lịch</button>
                    ) : (
                      <button className="text-gray-400 cursor-not-allowed mr-3">Đặt lịch</button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorAvailability;

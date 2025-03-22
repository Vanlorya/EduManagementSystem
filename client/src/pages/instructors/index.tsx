import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Edit, Trash, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const InstructorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // For a real implementation, we would fetch from the API
  const { data: instructors, isLoading } = useQuery({
    queryKey: ['/api/instructors'],
    placeholderData: [
      {
        id: 1,
        userId: 5,
        status: "available",
        leaveUntil: null,
        user: {
          id: 5,
          fullName: "Nguyễn Văn Trung",
          email: "trung@example.com",
          phone: "0912345678"
        },
        sportCategory: {
          id: 1,
          name: "Bóng đá",
          color: "#1E88E5"
        },
        classesTaught: [
          { id: 1, name: "Bóng đá", ageGroup: "U10" },
          { id: 2, name: "Bóng đá", ageGroup: "U12" }
        ],
        bio: "HLV đội tuyển bóng đá trẻ cấp quận, 5 năm kinh nghiệm huấn luyện.",
        yearsExperience: 5,
        specialties: ["Kỹ thuật cơ bản", "Chiến thuật"],
        availability: ["MON", "WED", "FRI"]
      },
      {
        id: 2,
        userId: 6,
        status: "available",
        leaveUntil: null,
        user: {
          id: 6,
          fullName: "Trần Minh Thắng",
          email: "thang@example.com",
          phone: "0987654321"
        },
        sportCategory: {
          id: 1,
          name: "Bóng đá",
          color: "#1E88E5"
        },
        classesTaught: [
          { id: 3, name: "Bóng đá", ageGroup: "U15" },
          { id: 4, name: "Bóng đá", ageGroup: "U17" }
        ],
        bio: "Cầu thủ bóng đá chuyên nghiệp, đã thi đấu cho CLB thành phố.",
        yearsExperience: 8,
        specialties: ["Kỹ thuật nâng cao", "Chiến thuật", "Thể lực"],
        availability: ["TUE", "THU", "SAT"]
      },
      {
        id: 3,
        userId: 7,
        status: "on_leave",
        leaveUntil: "2023-08-20",
        user: {
          id: 7,
          fullName: "Lê Thu Hà",
          email: "ha@example.com",
          phone: "0965432178"
        },
        sportCategory: {
          id: 2,
          name: "Bơi lội",
          color: "#43A047"
        },
        classesTaught: [
          { id: 5, name: "Bơi lội", ageGroup: "Cơ bản" },
          { id: 6, name: "Bơi lội", ageGroup: "Nâng cao" }
        ],
        bio: "VĐV bơi lội cấp quốc gia, 10 năm kinh nghiệm giảng dạy.",
        yearsExperience: 10,
        specialties: ["Kỹ thuật bơi ếch", "Kỹ thuật bơi tự do", "Kỹ thuật bơi bướm"],
        availability: ["MON", "TUE", "WED", "THU", "FRI"]
      },
      {
        id: 4,
        userId: 8,
        status: "available",
        leaveUntil: null,
        user: {
          id: 8,
          fullName: "Phạm Văn Đức",
          email: "duc@example.com",
          phone: "0932178654"
        },
        sportCategory: {
          id: 3,
          name: "Võ thuật",
          color: "#E53935"
        },
        classesTaught: [
          { id: 7, name: "Võ thuật", ageGroup: "Thiếu nhi" },
          { id: 8, name: "Võ thuật", ageGroup: "Thiếu niên" }
        ],
        bio: "Võ sư đai đen Taekwondo, từng tham gia SEA Games.",
        yearsExperience: 12,
        specialties: ["Taekwondo", "Tự vệ cơ bản"],
        availability: ["MON", "WED", "FRI", "SAT"]
      }
    ]
  });
  
  const dayOfWeekMap: Record<string, string> = {
    MON: "T2",
    TUE: "T3",
    WED: "T4",
    THU: "T5",
    FRI: "T6",
    SAT: "T7",
    SUN: "CN"
  };

  // Filter instructors based on search query
  const filteredInstructors = instructors?.filter(instructor => 
    instructor.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.sportCategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.user.phone.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-success-100 text-success-800 hover:bg-success-200">
            <UserCheck className="h-3 w-3 mr-1" /> Có mặt
          </Badge>
        );
      case "unavailable":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <UserX className="h-3 w-3 mr-1" /> Không có mặt
          </Badge>
        );
      case "on_leave":
        return (
          <Badge variant="outline" className="bg-error-100 text-error-800 hover:bg-error-200">
            <UserX className="h-3 w-3 mr-1" /> Nghỉ phép
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý huấn luyện viên</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Thêm huấn luyện viên</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách huấn luyện viên</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm huấn luyện viên..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Huấn luyện viên</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Bộ môn</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Kinh nghiệm</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Lớp dạy</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Lịch trống</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors?.map((instructor) => (
                  <tr key={instructor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.user.fullName)}&background=random`} 
                          alt={instructor.user.fullName} 
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">{instructor.user.fullName}</div>
                          <div className="text-xs text-gray-500">{instructor.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className="inline-block rounded-full px-2 py-1 text-xs"
                        style={{ 
                          backgroundColor: `${instructor.sportCategory.color}20`, 
                          color: instructor.sportCategory.color 
                        }}
                      >
                        {instructor.sportCategory.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">{instructor.yearsExperience} năm</td>
                    <td className="py-3 px-4">
                      {instructor.classesTaught.map((cls, index) => (
                        <span 
                          key={index} 
                          className="inline-block bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs mr-1 mb-1"
                        >
                          {cls.name} {cls.ageGroup}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-4">
                      {instructor.status === "on_leave" 
                        ? `Nghỉ đến ${instructor.leaveUntil}` 
                        : instructor.availability.map(day => dayOfWeekMap[day]).join(", ")}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(instructor.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-error-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInstructors?.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Không tìm thấy huấn luyện viên phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorsPage;

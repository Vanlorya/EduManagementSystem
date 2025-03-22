import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

const StudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample student data
  const students = [
    {
      id: 1, 
      fullName: "Nguyễn Văn An", 
      age: 10, 
      parentName: "Nguyễn Thị Hoa", 
      phone: "0912345678", 
      classes: ["Bóng đá U10"],
      status: "active"
    },
    {
      id: 2,
      fullName: "Trần Thị Bình",
      age: 12,
      parentName: "Trần Văn Hùng",
      phone: "0987654321",
      classes: ["Bơi lội cơ bản"],
      status: "active"
    },
    {
      id: 3,
      fullName: "Phạm Văn Cường",
      age: 15,
      parentName: "Phạm Thị Lan",
      phone: "0965432178",
      classes: ["Bóng đá U15", "Võ thuật"],
      status: "inactive"
    },
    {
      id: 4,
      fullName: "Lê Thị Dung",
      age: 8,
      parentName: "Lê Văn Nam",
      phone: "0932178654",
      classes: ["Bơi lội cơ bản"],
      status: "active"
    },
    {
      id: 5,
      fullName: "Hoàng Văn Em",
      age: 14,
      parentName: "Hoàng Thị Thu",
      phone: "0976543210",
      classes: ["Võ thuật"],
      status: "active"
    }
  ];

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý học viên</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Thêm học viên</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách học viên</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm học viên..."
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
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Học viên</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Tuổi</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Phụ huynh</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Số điện thoại</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Lớp học</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`} 
                          alt={student.fullName} 
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <span className="font-medium">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{student.age}</td>
                    <td className="py-3 px-4">{student.parentName}</td>
                    <td className="py-3 px-4">{student.phone}</td>
                    <td className="py-3 px-4">
                      {student.classes.map((cls, index) => (
                        <span 
                          key={index} 
                          className="inline-block bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs mr-1 mb-1"
                        >
                          {cls}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                        student.status === 'active' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
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
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Không tìm thấy học viên phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;

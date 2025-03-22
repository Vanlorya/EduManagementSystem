import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lịch học & Đặt lịch</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Đặt lịch mới</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Ngày</label>
                <div className="mt-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="border rounded-md p-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Huấn luyện viên</label>
                <select className="w-full mt-2 p-2 border rounded-md">
                  <option value="">Tất cả huấn luyện viên</option>
                  <option>Nguyễn Văn Trung</option>
                  <option>Trần Minh Thắng</option>
                  <option>Lê Thu Hà</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Bộ môn</label>
                <select className="w-full mt-2 p-2 border rounded-md">
                  <option value="">Tất cả bộ môn</option>
                  <option>Bóng đá</option>
                  <option>Bơi lội</option>
                  <option>Võ thuật</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Địa điểm</label>
                <select className="w-full mt-2 p-2 border rounded-md">
                  <option value="">Tất cả địa điểm</option>
                  <option>Sân 1</option>
                  <option>Sân 2</option>
                  <option>Bể bơi</option>
                </select>
              </div>
              <Button className="w-full">Áp dụng</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar view */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lịch học</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Tháng {date.getMonth() + 1}, {date.getFullYear()}
              </div>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="border-l pl-2 ml-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Hôm nay
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Chức năng lịch học đang được phát triển. Vui lòng quay lại sau.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;

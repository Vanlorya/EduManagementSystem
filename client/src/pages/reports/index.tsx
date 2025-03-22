import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, Calendar, Download, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

// Sample data for charts
const sampleRevenueData = [
  { month: "T1", amount: 25000000 },
  { month: "T2", amount: 28000000 },
  { month: "T3", amount: 30000000 },
  { month: "T4", amount: 35000000 },
  { month: "T5", amount: 38000000 },
  { month: "T6", amount: 42000000 },
  { month: "T7", amount: 45000000 },
  { month: "T8", amount: 43000000 },
];

const sampleStudentData = [
  { month: "T1", count: 180 },
  { month: "T2", count: 195 },
  { month: "T3", count: 205 },
  { month: "T4", count: 220 },
  { month: "T5", count: 230 },
  { month: "T6", count: 240 },
  { month: "T7", count: 245 },
  { month: "T8", count: 250 },
];

const sampleSportCategoryData = [
  { name: "Bóng đá", students: 120, percentage: 48 },
  { name: "Bơi lội", students: 75, percentage: 30 },
  { name: "Võ thuật", students: 55, percentage: 22 },
];

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState("year");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Format currency in VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderBarChart = (data: any[], title: string, valueFormatter: (value: number) => string) => {
    // In a real app, we would use a proper charting library like recharts
    const maxValue = Math.max(...data.map(item => "amount" in item ? item.amount : item.count));
    
    return (
      <div className="pt-4">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <div className="space-y-2">
          {data.map((item, index) => {
            const value = "amount" in item ? item.amount : item.count;
            const percentage = (value / maxValue) * 100;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.month}</span>
                  <span>{valueFormatter(value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: any[], title: string) => {
    // In a real app, we would use a proper charting library like recharts
    const colors = ["#1E88E5", "#43A047", "#E53935"];
    
    return (
      <div className="pt-4">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <div className="flex flex-col space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-gray-500 ml-2">({item.students} học viên)</span>
              <div className="flex-grow"></div>
              <span className="text-sm font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm 2023</SelectItem>
              <SelectItem value="custom">Tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Tổng quan
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Doanh thu
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Học viên
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Lớp học
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Tổng doanh thu</CardTitle>
                <CardDescription>
                  Năm 2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold">{formatCurrency(320500000)}</span>
                  <div className="flex items-center text-success-600 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>12.5%</span>
                  </div>
                </div>
                {renderBarChart(sampleRevenueData, "Doanh thu theo tháng", formatCurrency)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Tổng học viên</CardTitle>
                <CardDescription>
                  Tăng trưởng năm 2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold">250</span>
                  <div className="flex items-center text-success-600 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>8.3%</span>
                  </div>
                </div>
                {renderBarChart(sampleStudentData, "Học viên theo tháng", value => `${value}`)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Phân bổ bộ môn</CardTitle>
                <CardDescription>
                  Theo số lượng học viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold pb-4">3 bộ môn</div>
                {renderPieChart(sampleSportCategoryData, "Tỷ lệ học viên theo bộ môn")}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Học viên mới gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <img 
                        src={`https://ui-avatars.com/api/?name=HV${index + 1}&background=random`}
                        alt={`Student ${index + 1}`}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium">Học viên {index + 1}</div>
                        <div className="text-xs text-gray-500">Đăng ký ngày {15 - index}/08/2023</div>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-block bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs">
                          Bóng đá U{10 + index * 2}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thanh toán gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-10 w-10 rounded-full mr-3 bg-gray-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">Thanh toán #{1000 + index}</div>
                        <div className="text-xs text-gray-500">Ngày {15 - index}/08/2023</div>
                      </div>
                      <div className="ml-auto">
                        <span className="font-medium">{formatCurrency(1500000 + index * 200000)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo doanh thu</CardTitle>
              <CardDescription>
                Đang phát triển...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Tính năng báo cáo doanh thu chi tiết đang được phát triển</p>
                <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo học viên</CardTitle>
              <CardDescription>
                Đang phát triển...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Tính năng báo cáo học viên chi tiết đang được phát triển</p>
                <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo lớp học</CardTitle>
              <CardDescription>
                Đang phát triển...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Tính năng báo cáo lớp học chi tiết đang được phát triển</p>
                <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;

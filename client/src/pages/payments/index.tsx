import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  // For a real implementation, we would fetch from the API
  const { data: payments, isLoading } = useQuery({
    queryKey: ['/api/payments'],
    placeholderData: [
      {
        id: 1,
        userId: 1,
        bookingId: 1,
        amount: 1500000,
        paymentMethod: "momo",
        status: "completed",
        transactionId: "MO123456789",
        createdAt: "2023-08-15T08:30:00Z",
        user: {
          id: 1,
          fullName: "Nguyễn Văn A",
          email: "nguyenvana@example.com"
        },
        booking: {
          id: 1,
          classId: 1,
          class: {
            name: "Bóng đá U10",
            price: 1500000
          }
        }
      },
      {
        id: 2,
        userId: 2,
        bookingId: 2,
        amount: 2000000,
        paymentMethod: "bank_transfer",
        status: "completed",
        transactionId: "BT987654321",
        createdAt: "2023-08-14T14:15:00Z",
        user: {
          id: 2,
          fullName: "Trần Văn B",
          email: "tranvanb@example.com"
        },
        booking: {
          id: 2,
          classId: 2,
          class: {
            name: "Bóng đá U15",
            price: 2000000
          }
        }
      },
      {
        id: 3,
        userId: 3,
        bookingId: 3,
        amount: 1800000,
        paymentMethod: "zalopay",
        status: "pending",
        transactionId: "ZP567890123",
        createdAt: "2023-08-15T09:45:00Z",
        user: {
          id: 3,
          fullName: "Lê Thị C",
          email: "lethic@example.com"
        },
        booking: {
          id: 3,
          classId: 3,
          class: {
            name: "Bơi lội cơ bản",
            price: 1800000
          }
        }
      },
      {
        id: 4,
        userId: 4,
        bookingId: 4,
        amount: 2200000,
        paymentMethod: "cash",
        status: "completed",
        transactionId: null,
        createdAt: "2023-08-13T16:20:00Z",
        user: {
          id: 4,
          fullName: "Phạm Văn D",
          email: "phamvand@example.com"
        },
        booking: {
          id: 4,
          classId: 4,
          class: {
            name: "Võ thuật",
            price: 2200000
          }
        }
      },
      {
        id: 5,
        userId: 5,
        bookingId: 5,
        amount: 1500000,
        paymentMethod: "credit_card",
        status: "failed",
        transactionId: "CC345678901",
        createdAt: "2023-08-14T11:10:00Z",
        user: {
          id: 5,
          fullName: "Hoàng Thị E",
          email: "hoangthie@example.com"
        },
        booking: {
          id: 5,
          classId: 1,
          class: {
            name: "Bóng đá U10",
            price: 1500000
          }
        }
      }
    ]
  });

  // Format currency in VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date in Vietnamese format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case "momo":
        return "MoMo";
      case "zalopay":
        return "ZaloPay";
      case "bank_transfer":
        return "Chuyển khoản";
      case "cash":
        return "Tiền mặt";
      case "credit_card":
        return "Thẻ tín dụng";
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-success-100 text-success-800 hover:bg-success-200">
            Hoàn tất
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-primary-100 text-primary-800 hover:bg-primary-200">
            Đang xử lý
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-error-100 text-error-800 hover:bg-error-200">
            Thất bại
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline" className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200">
            Hoàn tiền
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Apply filters
  const filteredPayments = payments?.filter(payment => {
    // Search filter
    const searchMatch = 
      payment.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.booking.class.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const statusMatch = statusFilter === "all" || payment.status === statusFilter;
    
    // Date filter (simplified, would be more complex in a real app)
    let dateMatch = true;
    const paymentDate = new Date(payment.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateFilter === "today") {
      dateMatch = paymentDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      dateMatch = paymentDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === "week") {
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateMatch = paymentDate >= lastWeek;
    } else if (dateFilter === "month") {
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      dateMatch = paymentDate >= lastMonth;
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

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
        <h1 className="text-2xl font-bold">Quản lý thanh toán</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Tạo thanh toán</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử thanh toán</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm thanh toán..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Hoàn tất</SelectItem>
                <SelectItem value="pending">Đang xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="refunded">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="yesterday">Hôm qua</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
              </SelectContent>
            </Select>
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
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Mã</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Học viên</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Lớp học</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Số tiền</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Phương thức</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Thời gian</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments?.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">#{payment.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(payment.user.fullName)}&background=random`} 
                          alt={payment.user.fullName} 
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <div className="font-medium">{payment.user.fullName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{payment.booking.class.name}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 px-4">
                      <span 
                        className="inline-block rounded-full px-2 py-1 text-xs bg-gray-100 text-gray-800"
                      >
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(payment.createdAt)}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments?.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Không tìm thấy thanh toán phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;

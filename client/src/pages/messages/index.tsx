import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Mail, MessageSquare, Send, Tag, Users, Trash, Edit, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // For a real implementation, we would fetch from the API
  const { data: messages, isLoading } = useQuery({
    queryKey: ['/api/messages'],
    placeholderData: [
      {
        id: 1,
        type: "email",
        subject: "Lớp học bóng đá U10 sắp khai giảng",
        content: "Kính gửi Quý phụ huynh, Trung tâm xin thông báo lớp học bóng đá U10 sẽ khai giảng vào ngày 20/08/2023...",
        recipientCount: 45,
        sentAt: "2023-08-15T09:30:00Z",
        status: "sent",
        category: "announcement"
      },
      {
        id: 2,
        type: "sms",
        subject: "Nhắc lịch học ngày mai",
        content: "EDUSPORT: Nhắc lịch học bơi lội ngày mai (16/08) lúc 15:00. Vui lòng đến sớm 15 phút để chuẩn bị.",
        recipientCount: 18,
        sentAt: "2023-08-15T10:15:00Z",
        status: "sent",
        category: "reminder"
      },
      {
        id: 3,
        type: "email",
        subject: "Chương trình khuyến mãi mùa hè",
        content: "Kính gửi Quý phụ huynh, Nhân dịp hè 2023, trung tâm có chương trình ưu đãi giảm 15% học phí...",
        recipientCount: 120,
        sentAt: "2023-08-10T08:45:00Z",
        status: "sent",
        category: "promotion"
      },
      {
        id: 4,
        type: "sms",
        subject: "Mã giảm giá SUMMER2023",
        content: "EDUSPORT: Quý phụ huynh có thể sử dụng mã SUMMER2023 để được giảm 500.000đ khi đăng ký các lớp hè.",
        recipientCount: 200,
        sentAt: "2023-08-05T14:20:00Z",
        status: "sent",
        category: "promotion"
      },
      {
        id: 5,
        type: "email",
        subject: "Thông báo lịch nghỉ lễ",
        content: "Kính gửi Quý phụ huynh, Trung tâm xin thông báo lịch nghỉ lễ Quốc khánh 2/9 như sau...",
        recipientCount: 245,
        sentAt: "2023-08-20T11:00:00Z",
        status: "scheduled",
        category: "announcement"
      },
      {
        id: 6,
        type: "email",
        subject: "Mời tham gia giải đấu bóng đá tháng 9",
        content: "Kính gửi Quý phụ huynh, Trung tâm tổ chức giải đấu bóng đá \"Cúp tương lai\" vào tháng 9/2023...",
        recipientCount: 0,
        sentAt: null,
        status: "draft",
        category: "event"
      }
    ]
  });

  // Format date in Vietnamese format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa gửi";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeIcon = (type: string) => {
    switch(type) {
      case "email":
        return <Mail className="h-4 w-4 mr-1" />;
      case "sms":
        return <MessageSquare className="h-4 w-4 mr-1" />;
      default:
        return <Mail className="h-4 w-4 mr-1" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case "announcement":
        return (
          <Badge variant="outline" className="bg-primary-100 text-primary-800 hover:bg-primary-200">
            Thông báo
          </Badge>
        );
      case "reminder":
        return (
          <Badge variant="outline" className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200">
            Nhắc lịch
          </Badge>
        );
      case "promotion":
        return (
          <Badge variant="outline" className="bg-success-100 text-success-800 hover:bg-success-200">
            <Tag className="h-3 w-3 mr-1" /> Khuyến mãi
          </Badge>
        );
      case "event":
        return (
          <Badge variant="outline" className="bg-error-100 text-error-800 hover:bg-error-200">
            <Calendar className="h-3 w-3 mr-1" /> Sự kiện
          </Badge>
        );
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "sent":
        return (
          <Badge variant="outline" className="bg-success-100 text-success-800 hover:bg-success-200">
            <Send className="h-3 w-3 mr-1" /> Đã gửi
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-primary-100 text-primary-800 hover:bg-primary-200">
            <Calendar className="h-3 w-3 mr-1" /> Đã lên lịch
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Bản nháp
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Apply filters
  const filteredMessages = messages?.filter(message => {
    // Type filter from tab
    const typeMatch = activeTab === "all" || message.type === activeTab;
    
    // Search filter
    const searchMatch = 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === "all" || message.status === statusFilter;
    
    return typeMatch && searchMatch && statusMatch;
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
        <h1 className="text-2xl font-bold">Email & SMS</h1>
        <div className="flex space-x-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Tạo thông báo mới</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Quản lý thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center">
                  <Users className="h-4 w-4 mr-1" /> Tất cả
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" /> Email
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> SMS
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm thông báo..."
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
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="sent">Đã gửi</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Loại</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Tiêu đề</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Danh mục</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Người nhận</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Thời gian gửi</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages?.map((message) => (
                      <tr key={message.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Badge variant={message.type === "email" ? "default" : "secondary"} className="capitalize">
                              {getMessageTypeIcon(message.type)} {message.type}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="truncate font-medium">{message.subject}</div>
                          <div className="truncate text-xs text-gray-500">{message.content}</div>
                        </td>
                        <td className="py-3 px-4">
                          {getCategoryBadge(message.category)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="bg-gray-100">
                            <Users className="h-3 w-3 mr-1" /> {message.recipientCount}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm">{formatDate(message.sentAt)}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(message.status)}
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
            </TabsContent>
            
            <TabsContent value="email" className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Tiêu đề</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Danh mục</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Người nhận</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Thời gian gửi</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages?.map((message) => (
                      <tr key={message.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 max-w-xs">
                          <div className="truncate font-medium">{message.subject}</div>
                          <div className="truncate text-xs text-gray-500">{message.content}</div>
                        </td>
                        <td className="py-3 px-4">
                          {getCategoryBadge(message.category)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="bg-gray-100">
                            <Users className="h-3 w-3 mr-1" /> {message.recipientCount}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm">{formatDate(message.sentAt)}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(message.status)}
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
            </TabsContent>
            
            <TabsContent value="sms" className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Nội dung</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Danh mục</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Người nhận</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Thời gian gửi</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages?.map((message) => (
                      <tr key={message.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 max-w-xs">
                          <div className="truncate text-sm">{message.content}</div>
                        </td>
                        <td className="py-3 px-4">
                          {getCategoryBadge(message.category)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="bg-gray-100">
                            <Users className="h-3 w-3 mr-1" /> {message.recipientCount}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm">{formatDate(message.sentAt)}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(message.status)}
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
            </TabsContent>
          </Tabs>
          
          {filteredMessages?.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Không tìm thấy thông báo phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage;

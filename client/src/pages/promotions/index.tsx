import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Copy, Edit, Trash, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const PromotionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const { toast } = useToast();
  
  // For a real implementation, we would fetch from the API
  const { data: promotions, isLoading } = useQuery({
    queryKey: ['/api/promotions'],
    placeholderData: [
      {
        id: 1,
        code: "WELCOME2023",
        discountPercent: 10,
        discountAmount: null,
        startDate: "2023-08-01T00:00:00Z",
        endDate: "2023-09-30T23:59:59Z",
        maxUses: 100,
        useCount: 45,
        sportCategoryId: null,
        description: "Giảm 10% cho học viên mới đăng ký",
        active: true,
        sportCategory: null
      },
      {
        id: 2,
        code: "SUMMER500K",
        discountPercent: null,
        discountAmount: 500000,
        startDate: "2023-06-01T00:00:00Z",
        endDate: "2023-08-31T23:59:59Z",
        maxUses: 50,
        useCount: 32,
        sportCategoryId: null,
        description: "Giảm 500.000đ cho khóa học hè",
        active: true,
        sportCategory: null
      },
      {
        id: 3,
        code: "FOOTBALL15",
        discountPercent: 15,
        discountAmount: null,
        startDate: "2023-07-15T00:00:00Z",
        endDate: "2023-10-15T23:59:59Z",
        maxUses: 30,
        useCount: 12,
        sportCategoryId: 1,
        description: "Giảm 15% cho lớp bóng đá",
        active: true,
        sportCategory: {
          id: 1,
          name: "Bóng đá",
          color: "#1E88E5"
        }
      },
      {
        id: 4,
        code: "REFERFRIEND",
        discountPercent: 5,
        discountAmount: null,
        startDate: "2023-01-01T00:00:00Z",
        endDate: "2023-12-31T23:59:59Z",
        maxUses: 200,
        useCount: 87,
        sportCategoryId: null,
        description: "Giảm 5% khi giới thiệu bạn",
        active: true,
        sportCategory: null
      },
      {
        id: 5,
        code: "SWIM300K",
        discountPercent: null,
        discountAmount: 300000,
        startDate: "2023-05-01T00:00:00Z",
        endDate: "2023-07-31T23:59:59Z",
        maxUses: 40,
        useCount: 40,
        sportCategoryId: 2,
        description: "Giảm 300.000đ cho lớp bơi lội",
        active: false,
        sportCategory: {
          id: 2,
          name: "Bơi lội",
          color: "#43A047"
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
      year: 'numeric'
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {
        toast({
          title: "Đã sao chép",
          description: `Mã ${code} đã được sao chép vào clipboard.`,
        });
      },
      (err) => {
        toast({
          title: "Lỗi khi sao chép",
          description: "Không thể sao chép mã.",
          variant: "destructive",
        });
      }
    );
  };

  // Calculate progress
  const calculateProgress = (used: number, max: number | null) => {
    if (!max) return 0;
    return Math.min(100, Math.round((used / max) * 100));
  };

  // Check if promotion is expired
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Apply filters
  const filteredPromotions = promotions?.filter(promo => {
    // Search filter
    const searchMatch = 
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.sportCategory && promo.sportCategory.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Active filter
    const activeMatch = !showActiveOnly || promo.active;
    
    return searchMatch && activeMatch;
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
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Tạo khuyến mãi</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách mã khuyến mãi</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active-only"
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
              />
              <label htmlFor="active-only" className="text-sm">Chỉ hiện đang kích hoạt</label>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm khuyến mãi..."
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
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Mã khuyến mãi</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Mô tả</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Giảm giá</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Bộ môn</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Thời hạn</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Sử dụng</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions?.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono mr-2">
                          {promo.code}
                        </code>
                        <button 
                          className="text-gray-400 hover:text-gray-600" 
                          onClick={() => copyToClipboard(promo.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">{promo.description}</td>
                    <td className="py-3 px-4">
                      {promo.discountPercent ? `${promo.discountPercent}%` : 
                       promo.discountAmount ? formatCurrency(promo.discountAmount) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {promo.sportCategory ? (
                        <span 
                          className="inline-block rounded-full px-2 py-1 text-xs"
                          style={{ 
                            backgroundColor: `${promo.sportCategory.color}20`, 
                            color: promo.sportCategory.color 
                          }}
                        >
                          {promo.sportCategory.name}
                        </span>
                      ) : (
                        <span className="text-gray-500">Tất cả</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${calculateProgress(promo.useCount, promo.maxUses)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1 text-gray-500">
                        {promo.useCount}/{promo.maxUses || "∞"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {promo.active ? (
                        isExpired(promo.endDate) ? (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            Hết hạn
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success-100 text-success-800">
                            <Check className="h-3 w-3 mr-1" /> Kích hoạt
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          Tạm dừng
                        </Badge>
                      )}
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
          
          {filteredPromotions?.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Không tìm thấy mã khuyến mãi phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsPage;

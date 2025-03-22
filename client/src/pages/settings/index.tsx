import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, Globe, Lock, Bell, CreditCard, User, Settings, Save } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [centerName, setCenterName] = useState("EduSport - Trung tâm Thể thao");
  const [email, setEmail] = useState("contact@edusport.vn");
  const [phone, setPhone] = useState("0987654321");
  const [address, setAddress] = useState("123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM");
  const [logo, setLogo] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  
  // User settings
  const [defaultRole, setDefaultRole] = useState("student");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  
  // Payment settings
  const [currency, setCurrency] = useState("VND");
  const [momoEnabled, setMomoEnabled] = useState(true);
  const [zaloPayEnabled, setZaloPayEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(true);
  const [bankAccount, setBankAccount] = useState("Ngân hàng VCB - STK: 0123456789 - CTK: EDUSPORT");
  
  // Language settings
  const [defaultLanguage, setDefaultLanguage] = useState("vi");
  const [supportedLanguages, setSupportedLanguages] = useState(["vi", "en"]);

  const handleSaveSettings = () => {
    // In a real app, this would send the settings to the API
    toast({
      title: "Cài đặt đã được lưu",
      description: "Các thay đổi của bạn đã được lưu thành công.",
      action: (
        <div className="h-8 w-8 bg-success-500 rounded-full flex items-center justify-center text-white">
          <Check className="h-4 w-4" />
        </div>
      ),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
        <Button className="flex items-center gap-2" onClick={handleSaveSettings}>
          <Save className="h-4 w-4" />
          <span>Lưu cài đặt</span>
        </Button>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Tổng quan
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Thông báo
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Người dùng
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Thanh toán
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Ngôn ngữ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt tổng quan</CardTitle>
              <CardDescription>
                Quản lý thông tin cơ bản của trung tâm thể thao
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Tên trung tâm</Label>
                  <Input 
                    id="centerName" 
                    value={centerName} 
                    onChange={(e) => setCenterName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input 
                    id="logo" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setLogo(e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea 
                    id="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý cách thức gửi thông báo cho học viên và phụ huynh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">Thông báo qua Email</Label>
                    <p className="text-sm text-gray-500">Gửi thông báo qua email đến học viên và phụ huynh</p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="font-medium">Thông báo qua SMS</Label>
                    <p className="text-sm text-gray-500">Gửi thông báo qua tin nhắn SMS</p>
                  </div>
                  <Switch 
                    id="smsNotifications" 
                    checked={smsNotifications} 
                    onCheckedChange={setSmsNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bookingNotifications" className="font-medium">Thông báo đặt lịch</Label>
                    <p className="text-sm text-gray-500">Gửi thông báo khi có đăng ký lớp học mới</p>
                  </div>
                  <Switch 
                    id="bookingNotifications" 
                    checked={bookingNotifications} 
                    onCheckedChange={setBookingNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentNotifications" className="font-medium">Thông báo thanh toán</Label>
                    <p className="text-sm text-gray-500">Gửi thông báo khi có thanh toán mới hoặc thanh toán quá hạn</p>
                  </div>
                  <Switch 
                    id="paymentNotifications" 
                    checked={paymentNotifications} 
                    onCheckedChange={setPaymentNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminderNotifications" className="font-medium">Nhắc lịch học</Label>
                    <p className="text-sm text-gray-500">Gửi nhắc nhở trước khi lớp học diễn ra</p>
                  </div>
                  <Switch 
                    id="reminderNotifications" 
                    checked={reminderNotifications} 
                    onCheckedChange={setReminderNotifications} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt người dùng</CardTitle>
              <CardDescription>
                Quản lý tài khoản người dùng và quyền truy cập
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultRole">Vai trò mặc định cho người dùng mới</Label>
                  <Select value={defaultRole} onValueChange={setDefaultRole}>
                    <SelectTrigger id="defaultRole">
                      <SelectValue placeholder="Chọn vai trò mặc định" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Học viên</SelectItem>
                      <SelectItem value="parent">Phụ huynh</SelectItem>
                      <SelectItem value="instructor">Huấn luyện viên</SelectItem>
                      <SelectItem value="staff">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationOpen" className="font-medium">Cho phép đăng ký mới</Label>
                    <p className="text-sm text-gray-500">Cho phép người dùng đăng ký tài khoản mới trên hệ thống</p>
                  </div>
                  <Switch 
                    id="registrationOpen" 
                    checked={registrationOpen} 
                    onCheckedChange={setRegistrationOpen} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireApproval" className="font-medium">Yêu cầu phê duyệt</Label>
                    <p className="text-sm text-gray-500">Yêu cầu quản trị viên phê duyệt tài khoản mới trước khi kích hoạt</p>
                  </div>
                  <Switch 
                    id="requireApproval" 
                    checked={requireApproval} 
                    onCheckedChange={setRequireApproval} 
                  />
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Quản lý phân quyền</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thanh toán</CardTitle>
              <CardDescription>
                Quản lý các phương thức thanh toán và tích hợp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                      <SelectItem value="USD">USD - Đô la Mỹ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="momoEnabled" className="font-medium">Thanh toán MoMo</Label>
                    <p className="text-sm text-gray-500">Cho phép thanh toán qua ví điện tử MoMo</p>
                  </div>
                  <Switch 
                    id="momoEnabled" 
                    checked={momoEnabled} 
                    onCheckedChange={setMomoEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="zaloPayEnabled" className="font-medium">Thanh toán ZaloPay</Label>
                    <p className="text-sm text-gray-500">Cho phép thanh toán qua ví điện tử ZaloPay</p>
                  </div>
                  <Switch 
                    id="zaloPayEnabled" 
                    checked={zaloPayEnabled} 
                    onCheckedChange={setZaloPayEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bankTransferEnabled" className="font-medium">Chuyển khoản ngân hàng</Label>
                    <p className="text-sm text-gray-500">Cho phép thanh toán qua chuyển khoản ngân hàng</p>
                  </div>
                  <Switch 
                    id="bankTransferEnabled" 
                    checked={bankTransferEnabled} 
                    onCheckedChange={setBankTransferEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cashEnabled" className="font-medium">Tiền mặt</Label>
                    <p className="text-sm text-gray-500">Cho phép thanh toán bằng tiền mặt tại trung tâm</p>
                  </div>
                  <Switch 
                    id="cashEnabled" 
                    checked={cashEnabled} 
                    onCheckedChange={setCashEnabled} 
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="bankAccount">Thông tin chuyển khoản</Label>
                  <Textarea 
                    id="bankAccount"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Nhập thông tin tài khoản ngân hàng"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt ngôn ngữ</CardTitle>
              <CardDescription>
                Quản lý ngôn ngữ hiển thị trên hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Ngôn ngữ mặc định</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue placeholder="Chọn ngôn ngữ mặc định" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">Ngôn ngữ được hỗ trợ</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lang-vi"
                        checked={supportedLanguages.includes('vi')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSupportedLanguages([...supportedLanguages, 'vi']);
                          } else {
                            setSupportedLanguages(supportedLanguages.filter(lang => lang !== 'vi'));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="lang-vi">Tiếng Việt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lang-en"
                        checked={supportedLanguages.includes('en')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSupportedLanguages([...supportedLanguages, 'en']);
                          } else {
                            setSupportedLanguages(supportedLanguages.filter(lang => lang !== 'en'));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="lang-en">English</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Quản lý bản dịch</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

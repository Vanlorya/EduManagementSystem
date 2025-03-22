import { useQuery } from "@tanstack/react-query";

// Define the booking types
interface Booking {
  id: number;
  userId: number;
  status: "confirmed" | "pending_payment" | "new";
  user: {
    id: number;
    fullName: string;
  };
  class: {
    id: number;
    name: string;
    ageGroup: string;
  };
  schedule: {
    startTime: string;
  };
}

// Sample data - this would be replaced with API data
const sampleBookings: Booking[] = [
  {
    id: 1,
    userId: 1,
    status: "confirmed",
    user: {
      id: 1,
      fullName: "Nguyễn Văn A",
    },
    class: {
      id: 1,
      name: "Bóng đá",
      ageGroup: "U10",
    },
    schedule: {
      startTime: "16:00",
    }
  },
  {
    id: 2,
    userId: 2,
    status: "pending_payment",
    user: {
      id: 2,
      fullName: "Trần Văn B",
    },
    class: {
      id: 1,
      name: "Bóng đá",
      ageGroup: "U15",
    },
    schedule: {
      startTime: "16:00",
    }
  },
  {
    id: 3,
    userId: 3,
    status: "confirmed",
    user: {
      id: 3,
      fullName: "Lê Thị C",
    },
    class: {
      id: 2,
      name: "Bơi lội",
      ageGroup: "",
    },
    schedule: {
      startTime: "09:00",
    }
  },
  {
    id: 4,
    userId: 4,
    status: "new",
    user: {
      id: 4,
      fullName: "Phạm Văn D",
    },
    class: {
      id: 3,
      name: "Võ thuật",
      ageGroup: "",
    },
    schedule: {
      startTime: "15:00",
    }
  }
];

const getStatusBadgeClasses = (status: string) => {
  switch(status) {
    case "confirmed":
      return "bg-success-100 text-success-800";
    case "pending_payment":
      return "bg-error-100 text-error-800";
    case "new":
      return "bg-primary-100 text-primary-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch(status) {
    case "confirmed":
      return "Đã xác nhận";
    case "pending_payment":
      return "Chờ thanh toán";
    case "new":
      return "Mới đăng ký";
    default:
      return status;
  }
};

const RecentBookings: React.FC = () => {
  // In a real app, this would fetch from the API
  // const { data: bookings, isLoading } = useQuery({ 
  //   queryKey: ['/api/bookings/recent'], 
  // });

  // Using sample data for now
  const bookings = sampleBookings;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Đăng ký gần đây</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Đăng ký gần đây</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Xem tất cả
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user.fullName)}&background=random`} 
                    alt={booking.user.fullName} 
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium">{booking.user.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {booking.class.name} 
                      {booking.class.ageGroup && ` ${booking.class.ageGroup}`} 
                      {` - ${booking.schedule.startTime}`}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentBookings;

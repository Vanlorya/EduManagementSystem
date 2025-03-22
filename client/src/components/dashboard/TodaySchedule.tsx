import { useState } from "react";
import { MoreVertical } from "lucide-react";
import ScheduleEvent from "./ScheduleEvent";

// Sample data - In a real app this would come from an API
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const sportFilters = ["Tất cả", "Bóng đá", "Bơi lội", "Võ thuật"];

interface ScheduleItem {
  id: number;
  title: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  students: number;
  sportType: string;
  position: "start" | "middle" | "end";
  color: "blue" | "orange";
}

// Sample schedule data
const sampleSchedule: ScheduleItem[] = [
  {
    id: 1,
    title: "Bóng đá U10",
    timeStart: "08:00",
    timeEnd: "09:00",
    location: "Sân 1 - HLV Trung",
    students: 12,
    sportType: "Bóng đá",
    position: "start",
    color: "blue"
  },
  {
    id: 2,
    title: "Bóng đá U12",
    timeStart: "10:00",
    timeEnd: "11:00",
    location: "Sân 2 - HLV Minh",
    students: 15,
    sportType: "Bóng đá",
    position: "middle",
    color: "orange"
  },
  {
    id: 3,
    title: "Bóng đá U10",
    timeStart: "14:00",
    timeEnd: "15:00",
    location: "Sân 1 - HLV Trung",
    students: 10,
    sportType: "Bóng đá",
    position: "end",
    color: "blue"
  },
  {
    id: 4,
    title: "Bóng đá U15",
    timeStart: "16:00",
    timeEnd: "17:30",
    location: "Sân 2 - HLV Thắng",
    students: 18,
    sportType: "Bóng đá",
    position: "start",
    color: "orange"
  }
];

const TodaySchedule: React.FC = () => {
  const [activeSport, setActiveSport] = useState("Bóng đá");
  const [scheduleItems, setScheduleItems] = useState(sampleSchedule);

  // Filter items by sport
  const filteredItems = activeSport === "Tất cả" 
    ? scheduleItems 
    : scheduleItems.filter(item => item.sportType === activeSport);

  // Format date
  const today = new Date();
  const dateStr = today.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleSportFilter = (sport: string) => {
    setActiveSport(sport);
  };

  return (
    <div className="bg-white rounded-lg shadow col-span-1 lg:col-span-2">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Lịch hôm nay</h2>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Ngày {dateStr}
            </span>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex mb-4">
          <div className="flex space-x-1">
            {sportFilters.map((sport, index) => (
              <button
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  sport === activeSport 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleSportFilter(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
        
        {/* Time slots grid */}
        <div className="grid grid-cols-12 gap-2">
          {/* Time labels */}
          <div className="col-span-1">
            {timeSlots.map((time, index) => (
              <div key={index} className="h-16 flex items-start justify-end pr-2 text-xs text-gray-500">
                {time}
              </div>
            ))}
          </div>
          
          {/* Schedule grid */}
          <div className="col-span-11 border-l border-gray-200">
            {/* Rows for each time slot */}
            {timeSlots.map((time, index) => {
              // Find events that start at this time
              const eventsAtThisTime = filteredItems.filter(
                item => item.timeStart === time
              );
              
              return (
                <div key={index} className="h-16 border-b border-gray-100 relative">
                  {eventsAtThisTime.map(event => (
                    <ScheduleEvent
                      key={event.id}
                      title={event.title}
                      timeRange={`${event.timeStart} - ${event.timeEnd}`}
                      location={event.location}
                      students={event.students}
                      color={event.color}
                      position={event.position}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;

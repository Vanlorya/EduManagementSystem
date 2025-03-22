interface ScheduleEventProps {
  title: string;
  timeRange: string;
  location: string;
  students: number;
  color: "blue" | "orange";
  position: "start" | "middle" | "end";
}

const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  title,
  timeRange,
  location,
  students,
  color = "blue",
  position = "start"
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-primary-100",
      border: "border-primary-500",
      text: "text-primary-800"
    },
    orange: {
      bg: "bg-secondary-100",
      border: "border-secondary-500",
      text: "text-secondary-800"
    }
  };

  const getPositionClass = () => {
    if (position === "start") {
      return "absolute left-0 top-0";
    } else if (position === "middle") {
      return "absolute left-1/3 top-0";
    } else {
      return "absolute left-2/3 top-0";
    }
  };

  return (
    <div className={`${getPositionClass()} h-full w-1/3 ${colorClasses[color].bg} border-l-4 ${colorClasses[color].border} rounded-r-md p-2`}>
      <div className="flex justify-between">
        <span className={`text-xs font-medium ${colorClasses[color].text}`}>{title}</span>
        <span className="text-xs text-gray-500">{timeRange}</span>
      </div>
      <div className="text-xs mt-1">{location}</div>
      <div className="text-xs text-gray-500">{students} học viên</div>
    </div>
  );
};

export default ScheduleEvent;

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  helpText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change = 0, helpText }) => {
  const formatChange = (value: number) => {
    return `${Math.abs(value)}%`;
  };

  const getChangeIcon = () => {
    if (change > 0) {
      return (
        <span className="flex items-center text-success-500 text-sm font-medium">
          <TrendingUp className="h-4 w-4 mr-1" />
          {formatChange(change)}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center text-error-500 text-sm font-medium">
          <TrendingDown className="h-4 w-4 mr-1" />
          {formatChange(change)}
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-500 text-sm font-medium">
          <Minus className="h-4 w-4 mr-1" />
          0%
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {getChangeIcon()}
      </div>
      <p className="text-3xl font-bold mt-4 mb-2">{value}</p>
      {helpText && <div className="text-sm text-gray-500">{helpText}</div>}
    </div>
  );
};

export default StatCard;

"use client";

import {
  InkeepEmbeddedChat,
  type InkeepEmbeddedChatProps,
} from "@inkeep/cxkit-react-oss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const embeddedChatProps: InkeepEmbeddedChatProps = {
    aiChatSettings: {
      graphUrl: "http://localhost:3003/api/chat",
      headers: {
        tz: "US/Pacific",
      },
      apiKey: "sk_kKSyiGiD0F8x.bO9Ts0OpY5BWZdw_XV1lf44aDDwmSakncrBKjeVu-pg",
      components: {
        "Temperature data": TemperatureList,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Weather Assistant
            </h1>
            <p className="text-gray-600">
              Ask me anything about weather data and temperature forecasts
            </p>
          </div>
          
          {/* <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"> */}
            <InkeepEmbeddedChat {...embeddedChatProps} />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

const TemperatureList = ({ temperature_data }: { temperature_data: any }) => {
  const getWeatherIcon = (weatherCode: number) => {
    switch (weatherCode) {
      case 0:
        return "☀️"; // Sunny
      case 1:
        return "☀️"; // Mainly sunny
      case 2:
        return "⛅"; // Partly cloudy
      case 3:
        return "☁️"; // Cloudy
      case 4:
        return "🌧️"; // Rainy
      case 5:
        return "⛈️"; // Stormy
      default:
        return "🌤️"; // Default
    }
  };

  const getWeatherDescription = (weatherCode: number) => {
    switch (weatherCode) {
      case 0:
        return "Sunny";
      case 1:
        return "Mainly sunny";
      case 2:
        return "Partly Cloudy";
      case 3:
        return "Cloudy";
      case 4:
        return "Rainy";
      case 5:
        return "Stormy";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    });
  };

  // Prepare data for the chart
  const chartData = temperature_data.map((datapoint: any) => ({
    date: formatDate(datapoint.date),
    temperature: Math.round(datapoint.temperature),
    weather_code: datapoint.weather_code,
    fullDate: datapoint.date,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">
            Temperature: {data.temperature}°F
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            {getWeatherIcon(data.weather_code)}{" "}
            {getWeatherDescription(data.weather_code)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 max-w-4xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        🌡️ Temperature Forecast
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              label={{
                value: "Temperature (°F)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '@/lib/types';

interface DataVisualizationProps {
  data: ChartData;
  chartType?: 'line' | 'bar' | 'area';
  height?: number;
  xAxisKey?: string;
  columnsToPlot?: string[];
  customColors?: Record<string, string>;
  customLabels?: Record<string, string>;
  yAxisLabel?: string;
}

export default function DataVisualization({
  data,
  chartType = 'line',
  height = 400,
  xAxisKey = 'date',
  columnsToPlot,
  customColors = {},
  customLabels = {},
  yAxisLabel,
}: DataVisualizationProps) {
  if (!data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Determine which columns to plot
  const allKeys = Object.keys(data.data[0]).filter((key) => key !== xAxisKey && key !== 'country');
  const dataKeys = columnsToPlot || allKeys;
  
  // Determine y-axis label: use provided label, or default to '%' unless plotting urate_gap
  const yLabel = yAxisLabel || (dataKeys.includes('urate_gap') ? 'pp' : '%');

  const renderChart = () => {
    const commonProps = {
      data: data.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={customLabels[key] || key}
                fill={customColors[key] || `hsl(${(dataKeys.indexOf(key) * 360) / dataKeys.length}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={customLabels[key] || key}
                stroke={customColors[key] || `hsl(${(dataKeys.indexOf(key) * 360) / dataKeys.length}, 70%, 50%)`}
                fill={customColors[key] || `hsl(${(dataKeys.indexOf(key) * 360) / dataKeys.length}, 70%, 50%)`}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={customLabels[key] || key}
                stroke={customColors[key] || `hsl(${(dataKeys.indexOf(key) * 360) / dataKeys.length}, 70%, 50%)`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}


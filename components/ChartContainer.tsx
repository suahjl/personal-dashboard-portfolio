'use client';

import DataVisualization from './DataVisualization';
import { ChartData } from '@/lib/types';

interface ChartContainerProps {
  data: ChartData;
  title?: string;
  chartType?: 'line' | 'bar' | 'area';
  xAxisKey?: string;
  columnsToPlot?: string[];
  customColors?: Record<string, string>;
  customLabels?: Record<string, string>;
  selectedChartType?: 'urate-line' | 'urate-gap';
}

export default function ChartContainer({
  data,
  title,
  chartType = 'line',
  xAxisKey = 'date',
  columnsToPlot,
  customColors,
  customLabels,
  selectedChartType = 'urate-line',
}: ChartContainerProps) {
  // Determine actual chart type and columns based on selection
  const actualChartType = selectedChartType === 'urate-gap' ? 'area' : 'line';
  const actualColumnsToPlot = selectedChartType === 'urate-gap' 
    ? ['urate_gap'] 
    : columnsToPlot;

  const handleDownload = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        Object.keys(data.data[0]).join(','),
        ...data.data.map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>

      <DataVisualization 
          data={data} 
          chartType={actualChartType}
          xAxisKey={xAxisKey}
          columnsToPlot={actualColumnsToPlot}
          customColors={selectedChartType === 'urate-gap' ? { urate_gap: customColors?.urate_gap || '#FF7F50' } : customColors}
          customLabels={selectedChartType === 'urate-gap' ? { urate_gap: 'U-rate gap' } : customLabels}
        />

      {data.metadata && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-1">
            {data.metadata.source && (
              <p>
                <span className="font-medium">Source:</span> {data.metadata.source}
              </p>
            )}
            {data.metadata.lastUpdated && (
              <p>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(data.metadata.lastUpdated).toLocaleDateString()}
              </p>
            )}
            {data.metadata.description && (
              <p>
                <span className="font-medium">Description:</span>{' '}
                {data.metadata.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


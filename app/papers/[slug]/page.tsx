'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ChartContainer from '@/components/ChartContainer';
import { ChartData } from '@/lib/types';
import { fetchDashboardData } from '@/lib/data-fetcher';

export default function PaperDataPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch data for this specific paper
        // You can customize the source based on the slug
        const chartData = await fetchDashboardData(`paper-${slug}`);
        setData(chartData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paper Data: {slug}
        </h1>
        <p className="text-gray-600">
          Data visualizations and analysis from this research paper
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {data && !loading && (
        <ChartContainer
          data={data}
          title={`Data from ${slug}`}
          chartType="line"
        />
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          About This Data
        </h3>
        <p className="text-gray-700 text-sm">
          This page displays data visualizations related to the paper. You can
          customize the data source in the API route based on the paper slug.
        </p>
      </div>
    </div>
  );
}


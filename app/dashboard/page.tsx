'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ChartContainer from '@/components/ChartContainer';
import { ChartData } from '@/lib/types';
import axios from 'axios';

interface CountryFile {
  filename: string;
  country: string;
  countryKey?: string;
  downloadUrl: string;
}

export default function DashboardPage() {
  const [countries, setCountries] = useState<CountryFile[]>([]);
  const [countryData, setCountryData] = useState<Record<string, ChartData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<'urate-line' | 'urate-gap'>('urate-line');

  useEffect(() => {
    async function loadCountries() {
      try {
        setLoading(true);
        console.log('Fetching countries list...');
        
        // Add timeout to prevent hanging
        const response = await Promise.race([
          axios.get('/api/data/countries'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        ]) as any;
        
        const countryFiles = response.data.countries as CountryFile[];
        console.log(`Found ${countryFiles.length} countries:`, countryFiles.map(f => f.country));
        
        if (!countryFiles || countryFiles.length === 0) {
          throw new Error('No countries found');
        }
        
        setCountries(countryFiles);
        setError(null);

        // Load data for each country with timeout
        console.log('Loading data for countries...');
        const dataPromises = countryFiles.map(async (countryFile) => {
          try {
            // Use countryKey if available, otherwise use country name
            const lookupKey = countryFile.countryKey || countryFile.country.toLowerCase().replace(/\s+/g, '_');
            console.log(`Loading data for ${countryFile.country} (key: ${lookupKey})...`);
            
            const dataResponse = await Promise.race([
              axios.get(`/api/data/country/${encodeURIComponent(lookupKey)}`),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Data request timeout')), 15000)
              )
            ]) as any;
            
            // Check if response has an error
            if (dataResponse.data.error) {
              console.error(`API returned error for ${countryFile.country}:`, dataResponse.data.details);
              throw new Error(dataResponse.data.error);
            }
            
            console.log(`Loaded data for ${countryFile.country}`);
            return {
              country: countryFile.country,
              data: dataResponse.data as ChartData,
            };
          } catch (err: any) {
            console.error(`Error loading data for ${countryFile.country}:`, err.message || err);
            console.error('Full error details:', err.response?.data || err);
            return null;
          }
        });

        const results = await Promise.all(dataPromises);
        const dataMap: Record<string, ChartData> = {};
        const loadedCount = results.filter(r => r !== null).length;
        console.log(`Loaded data for ${loadedCount} out of ${countryFiles.length} countries`);
        
        results.forEach((result) => {
          if (result) {
            dataMap[result.country] = result.data;
          }
        });
        setCountryData(dataMap);
        
        if (loadedCount === 0) {
          setError('Failed to load data for any countries. Check server logs for details.');
        }
      } catch (err: any) {
        console.error('Error in loadCountries:', err);
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">U-rate gaps</h1>
        
        <div className="mb-4 text-gray-700 leading-relaxed">
          <p>
            This page contains estimates of the latest u-rate gaps in{' '}
            <Link
              href="https://www.bis.org/publ/work1159.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Suah (2024)
            </Link>
            . The detailed methodology can be found in the paper. Replication codes for the paper are in{' '}
            <Link
              href="https://github.com/suahjl/global-plucking"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://github.com/suahjl/global-plucking
            </Link>
            . The underlying data is pulled from the St. Louis Fed&apos;s FRED API (unlike CEIC in the paper). The primary source remains the same, that is the respective national authorities.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 italic">
            Disclaimer: All views expressed in the material on this website are mine, and do not necessarily represent those of my current and past employers, as well as other affiliate organisations.
          </p>
        </div>

        <div className="mb-6 flex gap-3">
          <a
            href="https://raw.githubusercontent.com/suahjl/dashboard-global-plucking/main/data-dashboard/plucking_ugap_quarterly.csv"
            download="plucking_ugap_quarterly.csv"
            className="inline-flex items-center px-4 py-2 text-white rounded-md transition-colors text-sm font-medium"
            style={{ backgroundColor: '#4A9D5F' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#217346'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A9D5F'}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
            </svg>
            Full data (csv)
          </a>
          <a
            href="https://raw.githubusercontent.com/suahjl/dashboard-global-plucking/main/data-dashboard/plucking_ugap_quarterly.parquet"
            download="plucking_ugap_quarterly.parquet"
            className="inline-flex items-center px-4 py-2 text-white rounded-md transition-colors text-sm font-medium"
            style={{ backgroundColor: '#5BB5B8' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F8E8C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5BB5B8'}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Full data (parquet)
          </a>
        </div>
        
        <div className="mb-6">
          <label htmlFor="chart-type-select" className="block text-sm font-medium text-gray-700 mb-2">
            Chart Type:
          </label>
          <select
            id="chart-type-select"
            value={selectedChartType}
            onChange={(e) =>
              setSelectedChartType(e.target.value as 'urate-line' | 'urate-gap')
            }
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="urate-line">U-rate and U-rate floor</option>
            <option value="urate-gap">U-rate gap</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">Error: {error}</p>
          <p className="text-red-600 text-sm mt-2">
            Check the browser console and server logs for more details.
          </p>
        </div>
      )}

      {!loading && countries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {countries.map((countryFile) => {
            const data = countryData[countryFile.country];
            if (!data) {
              return (
                <div key={countryFile.country} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>{countryFile.country}:</strong> Data not available. Check console for errors.
                  </p>
                </div>
              );
            }

            return (
              <div key={countryFile.country} className="w-full">
                <ChartContainer
                  data={data}
                  title={`${countryFile.country}`}
                  chartType="line"
                  xAxisKey="quarter"
                  columnsToPlot={['urate', 'urate_ceiling']}
                  customColors={{
                    urate: '#000000',
                    urate_ceiling: '#FF0000',
                    urate_gap: '#FF7F50',
                  }}
                  customLabels={{
                    urate: 'U-rate',
                    urate_ceiling: 'U-rate floor',
                  }}
                  selectedChartType={selectedChartType}
                />
              </div>
            );
          })}
        </div>
      )}

      {!loading && countries.length === 0 && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No country data files found.</p>
        </div>
      )}
    </div>
  );
}

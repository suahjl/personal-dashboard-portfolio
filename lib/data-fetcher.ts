import axios from 'axios';
import { ChartData } from './types';

/**
 * Fetches data from the Next.js API route
 */
export async function fetchDashboardData(source: string): Promise<ChartData> {
  try {
    const response = await axios.get(`/api/data?source=${source}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

/**
 * Fetches data directly from GitHub repo (if public)
 */
export async function fetchDataFromGitHub(
  owner: string,
  repo: string,
  path: string
): Promise<any> {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    throw error;
  }
}

/**
 * Transforms raw data into ChartData format
 */
export function transformToChartData(
  rawData: any[],
  metadata?: ChartData['metadata']
): ChartData {
  return {
    data: rawData,
    metadata: metadata || {
      lastUpdated: new Date().toISOString(),
    },
  };
}


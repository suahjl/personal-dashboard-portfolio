import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { transformToChartData } from '@/lib/data-fetcher';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get('source');

  if (!source) {
    return NextResponse.json(
      { error: 'Source parameter is required' },
      { status: 400 }
    );
  }

  try {
    // For dashboard-global-plucking, fetch from GitHub
    if (source === 'dashboard-global-plucking') {
      // This is a placeholder - you'll need to adjust based on actual repo structure
      // Example: fetch from https://raw.githubusercontent.com/suahjl/dashboard-global-plucking/main/data/...
      const data = await fetchDataFromGitHub(
        'suahjl',
        'dashboard-global-plucking',
        'data/sample.json' // Adjust path based on actual structure
      );
      
      return NextResponse.json(
        transformToChartData(data, {
          source: 'dashboard-global-plucking',
          lastUpdated: new Date().toISOString(),
          description: 'Data from dashboard-global-plucking repository',
        })
      );
    }

    // For other sources, you can add more cases here
    return NextResponse.json(
      { error: 'Unknown data source' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return sample data if GitHub fetch fails (for development)
    const sampleData = [
      { date: '2024-01', value: 100, category: 'A' },
      { date: '2024-02', value: 120, category: 'A' },
      { date: '2024-03', value: 110, category: 'A' },
      { date: '2024-04', value: 130, category: 'A' },
      { date: '2024-05', value: 125, category: 'A' },
    ];

    return NextResponse.json(
      transformToChartData(sampleData, {
        source: source || 'sample',
        lastUpdated: new Date().toISOString(),
        description: 'Sample data (GitHub fetch failed)',
      })
    );
  }
}

async function fetchDataFromGitHub(
  owner: string,
  repo: string,
  path: string
): Promise<any> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  const response = await axios.get(url);
  return response.data;
}


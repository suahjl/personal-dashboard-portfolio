import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import Papa from 'papaparse';

/**
 * Fetches and parses csv file for a specific country
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;

  try {
    // Normalize country name to match filename format
    const normalizedCountry = country.toLowerCase().replace(/\s+/g, '_');
    
    // Construct filename directly - we know the format
    const filename = `plucking_ugap_quarterly_${normalizedCountry}.csv`;
    
    // Use raw GitHub URL directly - these work when accessed manually
    const rawUrl = `https://raw.githubusercontent.com/suahjl/dashboard-global-plucking/main/data-dashboard/${filename}`;
    
    console.log(`Fetching file directly from raw URL: ${rawUrl}`);
    
    // Fetch the file directly using raw URL with minimal headers
    const fileResponse = await axios.get(rawUrl, {
      responseType: 'text',
      headers: {
        'Accept': '*/*',
      },
      maxRedirects: 5,
      timeout: 30000, // 30 second timeout
    });
    
    if (fileResponse.status !== 200) {
      throw new Error(`Failed to fetch file: HTTP ${fileResponse.status}`);
    }
    
    const csvText = fileResponse.data;
    console.log(`File downloaded successfully, size: ${csvText.length} bytes`);

    // Parse the CSV file
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
    });
    
    if (parseResult.errors && parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors);
    }
    
    const jsonData = parseResult.data;

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      console.error(`No data found in CSV file for ${country}`);
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Log first row to see structure
    console.log(`First row for ${country}:`, jsonData[0]);

    // Transform data - use quarter as x-axis, keep all columns
    const chartData = jsonData.map((row: any) => {
      const dataPoint: any = { ...row };
      
      // Ensure quarter field exists and is a string
      if (dataPoint.quarter) {
        dataPoint.quarter = String(dataPoint.quarter);
      }
      
      return dataPoint;
    }).filter((row: any) => row.quarter); // Filter out rows without quarter

    console.log(`Parsed ${chartData.length} data points for ${country}`);
    if (chartData.length > 0) {
      console.log(`Sample data point:`, chartData[0]);
    }

    return NextResponse.json({
      data: chartData,
      metadata: {
        source: 'dashboard-global-plucking',
        country: country,
        lastUpdated: new Date().toISOString(),
        filename: filename,
      },
    });
  } catch (error: any) {
    console.error(`Error fetching data for ${country}:`, error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      stack: error.stack,
    });
    
    // Return error details instead of sample data so we can debug
    return NextResponse.json({
      error: `Failed to fetch data for ${country}`,
      details: {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      },
      data: [], // Empty data array instead of sample
      metadata: {
        source: 'error',
        country: country,
        lastUpdated: new Date().toISOString(),
        description: `Error: ${error.message || 'Unknown error'}`,
      },
    }, { status: error.response?.status || 500 });
  }
}


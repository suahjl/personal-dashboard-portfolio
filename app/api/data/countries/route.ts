import { NextResponse } from 'next/server';

/**
 * Country name mapping from filename to display name
 */
const COUNTRY_NAME_MAP: Record<string, string> = {
  'australia': 'Australia',
  'chile': 'Chile',
  'germany': 'Germany',
  'italy': 'Italy',
  'japan': 'Japan',
  'united_kingdom': 'United Kingdom',
  'united_states': 'United States',
};

/**
 * Hardcoded list of country files (ordered by desired display order)
 */
const COUNTRY_FILES = [
  { filename: 'plucking_ugap_quarterly_united_states.csv', countryKey: 'united_states' },
  { filename: 'plucking_ugap_quarterly_united_kingdom.csv', countryKey: 'united_kingdom' },
  { filename: 'plucking_ugap_quarterly_japan.csv', countryKey: 'japan' },
  { filename: 'plucking_ugap_quarterly_germany.csv', countryKey: 'germany' },
  { filename: 'plucking_ugap_quarterly_italy.csv', countryKey: 'italy' },
  { filename: 'plucking_ugap_quarterly_australia.csv', countryKey: 'australia' },
  { filename: 'plucking_ugap_quarterly_chile.csv', countryKey: 'chile' },
];

/**
 * Lists available country files
 */
export async function GET() {
  const countries = COUNTRY_FILES.map((file) => {
    const country = COUNTRY_NAME_MAP[file.countryKey] || file.countryKey;
    return {
      filename: file.filename,
      country: country,
      countryKey: file.countryKey,
      downloadUrl: `https://raw.githubusercontent.com/suahjl/dashboard-global-plucking/main/data-dashboard/${file.filename}`,
    };
  });
  
  return NextResponse.json({ countries });
}


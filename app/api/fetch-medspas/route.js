import axios from 'axios';
import { NextResponse } from 'next/server';

// Google Places API endpoints
export const TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
export const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

// Helper function to introduce a delay (useful for pagination)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all pages of results from Google Places API
async function fetchAllPages(query, maxResults = 60) {
  let allResults = [];
  let nextPageToken = null;
  let page = 1;

  do {
    try {
      const response = await axios.get(TEXT_SEARCH_URL, {
        params: {
          query,
          key: process.env.GOOGLE_API_KEY,
          pagetoken: nextPageToken
        }
      });

      const status = response.data.status;
      console.log(`Page ${page} Status:`, status);

      if (response.data.error_message) {
        console.error('Error Message:', response.data.error_message);
        break;
      }

      if (status !== 'OK' && status !== 'ZERO_RESULTS') break;

      const results = response.data.results || [];
      console.log(`Found ${results.length} results on page ${page} for: ${query}`);
      allResults.push(...results);

      // Break if we've reached the maximum result limit
      if (allResults.length >= maxResults) {
        allResults = allResults.slice(0, maxResults);
        break;
      }

      nextPageToken = response.data.next_page_token;

      // Google API requires a short wait before using next_page_token
      if (nextPageToken) {
        await sleep(2000);
        page++;
      }
    } catch (error) {
      console.error('Error fetching text search results:', error.message);
      break;
    }
  } while (nextPageToken);

  return allResults;
}

// Function to fetch details for a place
async function fetchPlaceDetails(placeId) {
  try {
    const detailsResponse = await axios.get(DETAILS_URL, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,website,formatted_phone_number,international_phone_number,opening_hours,url',
        key: process.env.GOOGLE_API_KEY
      }
    });

    const details = detailsResponse.data.result;
    if (!details) {
      console.warn(`No details found for place ID: ${placeId}`);
      return null;
    }

    // Get opening hours if available
    let openingHours = 'N/A';
    if (details.opening_hours && details.opening_hours.weekday_text) {
      openingHours = details.opening_hours.weekday_text.join(' | ');
    }

    return {
      name: details.name || 'N/A',
      address: details.formatted_address || 'N/A',
      website: details.website || 'N/A',
      phone: details.formatted_phone_number || 'N/A',
      googleMaps: details.url || 'N/A',
      hours: openingHours
    };
  } catch (err) {
    console.warn(`Error fetching details for ${placeId}:`, err.message);
    return null;
  }
}

// Generate CSV content from data
function generateCsv(data) {
  const header = 'Name,Address,Website,Phone,Google Maps,Hours\n';
  const rows = data.map(item => 
    `"${item.name.replace(/"/g, '""')}","${item.address.replace(/"/g, '""')}","${item.website.replace(/"/g, '""')}","${item.phone.replace(/"/g, '""')}","${item.googleMaps.replace(/"/g, '""')}","${item.hours.replace(/"/g, '""')}"`
  );
  return header + rows.join('\n');
}

export async function GET(request) {
  // Extract city from query parameter
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const format = searchParams.get('format') || 'json'; // Default to JSON if not specified

  if (!city) {
    return NextResponse.json(
      { message: 'City parameter is required' },
      { status: 400 }
    );
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { message: 'Google API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Use the exact same query format that works in the original script
    const query = `medical spa in ${city}, CA`;
    console.log(`Searching: ${query}`);
    
    // Fetch places from Google Places API
    const places = await fetchAllPages(query);
    
    if (places.length === 0) {
      return NextResponse.json(
        { message: `No medical spas found in ${city}, California. Please try another city or check spelling.` },
        { status: 404 }
      );
    }

    // Fetch details for each place
    const results = [];
    for (const place of places) {
      const details = await fetchPlaceDetails(place.place_id);
      if (details) {
        results.push(details);
      }
      await sleep(150); // Short delay to avoid throttling
    }

    // If CSV format requested, return as downloadable file
    if (format === 'csv') {
      const csvContent = generateCsv(results);
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="medspas-${city.replace(/\s+/g, '-').toLowerCase()}.csv"`
        }
      });
    }
    
    // Otherwise, return JSON data
    return NextResponse.json({ 
      data: results,
      city: city,
      count: results.length
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: 'Failed to fetch medical spa data: ' + error.message },
      { status: 500 }
    );
  }
}

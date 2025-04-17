import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Call the Python script to extract emails and social media links
    const command = `python api/scraper.py "${url}"`;
    
    // Execute the Python command and capture the output
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error('Python script error:', stderr);
      return NextResponse.json(
        { error: 'Failed to extract contact information' },
        { status: 500 }
      );
    }
    
    // Process the output from the Python script
    try {
      const resultData = JSON.parse(stdout.trim());
      return NextResponse.json({ data: resultData });
    } catch (jsonError) {
      console.error('Failed to parse Python output:', jsonError);
      return NextResponse.json(
        { error: 'Failed to parse contact information' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
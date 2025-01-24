import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { spawn } from 'child_process';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationData } = body;

    if (!registrationData) {
      return NextResponse.json(
        { error: 'registrationData is required' },
        { status: 400 }
      );
    }

    // Get the root directory (assuming frontend and backend are sibling directories)
    const rootDir = path.resolve(process.cwd(), '..');
    
    // Construct absolute path to Python script
    const pythonScriptPath = path.join(
      rootDir,
      'backend',
      'services',
      'selenium',
      'form_filler.py'
    );

    // Temporary log to verify path (remove after testing)
    console.log('Python script path verification:', pythonScriptPath);

    const pythonProcess = spawn('python', [
      pythonScriptPath,
      JSON.stringify(registrationData),
    ]);

    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    let pythonError = '';
    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    const exitCode: number = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });

    if (exitCode !== 0) {
      console.error(`Python error: ${pythonError}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Automation failed',
          details: pythonError,
          pythonPath: pythonScriptPath // Include path in error response
        },
        { status: 500 }
      );
    }

    try {
      const result = JSON.parse(pythonOutput);
      return NextResponse.json(result, { status: 200 });
    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid script output',
          details: pythonOutput,
          receivedPath: pythonScriptPath
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
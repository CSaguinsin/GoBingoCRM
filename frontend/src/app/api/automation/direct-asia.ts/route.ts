import { NextRequest, NextResponse } from 'next/server';
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

    // Map the row data into the format required by form_filler.py
    const formattedData = {
      full_name: registrationData.name,
      race: registrationData.race,
      dob: registrationData.date_of_birth,
      sex: registrationData.sex,
      place_of_birth: registrationData.place_of_birth,
      license_number: registrationData.license_number,
      issue_date: registrationData.issue_date,
      vehicle_number: registrationData.vehicle_no,
      make_model: registrationData.make_model,
      vehicle_type: registrationData.vehicle_type,
      chassis_no: registrationData.chassis_no,
      engine_no: registrationData.engine_no,
      motor_no: registrationData.motor_no,
      engine_capacity: registrationData.engine_capacity,
      power_rating: registrationData.power_rating,
      maximum_power_output: registrationData.maximum_power_output,
      original_registration_date: registrationData.original_registration_date,
      coe_category: registrationData.coe_category,
      coe_expiry_date: registrationData.coe_expiry_date,
      road_tax_expiry_date: registrationData.road_tax_expiry_date,
    };

    // Spawn the Python process
    const pythonProcess = spawn('python', [
      './services/selenium/form_filler.py',
      JSON.stringify(formattedData),
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
      console.error(`Python script error: ${pythonError}`);
      return NextResponse.json(
        { success: false, error: 'Automation failed', details: pythonError },
        { status: 500 }
      );
    }

    try {
      const result = JSON.parse(pythonOutput);
      return NextResponse.json(result, { status: 200 });
    } catch (e) {
      console.error('Error parsing Python output:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid response from automation script' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in Direct Asia API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

const { spawn } = require('child_process');
const express = require('express');
const router = express.Router();

router.post('/direct-asia', async (req, res) => {
    const { registrationData } = req.body;

    if (!registrationData) {
        return res.status(400).json({ error: 'registrationData is required' });
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
        JSON.stringify(formattedData), // Pass the formatted data as a string
    ]);

    // Collect Python script output
    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    let pythonError = '';
    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    // Wait for Python script to finish
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script error: ${pythonError}`);
            return res.status(500).json({
                success: false,
                error: 'Automation failed',
                details: pythonError,
            });
        }

        // Send Python script's result back to the client
        try {
            const result = JSON.parse(pythonOutput);
            res.json(result);
        } catch (e) {
            console.error('Error parsing Python output:', e);
            res.status(500).json({
                success: false,
                error: 'Invalid response from automation script',
            });
        }
    });
});

module.exports = router;

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import json
import sys

def fill_direct_asia_form(data):
    driver = webdriver.Safari()
    wait = WebDriverWait(driver, 10)
    
    try:
        # Your existing Selenium code, but using the passed data
        driver.get("https://secure.directasia.com/vm/q/s")
        
        # Use the data passed from Node.js
        full_name_input = wait.until(
            EC.element_to_be_clickable((By.ID, "familyNamePolicyholderInM"))
        )
        full_name_input.send_keys(data['full_name'])
        
        vehnumber_input = wait.until(
            EC.element_to_be_clickable((By.ID, "vehNumber"))
        )
        vehnumber_input.send_keys(data['vehicle_number'])
        
        # ... rest of your Selenium code, using data['field_name'] instead of hardcoded values
        
        return {"success": True}
        
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        input("Press Enter to close the browser...")
        driver.quit()

if __name__ == "__main__":
    # Get the data passed from Node.js
    if len(sys.argv) > 1:
        form_data = json.loads(sys.argv[1])
        result = fill_direct_asia_form(form_data)
        print(json.dumps({
    "success": True,
    "message": "Form submitted successfully",
    # Add any additional output data
}))
    else:
        print(json.dumps({"success": False, "error": "No data provided"}))
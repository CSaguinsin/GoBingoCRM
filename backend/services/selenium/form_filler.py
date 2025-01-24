from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json
import sys
import os
import time

CONFIG = {
    "field_mappings": {
        "policyholder": {
            "name": "familyNamePolicyholderInM",
            "dob_day": "dobDay",
            "dob_month": "dobMonth",
            "dob_year": "dobYear",
            "gender": "sexPolicyholderInM",
            "license_number": "licenseNumber",
            "license_issue_day": "issueDateDay",
            "license_issue_month": "issueDateMonth",
            "license_issue_year": "issueDateYear"
        },
        "vehicle": {
            "number": "vehNumber",
            "make_model": "makeModel",
            "type": "vehicleType",
            "engine_capacity": "engineCapacity",
            "year_manufacture": "yearOfManufacture",
            "propellant": "propellant",
            "chassis": "chassisNo",
            "coe_expiry_day": "coeExpiryDateDay",
            "coe_expiry_month": "coeExpiryDateMonth",
            "coe_expiry_year": "coeExpiryDateYear",
            "road_tax_expiry_day": "roadTaxExpiryDateDay",
            "road_tax_expiry_month": "roadTaxExpiryDateMonth",
            "road_tax_expiry_year": "roadTaxExpiryDateYear",
            "ncd_protection": "ncdProtection"
        }
    },
    "dropdown_options": {
        "gender": {"M": "Male", "F": "Female", "Other": "Prefer not to say"},
        "propellant": {
            "Petrol": "Petrol",
            "Diesel": "Diesel",
            "Electric": "Electric",
            "Hybrid": "Hybrid"
        }
    },
    "urls": {
        "main_form": "https://secure.directasia.com/vm/q/s",
        "driver_details": "/driver-experience",
        "coverage_selection": "/coverage-options"
    }
}

def validate_dropdown_option(element_id, value, driver):
    """Validate dropdown value exists before selection"""
    select = Select(driver.find_element(By.ID, element_id))
    options = [opt.text.strip() for opt in select.options]
    if value not in options:
        raise ValueError(f"Invalid option '{value}' for {element_id}. Valid options: {options}")

def safe_send_keys(element, value):
    """Clear field and send keys with validation"""
    element.clear()
    element.send_keys(value)
    if element.get_attribute('value') != value:
        raise ValueError(f"Failed to set value for {element.get_attribute('id')}")

def take_screenshot(driver, name):
    """Capture screenshot for debugging"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join("screenshots", f"{name}_{timestamp}.png")
    driver.save_screenshot(path)
    return path

def fill_direct_asia_form(data):
    driver = webdriver.Safari()
    wait = WebDriverWait(driver, 25)
    driver.maximize_window()
    
    try:
        # Initialize session
        driver.get(CONFIG["urls"]["main_form"])
        
        # --- Policyholder Section ---
        section = CONFIG["field_mappings"]["policyholder"]
        
        # Personal Details
        wait.until(EC.visibility_of_element_located((By.ID, section["name"]))).send_keys(data['name'])
        
        # Date of Birth
        dob_date = datetime.strptime(data['date_of_birth'], "%Y-%m-%d")
        Select(driver.find_element(By.ID, section["dob_day"])).select_by_value(str(dob_date.day))
        Select(driver.find_element(By.ID, section["dob_month"])).select_by_value(str(dob_date.month))
        Select(driver.find_element(By.ID, section["dob_year"])).select_by_value(str(dob_date.year))
        
        # Gender Selection with validation
        gender_text = CONFIG["dropdown_options"]["gender"].get(data['sex'], 'Male')
        validate_dropdown_option(section["gender"], gender_text, driver)
        Select(driver.find_element(By.ID, section["gender"])).select_by_visible_text(gender_text)
        
        # --- Vehicle Information Section ---
        section = CONFIG["field_mappings"]["vehicle"]
        
        # License Plate and Identification
        safe_send_keys(wait.until(EC.element_to_be_clickable((By.ID, section["number"]))), data['vehicle_no'])
        
        # Make/Model Validation
        validate_dropdown_option(section["make_model"], data['make_model'], driver)
        Select(driver.find_element(By.ID, section["make_model"])).select_by_visible_text(data['make_model'])
        
        # Technical Specifications
        safe_send_keys(driver.find_element(By.ID, section["engine_capacity"]), str(data['engine_capacity']))
        safe_send_keys(driver.find_element(By.ID, section["year_manufacture"]), str(data['year_of_manufacture']))
        
        # Fuel Type Handling
        propellant = CONFIG["dropdown_options"]["propellant"].get(data['propellant'], 'Petrol')
        validate_dropdown_option(section["propellant"], propellant, driver)
        Select(driver.find_element(By.ID, section["propellant"])).select_by_visible_text(propellant)
        
        # Date Validation Logic
        def handle_date_fields(prefix, source_date):
            if not source_date: return
            date_value = datetime.strptime(source_date, "%Y-%m-%d")
            
            # COE Validation (max 10 years from now)
            if "coe" in prefix:
                max_date = datetime.now() + relativedelta(years=10)
                if date_value > max_date:
                    raise ValueError(f"COE expiry date cannot be beyond {max_date.strftime('%Y-%m-%d')}")
            
            Select(driver.find_element(By.ID, section[f"{prefix}_day"])).select_by_value(str(date_value.day))
            Select(driver.find_element(By.ID, section[f"{prefix}_month"])).select_by_value(str(date_value.month))
            Select(driver.find_element(By.ID, section[f"{prefix}_year"])).select_by_value(str(date_value.year))
        
        handle_date_fields("coe_expiry", data['coe_expiry_date'])
        handle_date_fields("road_tax_expiry", data['road_tax_expiry_date'])
        
        # --- Navigation to Driver Details Page ---
        next_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Next')]")))
        next_btn.click()
        
        # Wait for page transition
        WebDriverWait(driver, 15).until(EC.url_contains(CONFIG["urls"]["driver_details"]))
        
        # --- Driver Experience Section ---
        # License Information
        safe_send_keys(driver.find_element(By.ID, section["license_number"]), data['license_number'])
        
        # License Issue Date
        issue_date = datetime.strptime(data['issue_date'], "%Y-%m-%d")
        Select(driver.find_element(By.ID, section["license_issue_day"])).select_by_value(str(issue_date.day))
        Select(driver.find_element(By.ID, section["license_issue_month"])).select_by_value(str(issue_date.month))
        Select(driver.find_element(By.ID, section["license_issue_year"])).select_by_value(str(issue_date.year))
        
        # --- Final Submission ---
        submit_btn = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[@type='submit' and contains(text(), 'Get Quote')]"))
        )
        submit_btn.click()
        
        # Verify successful submission
        WebDriverWait(driver, 30).until(
            EC.or_(
                EC.url_contains("/confirmation"),
                EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(), 'Your Quote')]"))
            )
        )
        
        return {"success": True, "message": "Form submitted successfully"}
        
    except Exception as e:
        screenshot_path = take_screenshot(driver, "error")
        return {
            "success": False,
            "error": str(e),
            "screenshot": screenshot_path,
            "page_source": driver.page_source
        }
    finally:
        driver.quit()

if __name__ == "__main__":
    # Create screenshots directory if not exists
    os.makedirs("screenshots", exist_ok=True)
    
    if len(sys.argv) > 1:
        form_data = json.loads(sys.argv[1])
        result = fill_direct_asia_form(form_data)
        print(json.dumps(result))
    else:
        print(json.dumps({"success": False, "error": "No data provided"}))
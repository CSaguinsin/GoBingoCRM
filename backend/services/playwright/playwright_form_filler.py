from playwright.sync_api import sync_playwright
import json
import sys

def fill_direct_asia_form(data):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Set headless=True for production
        page = browser.new_page()
        
        try:
            page.goto("https://secure.directasia.com/vm/q/s")
            
            # Fill form fields using Playwright selectors
            page.fill('#familyNamePolicyholderInM', data['full_name'])
            page.fill('#vehNumber', data['vehicle_number'])
            
            # Example for dropdown selection
            page.select_option('#coeCategory', data['coe_category'])
            
            # Handle date pickers
            page.fill('#originalRegistrationDate', data['original_registration_date'])
            
            # Continue with other form fields...
            
            # Submit form
            page.click('button[type="submit"]')
            
            # Wait for success message
            page.wait_for_selector('.success-message', timeout=10000)
            
            return {"success": True}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
        finally:
            browser.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        form_data = json.loads(sys.argv[1])
        result = fill_direct_asia_form(form_data)
        print(json.dumps(result))
    else:
        print(json.dumps({"success": False, "error": "No data provided"}))
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

class SeleniumDriver:
    def __init__(self, headless=False):
        self.options = Options()
        if headless:
            self.options.add_argument('--headless')
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        
    def get_driver(self):
        """Initialize and return a Chrome WebDriver instance"""
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=self.options)
        driver.implicitly_wait(10)  # Wait up to 10 seconds for elements to appear
        return driver
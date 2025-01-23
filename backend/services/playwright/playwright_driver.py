from playwright.sync_api import sync_playwright

class PlaywrightDriver:
    def __init__(self, headless=False):
        self.headless = headless
        
    def get_browser(self):
        """Initialize and return a Playwright browser instance"""
        self.playwright = sync_playwright().start()
        browser = self.playwright.chromium.launch(headless=self.headless)
        return browser
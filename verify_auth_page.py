
import re
import time
from playwright.sync_api import Page, expect

def test_auth_page(page: Page):
    # Generate a unique user for each test run to ensure idempotency
    unique_id = str(int(time.time()))
    username = f"testuser_{unique_id}"
    email = f"testuser_{unique_id}@example.com"
    password = "password123"

    # Listen for all console events and print them
    page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

    # Navigate to the auth page
    page.goto("http://localhost:5000/auth")

    # Wait for the page to load
    try:
        page.wait_for_selector('[data-testid="tab-signup"]', timeout=10000)
    except Exception as e:
        print(f"Error waiting for selector: {e}")
        page.screenshot(path="/home/jules/verification/auth_page_error.png")
        raise

    # Check the title
    expect(page).to_have_title(re.compile("AirBear"))

    # --- Test Sign Up ---
    page.get_by_test_id("tab-signup").click()
    page.get_by_test_id("input-username").fill(username)
    page.get_by_test_id("input-email").fill(email)
    page.get_by_test_id("input-password").fill(password)
    page.get_by_test_id("input-confirm-password").fill(password)
    page.get_by_test_id("button-role-user").click()
    page.get_by_test_id("button-submit").click()
    expect(page).to_have_url(re.compile("/dashboard"), timeout=10000)

    # --- Test Sign In ---
    # Log out by clearing cookies and navigating back to the auth page
    page.context.clear_cookies()
    page.goto("http://localhost:5000/auth")
    page.wait_for_selector('[data-testid="tab-signin"]')

    page.get_by_test_id("tab-signin").click()
    page.get_by_test_id("input-email").fill(email)
    page.get_by_test_id("input-password").fill(password)
    page.get_by_test_id("button-submit").click()
    expect(page).to_have_url(re.compile("/dashboard"), timeout=10000)

    # --- Test Password Mismatch ---
    page.goto("http://localhost:5000/auth")
    page.get_by_test_id("tab-signup").click()
    page.get_by_test_id("input-username").fill("mismatchuser")
    page.get_by_test_id("input-email").fill("mismatch@example.com")
    page.get_by_test_id("input-password").fill("password123")
    page.get_by_test_id("input-confirm-password").fill("password456")
    page.get_by_test_id("button-submit").click()
    expect(page.locator('[role="status"]')).to_contain_text("Passwords do not match")

    # --- Test Toggle Password Visibility ---
    password_input = page.get_by_test_id("input-password")
    expect(password_input).to_have_attribute("type", "password")
    page.get_by_test_id("button-toggle-password").click()
    expect(password_input).to_have_attribute("type", "text")
    page.get_by_test_id("button-toggle-password").click()
    expect(password_input).to_have_attribute("type", "password")

    # --- Test OAuth & Forgot Password Buttons ---
    page.get_by_test_id("tab-signin").click()
    expect(page.get_by_test_id("button-google-oauth")).to_be_visible()
    expect(page.get_by_test_id("button-apple-oauth")).to_be_visible()
    expect(page.get_by_test_id("button-forgot-password")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="/home/jules/verification/auth_page_success.png")


import re
import time
from playwright.sync_api import Page, expect

def test_dashboard_page(page: Page):
    # Generate a unique user for each test run to ensure idempotency
    unique_id = str(int(time.time()))
    email = f"testuser_{unique_id}@example.com"
    password = "password123"
    username = f"testuser_{unique_id}"

    # --- Sign Up ---
    page.goto("http://localhost:5000/auth")
    page.get_by_test_id("tab-signup").click()
    page.get_by_test_id("input-username").fill(username)
    page.get_by_test_id("input-email").fill(email)
    page.get_by_test_id("input-password").fill(password)
    page.get_by_test_id("input-confirm-password").fill(password)
    page.get_by_test_id("button-role-user").click()
    page.get_by_test_id("button-submit").click()
    expect(page).to_have_url(re.compile("/dashboard"), timeout=10000)

    # --- Verify Dashboard ---
    # First, wait for a stable element on the dashboard to ensure the user data has loaded.
    expect(page.get_by_test_id("card-eco-points")).to_be_visible(timeout=10000)

    # Check for the welcome message using a more robust accessibility locator.
    # The accessible name of the h1 element should include the text of its children.
    welcome_message = page.get_by_role("heading", name=f"Welcome back, {username}!")
    expect(welcome_message).to_be_visible()

    # Check for other key dashboard elements
    expect(page.get_by_test_id("card-book-airbear")).to_be_visible()
    expect(page.get_by_test_id("card-shop-bodega")).to_be_visible()
    expect(page.get_by_test_id("card-recent-activity")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="/home/jules/verification/dashboard_page.png")

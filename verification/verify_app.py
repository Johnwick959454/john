from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(2000)

    # Initial state
    page.screenshot(path="verification/screenshots/initial.png")

    # Fill youtube link
    input_field = page.get_by_placeholder("Paste YouTube Link...")
    input_field.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    page.wait_for_timeout(500)
    input_field.press("Enter")

    page.wait_for_timeout(2000)
    page.screenshot(path="verification/screenshots/processed.png")

    # Start playback
    page.get_by_role("button").filter(has=page.locator("svg")).nth(1).click()
    page.wait_for_timeout(3000)

    # Final state
    page.screenshot(path="verification/screenshots/playing.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

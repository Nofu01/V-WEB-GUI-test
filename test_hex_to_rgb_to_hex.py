import json
import os
import time
import pytest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = os.getenv("APP_URL", "http://localhost:3000")


# ---- helpers ---------------------------------------------------------------

def by_any_id(driver, ids):
    """Return the first element found by any id in list (helps when ids differ)."""
    for _id in ids:
        try:
            return driver.find_element(By.ID, _id)
        except Exception:
            continue
    raise RuntimeError(f"Could not find any element with ids: {ids}")


def find_by_ids_or_xpaths(driver, ids=None, xpaths=None):
    """Try to find element by a list of IDs, then by a list of XPaths.

    This helps when the app might expose either an id or an xpath-only element.
    """
    ids = ids or []
    xpaths = xpaths or []

    # Try IDs first (fast and preferred)
    for _id in ids:
        try:
            return driver.find_element(By.ID, _id)
        except Exception:
            continue

    # Then try XPaths
    for xp in xpaths:
        try:
            return driver.find_element(By.XPATH, xp)
        except Exception:
            continue

    raise RuntimeError(f"Could not find element by ids {ids} or xpaths {xpaths}")

def wait_text_contains(driver, locator, text, timeout=5):
    WebDriverWait(driver, timeout).until(
        EC.text_to_be_present_in_element(locator, text)
    )

def parse_json_from_pre(pre_el):
    """PRE block contains pretty-printed JSON; parse defensive."""
    raw = pre_el.text.strip()
    # Some browsers may insert weird whitespace; be forgiving
    return json.loads(raw)


# ---- fixtures --------------------------------------------------------------

@pytest.fixture(scope="session")
def driver():
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    # Window size but no headless mode so we can see the browser
    options.add_argument("--window-size=1280,900")

    drv = webdriver.Chrome(service=service, options=options)
    yield drv
    drv.quit()


# ---- tests -----------------------------------------------------------------

def test_hex_to_rgb_valid(driver, tmp_path):
    driver.get(BASE_URL)

    # Prefer IDs but accept XPaths as fallbacks (from user input)
    hex_input = find_by_ids_or_xpaths(driver, ids=["hex"], xpaths=['//*[@id="hex"]'])
    hex_button = find_by_ids_or_xpaths(driver, ids=["hexGo"], xpaths=['/html/body/section[1]/button'])
    hex_out = find_by_ids_or_xpaths(driver, ids=["hexOut"], xpaths=['//*[@id="hexOut"]'])
    hex_swatch = find_by_ids_or_xpaths(driver, ids=["hexSwatch", "hexPreview"], xpaths=['//*[@id="hexPreview"]', '//div//*[@id="hexPreview"]'])

    hex_input.clear()
    time.sleep(1)  # Pause to see the clear action
    hex_input.send_keys("#FFFFFF")
    time.sleep(1)  # Pause to see the input
    hex_button.click()
    time.sleep(1)  # Pause to see the click effect

    # Wait for async JSON to render
    wait_text_contains(driver, (By.ID, hex_out.get_attribute("id")), '"success": true')

    data = parse_json_from_pre(hex_out)
    assert data["success"] is True
    assert data["data"]["hex"] == "#FFFFFF"
    assert data["data"]["rgb"] == {"r": 255, "g": 255, "b": 255}

    # Verify swatch (Selenium reports rgba)
    bg_color = hex_swatch.value_of_css_property("background-color")
    assert bg_color.replace(" ", "") in ("rgba(255,255,255,1)", "rgb(255,255,255)")

    # Save a nice screenshot for the assignment
    screenshots_dir = tmp_path / "screenshots"
    screenshots_dir.mkdir(parents=True, exist_ok=True)
    driver.save_screenshot(str(screenshots_dir / "app.png"))


def test_rgb_to_hex_valid(driver):
    driver.get(BASE_URL)

    # Prefer IDs but accept XPaths as fallbacks (from user input)
    r = find_by_ids_or_xpaths(driver, ids=["r"], xpaths=['//*[@id="r"]'])
    g = find_by_ids_or_xpaths(driver, ids=["g"], xpaths=['//*[@id="g"]'])
    b = find_by_ids_or_xpaths(driver, ids=["b"], xpaths=['//*[@id="b"]'])
    btn = find_by_ids_or_xpaths(driver, ids=["rgbGo"], xpaths=['/html/body/section[2]/button'])
    out = find_by_ids_or_xpaths(driver, ids=["rgbOut"], xpaths=['//*[@id="rgbOut"]'])
    swatch = find_by_ids_or_xpaths(driver, ids=["rgbSwatch", "rgbPreview"], xpaths=['//*[@id="rgbPreview"]', '//div//*[@id="rgbPreview"]'])

    # Use the values from your screenshot -> #03643C
    r.clear(); time.sleep(1)
    r.send_keys("3"); time.sleep(1)
    g.clear(); time.sleep(1)
    g.send_keys("100"); time.sleep(1)
    b.clear(); time.sleep(1)
    b.send_keys("60"); time.sleep(1)
    btn.click()
    time.sleep(1)  # Pause to see the result

    wait_text_contains(driver, (By.ID, out.get_attribute("id")), '"success": true')
    data = parse_json_from_pre(out)

    assert data["success"] is True
    assert data["data"]["hex"] == "#03643C"
    assert data["data"]["rgb"] == {"r": 3, "g": 100, "b": 60}

    bg = swatch.value_of_css_property("background-color").replace(" ", "")
    assert bg in ("rgba(3,100,60,1)", "rgb(3,100,60)")


def test_hex_to_rgb_invalid_hex_shows_error(driver):
    driver.get(BASE_URL)

    # Use same flexible locator: prefer IDs, but try XPaths provided by the user
    hex_input = find_by_ids_or_xpaths(driver, ids=["hex"], xpaths=['//*[@id="hex"]'])
    hex_button = find_by_ids_or_xpaths(driver, ids=["hexGo"], xpaths=['/html/body/section[1]/button'])
    hex_out = find_by_ids_or_xpaths(driver, ids=["hexOut"], xpaths=['//*[@id="hexOut"]'])

    hex_input.clear()
    time.sleep(1)  # Pause to see the clear action
    hex_input.send_keys("ZZZZZZ")
    time.sleep(1)  # Pause to see the invalid input
    hex_button.click()
    time.sleep(1)  # Pause to see the error

    wait_text_contains(driver, (By.ID, hex_out.get_attribute("id")), '"success": false')
    data = parse_json_from_pre(hex_out)

    assert data["success"] is False
    # optional: check error key exists
    assert "error" in data


def test_rgb_to_hex_out_of_range_error(driver):
    driver.get(BASE_URL)

    # Use flexible locators: prefer IDs, but try XPaths provided by the user
    r = find_by_ids_or_xpaths(driver, ids=["r"], xpaths=['//*[@id="r"]'])
    g = find_by_ids_or_xpaths(driver, ids=["g"], xpaths=['//*[@id="g"]'])
    b = find_by_ids_or_xpaths(driver, ids=["b"], xpaths=['//*[@id="b"]'])
    btn = find_by_ids_or_xpaths(driver, ids=["rgbGo"], xpaths=['/html/body/section[2]/button'])
    out = find_by_ids_or_xpaths(driver, ids=["rgbOut"], xpaths=['//*[@id="rgbOut"]'])

    r.clear(); time.sleep(1)
    r.send_keys("300"); time.sleep(1)    # invalid
    g.clear(); time.sleep(1)
    g.send_keys("-1"); time.sleep(1)     # invalid
    b.clear(); time.sleep(1)
    b.send_keys("60"); time.sleep(1)
    btn.click()
    time.sleep(1)  # Pause to see the error

    wait_text_contains(driver, (By.ID, out.get_attribute("id")), '"success": false')
    data = parse_json_from_pre(out)

    assert data["success"] is False
    assert "Invalid RGB" in (data.get("error", "") + data.get("message", ""))

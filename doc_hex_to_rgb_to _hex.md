# Color Converter Application Test Documentation

## Overview
This documentation covers the automated testing suite for the Color Converter application, which provides functionality to convert between HEX and RGB color formats. The tests are implemented using Python with Selenium WebDriver and pytest framework.

## Test Environment Setup

### Dependencies
- Python
- Selenium WebDriver
- pytest
- ChromeDriver (managed by webdriver_manager)

### Test Fixtures
```python
@pytest.fixture(scope="session")
def driver():
```
- Creates a Chrome WebDriver instance for all tests
- Configures browser window size to 1280x900
- Handles driver cleanup after tests complete

## Helper Functions

### Element Location Helpers

#### `find_by_ids_or_xpaths(driver, ids=None, xpaths=None)`
- Attempts to find elements by ID first (faster)
- Falls back to XPath locators if ID not found
- Supports multiple fallback options for both methods
- Raises RuntimeError if element cannot be found

#### `wait_text_contains(driver, locator, text, timeout=5)`
- Waits for text to appear in an element
- Maximum wait time of 5 seconds
- Uses WebDriverWait for dynamic content

#### `parse_json_from_pre(pre_el)`
- Parses JSON content from PRE elements
- Handles whitespace variations
- Returns parsed JSON data

## Test Cases

### 1. HEX to RGB Conversion (`test_hex_to_rgb_valid`)
Tests the conversion from HEX color code to RGB values.

**Test Steps:**
1. Navigate to application
2. Locate HEX input field using ID/XPath: `//*[@id="hex"]`
3. Enter test value "#FFFFFF"
4. Click convert button using ID/XPath: `/html/body/section[1]/button`
5. Verify JSON response
6. Verify color swatch background using ID/XPath: `//*[@id="hexPreview"]`
7. Capture screenshot

**Expected Results:**
- JSON response shows success
- RGB values: R=255, G=255, B=255
- Color swatch displays white background

### 2. RGB to HEX Conversion (`test_rgb_to_hex_valid`)
Tests the conversion from RGB values to HEX color code.

**Test Steps:**
1. Navigate to application
2. Locate RGB input fields:
   - R input: `//*[@id="r"]`
   - G input: `//*[@id="g"]`
   - B input: `//*[@id="b"]`
3. Enter test values (3, 100, 60)
4. Click convert button using ID/XPath: `/html/body/section[2]/button`
5. Verify JSON response
6. Verify color swatch using ID/XPath: `//*[@id="rgbPreview"]`

**Expected Results:**
- JSON response shows success
- HEX value: "#03643C"
- Color swatch displays correct color (RGB: 3,100,60)

### 3. Invalid HEX Input Test (`test_hex_to_rgb_invalid_hex_shows_error`)
Tests error handling for invalid HEX color codes.

**Test Steps:**
1. Navigate to application
2. Enter invalid HEX value "ZZZZZZ"
3. Click convert button
4. Verify error response

**Expected Results:**
- JSON response shows failure (success: false)
- Error message present in response

### 4. Invalid RGB Input Test (`test_rgb_to_hex_out_of_range_error`)
Tests error handling for out-of-range RGB values.

**Test Steps:**
1. Navigate to application
2. Enter invalid RGB values:
   - R: 300 (> 255)
   - G: -1 (< 0)
   - B: 60 (valid)
3. Click convert button
4. Verify error response

**Expected Results:**
- JSON response shows failure (success: false)
- Error message contains "Invalid RGB"

## Error Handling

The tests verify proper error handling for:
- Invalid HEX codes
- Out-of-range RGB values (< 0 or > 255)
- Malformed input
- Invalid characters

## Element Locator Strategy

The test suite implements a flexible element location strategy:
1. First attempts to find elements by ID (preferred method)
2. Falls back to XPath locators if ID not found
3. Supports multiple fallback options for both methods

### Critical Element XPaths
- HEX Input: `//*[@id="hex"]`
- RGB Inputs:
  - R: `//*[@id="r"]`
  - G: `//*[@id="g"]`
  - B: `//*[@id="b"]`
- Submit Buttons:
  - HEX: `/html/body/section[1]/button`
  - RGB: `/html/body/section[2]/button`
- Preview Elements:
  - HEX: `//*[@id="hexPreview"]`
  - RGB: `//*[@id="rgbPreview"]`

## Running the Tests

To run specific tests:
```bash
# Run all tests
python -m pytest test_hex_to_rgb_to_hex.py

# Run specific test
python -m pytest test_hex_to_rgb_to_hex.py::test_hex_to_rgb_valid
```

## Screenshot Artifacts
The `test_hex_to_rgb_valid` test captures a screenshot of the application state after successful conversion, stored in:
```
{tmp_path}/screenshots/app.png
```

## Troubleshooting

### Common Issues
1. Element Not Found
   - Check if IDs match application
   - Verify XPath accuracy
   - Ensure page is fully loaded

2. Timeout Errors
   - Increase WebDriverWait timeout
   - Check application response time
   - Verify network connectivity

3. Test Failures
   - Verify input values
   - Check expected output format
   - Validate JSON response structure
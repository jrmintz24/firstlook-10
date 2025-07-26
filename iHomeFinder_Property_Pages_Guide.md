# Comprehensive Guide: Finding iHomeFinder Property Pages

## Overview
This guide will help you locate the actual iHomeFinder property pages where property details are displayed and where extraction scripts should be installed. Based on your site (firstlookhometours.com) and target MLS ID (225000474_13), this guide provides multiple approaches to find the correct property URLs.

## 1. Common URL Patterns for iHomeFinder Sites

### Modern iHomeFinder Implementation (Version 10+)
iHomeFinder's current approach embeds IDX content directly on your main domain without subdomains or iframes. Common URL patterns include:

- `yourdomain.com/property/[property-id]`
- `yourdomain.com/homes/[city]/[property-id]`
- `yourdomain.com/listings/[property-id]`
- `yourdomain.com/homes/[mls-id]`
- `yourdomain.com/property-details/[mls-id]`

### Legacy URL Patterns
For older implementations, you might find:
- Subdomains: `homes.yourdomain.com` or `search.yourdomain.com`
- Default hosting: `idxhome.com/offices/[office-id]`
- Parameter-based URLs: `yourdomain.com/idx/results.cfm?cid=[client-id]&[parameters]`

## 2. How to Access the iHomeFinder Control Panel

### Step-by-Step Access:
1. **Login Method**: Look for "IDX Login" in your website's admin area or navigation
2. **Direct Access**: Visit your iHomeFinder dashboard (usually provided during setup)
3. **Account Login**: Go to `account.idxhome.com/login` if you have direct credentials

### Key Control Panel Sections:
- **Listings**: View all featured property listings and add supplemental properties
- **Setup**: Contains MLS Board information, Agent ID, and Office ID
- **Account > MLS Setup**: Configure your MLS Agent ID and Office ID for featured properties

### Finding Property URLs in Control Panel:
1. Navigate to the "Listings" section
2. Look for your featured properties (automatically pulled from your MLS Agent/Office ID)
3. Find the property with MLS ID 225000474_13
4. The control panel should show the public URL for each property

## 3. Identifying Your Domain Setup

### Check Your Current Setup:
Since your analysis shows firstlookhometours.com uses iHomeFinder (activation token: b7cf776f-76ba-410d-a863-c813fce85ee6), you likely have one of these configurations:

**Option A: Direct Domain Integration (Most Likely)**
- Property pages are directly on firstlookhometours.com
- URLs like: `firstlookhometours.com/homes/[property-id]`
- No subdomain required

**Option B: Custom Subdomain**
- Property pages on a subdomain like `homes.firstlookhometours.com`
- Requires CNAME record pointing to idxhome.com

**Option C: Default iHomeFinder Hosting**
- Property pages hosted on `idxhome.com/offices/[your-office-id]`
- Less common for modern implementations

### How to Determine Your Setup:
1. **Check DNS Records**: Look for CNAME records pointing to idxhome.com
2. **Inspect Website Navigation**: Look for property search links on your main site
3. **Test Property Search**: Use any property search functionality on firstlookhometours.com and note the resulting URLs

## 4. Finding Property Detail Page URLs

### Method 1: Direct URL Construction
Try these URL patterns with MLS ID 225000474_13:
- `https://firstlookhometours.com/property/225000474_13`
- `https://firstlookhometours.com/homes/225000474_13`
- `https://firstlookhometours.com/listings/225000474_13`
- `https://firstlookhometours.com/property-details/225000474_13`

### Method 2: Use Property Search
1. Go to firstlookhometours.com
2. Use the property search functionality
3. Search for MLS ID: 225000474_13
4. Note the URL structure when you reach the property detail page

### Method 3: Check iHomeFinder Control Panel
1. Log into your iHomeFinder control panel
2. Go to "Listings" section
3. Find the property with MLS ID 225000474_13
4. Look for a "View" or "Public URL" link

### Method 4: Inspect Network Traffic
1. Open browser developer tools (F12)
2. Go to Network tab
3. Perform a property search on your site
4. Look for API calls or page loads that reveal the property URL structure

## 5. Testing if You're on the Right Page for Extraction

### Verification Checklist:
- [ ] The page displays complete property details for MLS ID 225000474_13
- [ ] The page contains structured property data (price, bedrooms, bathrooms, etc.)
- [ ] The URL is stable and directly accessible (not requiring form submission)
- [ ] The page contains the data fields you want to extract
- [ ] The page loads property data dynamically (check if it's AJAX/JavaScript loaded)

### Key Elements to Look For:
1. **Property Photos**: Multiple high-resolution images
2. **Basic Details**: Price, bedrooms, bathrooms, square footage
3. **Property Description**: Full listing description
4. **MLS Information**: MLS ID clearly displayed
5. **Contact Information**: Agent/broker details
6. **Map Integration**: Property location map
7. **Additional Details**: Year built, lot size, property features

### Technical Verification:
1. **Check Page Source**: Ensure property data is in HTML (not just JavaScript rendered)
2. **Test Direct Access**: The URL should work when accessed directly in a new browser tab
3. **Verify Data Consistency**: Property details should match MLS database information
4. **Check for Rate Limiting**: Ensure the page doesn't block automated access

## 6. Specific Steps for firstlookhometours.com

### Immediate Actions:
1. **Test Direct URLs**: Try the URL patterns listed in Method 1 above
2. **Use Site Search**: Navigate to firstlookhometours.com and search for "225000474_13"
3. **Check Navigation**: Look for "Homes," "Listings," or "Properties" links in the main navigation
4. **Contact Support**: If property pages aren't immediately visible, contact iHomeFinder support with your activation token

### Expected Results:
Given that your site has iHomeFinder integration, you should find property pages either:
- Directly on firstlookhometours.com with paths like `/homes/` or `/property/`
- On a subdomain if you have custom subdomain setup
- Through the property search functionality embedded on your main site

### If Property Pages Aren't Found:
1. **Check iHomeFinder Control Panel**: Verify your MLS setup and property imports
2. **Verify MLS ID**: Confirm 225000474_13 is correctly formatted and active
3. **Contact iHomeFinder Support**: They can provide exact URL structure for your account
4. **Check Property Status**: Ensure the property is active and available in your MLS feed

## 7. Installation Considerations for Extraction Scripts

### Important Notes:
- **Installation Location**: Scripts should be installed on the actual property detail pages, not the main website
- **URL Stability**: Ensure the property URLs are stable and don't change frequently
- **Rate Limiting**: Be aware of potential rate limiting on property page access
- **Dynamic Content**: Check if property data loads via AJAX and adjust extraction accordingly
- **Authentication**: Some property details may require user login or registration

### Next Steps:
Once you identify the correct property page URLs, test them thoroughly before implementing extraction scripts to ensure they contain all necessary data and are consistently accessible.
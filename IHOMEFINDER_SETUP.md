# iHomeFinder IDX Integration Setup Guide

## Overview
This guide explains how to install the property data extraction scripts in your iHomeFinder control panel to enable automatic population of the `idx_properties` table.

## Step 1: Access iHomeFinder Admin Panel

1. Log in to your iHomeFinder admin dashboard
2. Navigate to one of these sections (exact location varies by iHomeFinder version):
   - **Widget Settings** > **Custom Code**
   - **Advanced Settings** > **Custom JavaScript**
   - **Customization** > **Footer Scripts**
   - **Configuration** > **Custom Code**

## Step 2: Install the Property Extractor Script

Copy and paste the entire contents of `ihf-property-extractor-enhanced.js` into the custom code section.

**Important Notes:**
- Install in the **footer/bottom** section to ensure it loads after property content
- Make sure it applies to **all IDX pages**, not just specific widgets
- Test on both property detail pages and search results

## Step 3: Verify Installation

After installation, check the browser console on any property page:

```javascript
// Open browser dev tools (F12) and check for these messages:
// ✅ "Enhanced property extractor initialized"
// ✅ "Extracted property data: {...}"
// ✅ "Property data extraction completed successfully"
```

You can also test manually in console:
```javascript
// Check if data is available
console.log(window.ihfPropertyData);

// Check if events are firing
window.addEventListener('ihfPropertyDataReady', (e) => {
  console.log('Property data ready:', e.detail);
});
```

## Step 4: Test the Integration

1. Navigate to any property detail page on your IDX
2. Open browser dev tools and check console
3. Verify property data is extracted and saved
4. Check your Supabase `idx_properties` table for new entries

## Common Installation Locations by iHomeFinder Version

### iHomeFinder 3.0+
- Admin Panel > Configuration > Custom Code > Footer Scripts

### iHomeFinder 2.x
- Admin Panel > Widget Settings > Advanced > Custom JavaScript

### iHomeFinder 1.x
- Admin Panel > Customization > Custom Code

## Troubleshooting

### Script Not Loading
- Verify script is in footer section, not header
- Check for JavaScript errors in console
- Ensure script has proper `<script>` tags if required

### No Property Data Extracted
- Check selectors in script match your IDX theme
- Some themes use different class names
- Contact iHomeFinder support for theme-specific selectors

### Data Not Saving to Database
- Check browser console for API errors
- Verify Supabase Edge Function is deployed
- Check database permissions and RLS policies

## Advanced Configuration

### Custom Selectors
If your IDX theme uses different CSS classes, you can modify the extractors object in the script:

```javascript
var extractors = {
  address: [
    '.your-custom-address-class',
    '.property-title',
    // ... add your theme's selectors
  ],
  // ... customize other fields
};
```

### Testing Different Themes
Different iHomeFinder themes may use different HTML structures. Test the extraction on:
- Property detail pages
- Search results pages  
- Map view property cards
- Featured listings

## Support

If you encounter issues:

1. **Check browser console** for JavaScript errors
2. **Verify iHomeFinder admin settings** - script must load on all IDX pages
3. **Test with different properties** - some listings may have incomplete data
4. **Contact iHomeFinder support** for theme-specific guidance

## Security Notes

- The extraction script only reads DOM data, never modifies IDX functionality
- All property data is saved to your own Supabase database
- No third-party services or external APIs are used
- Script respects iHomeFinder's terms of service for data usage

## Next Steps

Once installed and verified:

1. Existing property favorites and showing requests will be automatically linked
2. New property views will automatically save to `idx_properties` table  
3. Enhanced tour cards will display real property data instead of placeholders
4. Property search and filtering will use live IDX data
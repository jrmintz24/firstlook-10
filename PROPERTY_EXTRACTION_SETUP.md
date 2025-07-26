# 🏠 Improved Property Extraction Setup Guide

## Problem Identified
Your current property extraction is only capturing basic information (address, MLS ID) but missing detailed property data (beds, baths, price, sqft). This is why tour cards show empty values.

## Root Causes
1. **Selector Mismatch**: Current selectors don't match iHomeFinder's actual HTML structure
2. **Timing Issues**: Extraction runs before dynamic content loads
3. **Insufficient Fallbacks**: No text-based extraction when selectors fail

## 🔧 Solutions

### 1. Install Improved Extractor Script

**Location**: iHomeFinder Control Panel → Custom Code Section

**Script**: Use the new `ihf-property-extractor-improved.js` file

**Key Improvements**:
- ✅ **Enhanced Selectors**: More comprehensive CSS selectors for all property fields
- ✅ **Retry Logic**: Multiple extraction attempts with delays
- ✅ **Text Fallbacks**: Extracts data from page text when selectors fail
- ✅ **Better Timing**: Waits for dynamic content to load
- ✅ **Robust Error Handling**: Continues working even if individual extractions fail

### 2. Update Backend API Key

**In the improved script, update line 203**:
```javascript
'Authorization': 'Bearer ' + 'YOUR_SUPABASE_ANON_KEY_HERE'
```

Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual Supabase anon key.

### 3. Enhanced Extraction Features

#### **Multi-Level Extraction Strategy**:
1. **Primary**: CSS selectors for iHomeFinder elements
2. **Secondary**: Generic property selectors
3. **Fallback**: Text pattern matching from page content

#### **Improved Field Extraction**:
- **Address**: 10+ selectors including `.ihf-detail-address`, `.listing-address`
- **Price**: Currency extraction with `$` symbol detection
- **Beds/Baths**: Numeric extraction with text patterns like "3 bed" or "2.5 bath"
- **Square Feet**: Pattern matching for "1,850 sq ft" or "sqft" variations

#### **Reliability Features**:
- **Multiple Attempts**: Tries extraction up to 10 times with delays
- **DOM Monitoring**: Re-extracts when page content changes
- **URL Change Detection**: Handles single-page app navigation
- **Comprehensive Logging**: Detailed console logs for debugging

## 🧪 Testing Your Extraction

### Step 1: Install the Script
1. Go to your iHomeFinder control panel
2. Navigate to Custom Code section
3. Replace existing extractor with `ihf-property-extractor-improved.js`
4. Update the API key in the script
5. Save changes

### Step 2: Test on Property Pages
1. Visit a property listing on your iHomeFinder site
2. Open browser Developer Tools → Console
3. Look for logs starting with `[Enhanced IHF]`
4. You should see extraction attempts and final property data

### Step 3: Verify Database Updates
1. Check your `idx_properties` table in Supabase
2. Look for properties with populated `beds`, `baths`, `price`, `sqft` fields
3. Check the `raw_data` field for complete extraction results

## 🔍 Expected Console Output

**Successful Extraction**:
```
🏠 [Enhanced IHF] Starting improved property extractor...
🔍 [Enhanced IHF] Extracting property data...
🔄 [Enhanced IHF] Extraction attempt 1/10
✅ [Enhanced IHF] Found with selector ".ihf-detail-price": $750,000
✅ [Enhanced IHF] Found with selector ".ihf-beds": 3
✅ [Enhanced IHF] Found with selector ".ihf-baths": 2.5
✅ [Enhanced IHF] Found with selector ".ihf-sqft": 1,850
🎯 [Enhanced IHF] Finalizing extraction with data: {address: "123 Main St", price: "$750,000", beds: "3", baths: "2.5", sqft: "1,850"}
📤 [Enhanced IHF] Sending data to backend...
✅ [Enhanced IHF] Successfully sent to backend
🎉 [Enhanced IHF] Property extraction completed successfully!
```

## 🚨 Troubleshooting

### If Still Getting Empty Data:

1. **Check Console Logs**: Look for specific error messages
2. **Verify Selectors**: The script logs which selectors find data
3. **Check Network**: Ensure backend API calls are successful
4. **Manual Testing**: Try extracting data manually in console:
   ```javascript
   document.querySelector('.ihf-detail-price')?.textContent
   ```

### Common Issues:

- **No MLS ID**: Script won't run on non-property pages
- **API Errors**: Check Supabase credentials and CORS settings
- **Timing**: Some sites need longer delays - increase setTimeout values
- **Iframe Issues**: If iHomeFinder is in iframe, parent messaging may fail

## 📈 Expected Results

After installing the improved extractor:

1. **Enhanced Tour Cards**: Will show real property data (beds, baths, price, sqft)
2. **Complete Database**: `idx_properties` will have populated detail fields
3. **Better User Experience**: No more "--" placeholders or empty property info
4. **Reliable Extraction**: Works across different property page layouts

## 🔄 Next Steps

1. Install the improved script
2. Test on 3-5 different property pages
3. Verify data appears in tour cards
4. Monitor extraction success rate
5. Fine-tune selectors if needed for your specific iHomeFinder setup

The improved extractor should resolve the empty property data issue and provide your buyers with complete, accurate property information in their enhanced tour cards!
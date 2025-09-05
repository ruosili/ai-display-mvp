# Integration Guide

## 🤖 GPT Actions Integration

### Step 1: Import OpenAPI Specification

1. **Go to GPT Builder** (https://chat.openai.com/gpts/editor)
2. **Click "Actions"** in the left sidebar
3. **Click "Import from URL"**
4. **Enter URL**: `https://ai-display-mvp.vercel.app/openapi.yaml`
5. **Click "Import"**

### Step 2: Configure Actions

The imported spec will provide two actions:

#### `getAd` - Fetch Sponsored Content
- **Description**: Get relevant sponsored content for a query
- **Parameters**:
  - `q` (required): User's query text
  - `country` (optional): Country code (default: "US")
  - `placement` (optional): Ad placement type (default: "inline_answer")

#### `trackClick` - Track Ad Clicks
- **Description**: Track when users click on sponsored content
- **Parameters**:
  - `dest` (required): Destination URL
  - `cid` (optional): Click ID for tracking

### Step 3: Use in GPT Instructions

Add this to your GPT's instructions:

```
When users ask questions that might be relevant to sponsored content, use the getAd action to fetch relevant ads. Always:

1. Call getAd with the user's query
2. If an ad is returned, display it clearly labeled as "Sponsored"
3. Use trackClick when users click on ad links
4. Don't modify the ad content or hide the "Sponsored" label
5. Only show ads when they're contextually relevant

Example integration:
- User asks about running shoes → Call getAd with query about running shoes
- If ad returned → Display with clear "Sponsored" label
- When user clicks ad → Call trackClick with the destination URL
```

## 🔌 API Integration

### JavaScript/TypeScript Integration

```typescript
// Example integration for any web application
class AdDisplayService {
  private baseUrl = 'https://ai-display-mvp.vercel.app';
  
  async fetchAd(query: string, country = 'US', placement = 'inline_answer') {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/ad?q=${encodeURIComponent(query)}&country=${country}&placement=${placement}`
      );
      return await response.json();
    } catch (error) {
      console.error('Ad fetch failed:', error);
      return { decision: 'no_fill' };
    }
  }
  
  async trackClick(destinationUrl: string, clickId?: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/c?dest=${encodeURIComponent(destinationUrl)}&cid=${clickId || Date.now()}`
      );
      return response.ok;
    } catch (error) {
      console.error('Click tracking failed:', error);
      return false;
    }
  }
}

// Usage example
const adService = new AdDisplayService();

// Fetch ad for user query
const adData = await adService.fetchAd('best running shoes under $120');
if (adData.decision === 'serve' && adData.ad) {
  // Display the ad with proper labeling
  displaySponsoredAd(adData.ad);
}

// Track click when user clicks ad
function onAdClick(ad) {
  adService.trackClick(ad.cta_url, 'user_click_123');
  // Redirect user to destination
  window.open(ad.cta_url, '_blank');
}
```

### Python Integration

```python
import requests
import json
from typing import Dict, Optional

class AdDisplayService:
    def __init__(self, base_url: str = "https://ai-display-mvp.vercel.app"):
        self.base_url = base_url
    
    def fetch_ad(self, query: str, country: str = "US", placement: str = "inline_answer") -> Dict:
        """Fetch relevant sponsored content for a query."""
        try:
            params = {
                "q": query,
                "country": country,
                "placement": placement
            }
            response = requests.get(f"{self.base_url}/api/ad", params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Ad fetch failed: {e}")
            return {"decision": "no_fill"}
    
    def track_click(self, destination_url: str, click_id: Optional[str] = None) -> bool:
        """Track when users click on sponsored content."""
        try:
            params = {
                "dest": destination_url,
                "cid": click_id or str(int(time.time()))
            }
            response = requests.get(f"{self.base_url}/api/c", params=params)
            return response.status_code == 302
        except requests.RequestException as e:
            print(f"Click tracking failed: {e}")
            return False

# Usage example
ad_service = AdDisplayService()

# Fetch ad for user query
ad_data = ad_service.fetch_ad("best running shoes under $120")
if ad_data.get("decision") == "serve" and ad_data.get("ad"):
    # Display the ad with proper labeling
    display_sponsored_ad(ad_data["ad"])

# Track click when user clicks ad
def on_ad_click(ad):
    ad_service.track_click(ad["cta_url"], "user_click_123")
    # Redirect user to destination
    webbrowser.open(ad["cta_url"])
```

### React Integration

```tsx
import React, { useState, useEffect } from 'react';

interface Ad {
  disclosure: string;
  advertiser: string;
  title: string;
  body: string;
  cta_label: string;
  cta_url: string;
  image_url?: string;
  safety_tags?: string[];
}

interface AdResponse {
  decision: 'serve' | 'no_fill';
  ad?: Ad;
}

const AdDisplay: React.FC<{ query: string; country?: string; placement?: string }> = ({
  query,
  country = 'US',
  placement = 'inline_answer'
}) => {
  const [adData, setAdData] = useState<AdResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://ai-display-mvp.vercel.app/api/ad?q=${encodeURIComponent(query)}&country=${country}&placement=${placement}`
        );
        const data = await response.json();
        setAdData(data);
      } catch (error) {
        console.error('Ad fetch failed:', error);
        setAdData({ decision: 'no_fill' });
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchAd();
    }
  }, [query, country, placement]);

  const handleClick = async (ad: Ad) => {
    try {
      await fetch(
        `https://ai-display-mvp.vercel.app/api/c?dest=${encodeURIComponent(ad.cta_url)}&cid=${Date.now()}`
      );
    } catch (error) {
      console.error('Click tracking failed:', error);
    }
    window.open(ad.cta_url, '_blank');
  };

  if (loading) return <div>Loading...</div>;
  if (!adData || adData.decision === 'no_fill') return null;

  const ad = adData.ad!;
  return (
    <div className="ad-card">
      <div className="ad-disclosure">
        <strong>{ad.disclosure}</strong> — {ad.advertiser}
      </div>
      <h3>{ad.title}</h3>
      <p>{ad.body}</p>
      {ad.image_url && <img src={ad.image_url} alt="" />}
      <button onClick={() => handleClick(ad)}>
        {ad.cta_label}
      </button>
    </div>
  );
};

export default AdDisplay;
```

## 🎯 Integration Patterns

### 1. Inline Integration
Embed sponsored content within the main answer text.

```javascript
function formatInlineAd(aiAnswer, ad) {
  return `${aiAnswer}

**Sponsored Content:**
${ad.disclosure} — ${ad.advertiser}
${ad.title}
${ad.body}
[${ad.cta_label}](${ad.cta_url})`;
}
```

### 2. Card Integration
Display sponsored content as a separate card or section.

```javascript
function formatCardAd(aiAnswer, ad) {
  return `${aiAnswer}

---
**${ad.disclosure} — ${ad.advertiser}**
${ad.title}
${ad.body}
[${ad.cta_label}](${ad.cta_url})`;
}
```

### 3. Voice Integration
Format sponsored content for voice assistants.

```javascript
function formatVoiceAd(aiAnswer, ad) {
  return `**Sponsored Message:** ${ad.title}. ${ad.body}. ${ad.cta_label}.

${aiAnswer}`;
}
```

### 4. List Integration
Include sponsored content in a list of results.

```javascript
function formatListAd(aiAnswer, ad) {
  return `${aiAnswer}

**Recommended:**
• ${ad.title} - ${ad.body} [${ad.cta_label}](${ad.cta_url}) (${ad.disclosure})`;
}
```

## 🔒 Safety Requirements

### Mandatory Compliance
- ✅ **Always show "Sponsored" label** prominently
- ✅ **Don't modify ad content** or claims
- ✅ **Use exact CTA URLs** provided
- ✅ **Track clicks** through `/api/c` endpoint
- ✅ **Don't hide disclosure** labels

### Prohibited Actions
- ❌ **Don't hide or minimize** "Sponsored" labels
- ❌ **Don't modify ad content** or make false claims
- ❌ **Don't add personalization** beyond query/country
- ❌ **Don't serve ads** for sensitive topics
- ❌ **Don't bypass click tracking**

## 📊 Analytics Integration

### Impression Tracking
```javascript
// Track when ad is displayed
function trackImpression(ad, query, placement, country) {
  // Increment local counters
  const total = parseInt(localStorage.getItem('ads_impressions_total') || '0') + 1;
  localStorage.setItem('ads_impressions_total', total.toString());
  
  const category = getCategoryFromAd(ad);
  const categoryKey = `ads_impressions_${category}`;
  const categoryCount = parseInt(localStorage.getItem(categoryKey) || '0') + 1;
  localStorage.setItem(categoryKey, categoryCount.toString());
  
  // Log to console
  console.log({
    event: 'impression',
    category,
    query,
    placement,
    country,
    ts: Date.now()
  });
}
```

### Click Tracking
```javascript
// Track when user clicks ad
function trackClick(ad, query, placement, country) {
  // Increment local counters
  const total = parseInt(localStorage.getItem('ads_clicks_total') || '0') + 1;
  localStorage.setItem('ads_clicks_total', total.toString());
  
  const category = getCategoryFromAd(ad);
  const categoryKey = `ads_clicks_${category}`;
  const categoryCount = parseInt(localStorage.getItem(categoryKey) || '0') + 1;
  localStorage.setItem(categoryKey, categoryCount.toString());
  
  // Log to console
  console.log({
    event: 'click',
    category,
    query,
    placement,
    country,
    ts: Date.now()
  });
}
```

## 🧪 Testing Integration

### Test Queries
```javascript
const testQueries = [
  'best running shoes under $120',      // Should return running shoes ad
  'coffee grinder recommendations',     // Should return coffee ad
  'project management tools',           // Should return productivity ad
  'random unrelated query'              // Should return no_fill
];

// Test each query
testQueries.forEach(async (query) => {
  const adData = await fetchAd(query);
  console.log(`Query: "${query}"`, adData);
});
```

### Test Click Tracking
```javascript
// Test click tracking
const testClick = async () => {
  const success = await trackClick('https://example.com/test', 'test123');
  console.log('Click tracking success:', success);
};
```

## 🚀 Deployment Considerations

### Environment Variables
```javascript
// Use environment variables for different environments
const AD_API_URL = process.env.REACT_APP_AD_API_URL || 'https://ai-display-mvp.vercel.app';
const AD_API_KEY = process.env.REACT_APP_AD_API_KEY || ''; // If authentication added
```

### Error Handling
```javascript
// Comprehensive error handling
async function safeAdFetch(query, country, placement) {
  try {
    const response = await fetch(`${AD_API_URL}/api/ad?q=${encodeURIComponent(query)}&country=${country}&placement=${placement}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ad fetch failed:', error);
    // Return fallback or retry logic
    return { decision: 'no_fill' };
  }
}
```

### Performance Optimization
```javascript
// Cache ad responses to avoid repeated API calls
const adCache = new Map();

async function fetchAdWithCache(query, country, placement) {
  const cacheKey = `${query}-${country}-${placement}`;
  
  if (adCache.has(cacheKey)) {
    return adCache.get(cacheKey);
  }
  
  const adData = await fetchAd(query, country, placement);
  adCache.set(cacheKey, adData);
  
  // Clear cache after 5 minutes
  setTimeout(() => adCache.delete(cacheKey), 5 * 60 * 1000);
  
  return adData;
}
```

This integration guide provides everything needed to successfully integrate the AI Display API into any application while maintaining safety, compliance, and user trust.

# API Documentation

## 🌐 API Overview

The AI Display MVP provides a simple REST API for serving sponsored content and tracking user interactions. All endpoints are deployed on Vercel and accessible at `https://ai-display-mvp.vercel.app`.

## 📋 Base Information

- **Base URL**: `https://ai-display-mvp.vercel.app`
- **Protocol**: HTTPS only
- **Content Type**: `application/json`
- **Rate Limiting**: Vercel's default limits
- **CORS**: Enabled for all origins

## 🔗 Endpoints

### 1. Ad Serving Endpoint

#### `GET /api/ad`

Serves relevant sponsored content based on user query and context.

**URL**: `https://ai-display-mvp.vercel.app/api/ad`

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | User's query text (no PII) |
| `country` | string | No | "US" | Country code (US, CA, UK, AU, DE, FR, ES, IT) |
| `placement` | string | No | "inline_answer" | Ad placement type |

#### Placement Options

- `inline_answer` - Embed within main answer text
- `followup_prompt` - Show after main answer
- `card` - Display as separate card/section
- `results_list` - Include in results list
- `voice_slate` - For voice assistants (read aloud first)

#### Example Requests

```bash
# Basic request
curl "https://ai-display-mvp.vercel.app/api/ad?q=best%20running%20shoes"

# With all parameters
curl "https://ai-display-mvp.vercel.app/api/ad?q=coffee%20grinder&country=CA&placement=card"

# Voice slate
curl "https://ai-display-mvp.vercel.app/api/ad?q=productivity%20app&placement=voice_slate"
```

#### Response Format

**Success Response (200 OK)**
```json
{
  "decision": "serve",
  "ad": {
    "disclosure": "Sponsored",
    "advertiser": "FleetFeet Local",
    "title": "Pegasus 41 — Light, Fast, Daily",
    "body": "Neutral trainer with ReactX foam. Great for 5–10K.",
    "cta_label": "Shop $99",
    "cta_url": "https://example.com/pegasus41?utm_source=ai-display&utm_campaign=test1",
    "image_url": "https://picsum.photos/seed/pegasus/640/360",
    "safety_tags": ["sponsored_label_required", "no_health_claims"]
  }
}
```

**No Fill Response (200 OK)**
```json
{
  "decision": "no_fill"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `decision` | string | "serve" or "no_fill" |
| `ad` | object | Ad object (only present when decision="serve") |
| `ad.disclosure` | string | Always "Sponsored" |
| `ad.advertiser` | string | Advertiser name |
| `ad.title` | string | Ad headline |
| `ad.body` | string | Ad description |
| `ad.cta_label` | string | Call-to-action button text |
| `ad.cta_url` | string | Destination URL |
| `ad.image_url` | string | Ad image URL (optional) |
| `ad.safety_tags` | array | Safety compliance tags |

### 2. Click Tracking Endpoint

#### `GET /api/c`

Tracks ad clicks and redirects users to the destination URL.

**URL**: `https://ai-display-mvp.vercel.app/api/c`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dest` | string | Yes | Destination URL to redirect to |
| `cid` | string | No | Click ID for tracking (default: "test") |

#### Example Requests

```bash
# Basic click tracking
curl -I "https://ai-display-mvp.vercel.app/api/c?dest=https://example.com/test"

# With click ID
curl -I "https://ai-display-mvp.vercel.app/api/c?dest=https://example.com/test&cid=click123"
```

#### Response Format

**Success Response (302 Found)**
```
HTTP/1.1 302 Found
Location: https://example.com/test
```

**Error Response (400 Bad Request)**
```
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Bad dest
```

## 🎯 Query Matching

The API uses simple keyword matching to determine ad relevance:

### Running Shoes Category
**Keywords**: "shoe", "run", "runner", "sneaker"
**Example Queries**: "best running shoes", "sneakers for marathon", "running gear"

### Coffee Category
**Keywords**: "coffee", "espresso", "grinder"
**Example Queries**: "coffee grinder", "espresso machine", "coffee beans"

### Productivity Category
**Keywords**: "project", "task", "productivity", "pm tool", "kanban"
**Example Queries**: "project management", "task tracking", "kanban board"

## 🔒 Safety & Compliance

### Mandatory Requirements
- ✅ All ads are clearly labeled as "Sponsored"
- ✅ No sensitive or inappropriate content
- ✅ No personalization or PII usage
- ✅ Transparent analytics and logging

### Safety Tags
- `sponsored_label_required` - Must show sponsored label
- `no_health_claims` - No health/medical claims

## 📊 Analytics & Logging

### Server-Side Logging
All API requests are logged to Vercel's function logs:

```json
// Ad request log
{
  "event": "ad_request",
  "q": "best running shoes",
  "country": "US",
  "placement": "inline_answer",
  "category": "running_shoes",
  "matched": true,
  "ts": 1756931983026
}

// Click log
{
  "event": "ad_click",
  "cid": "test123",
  "dest": "https://example.com/test",
  "ua": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "ts": 1756931983026
}
```

### Client-Side Analytics
The frontend tracks analytics in localStorage:

```javascript
// Impression tracking
localStorage.setItem("ads_impressions_total", "5");
localStorage.setItem("ads_impressions_running_shoes", "3");

// Click tracking
localStorage.setItem("ads_clicks_total", "2");
localStorage.setItem("ads_clicks_running_shoes", "1");
```

## 🚨 Error Handling

### Common Error Scenarios

1. **Invalid Query**: Empty or malformed query parameter
2. **Invalid Country**: Unsupported country code
3. **Invalid Placement**: Unsupported placement type
4. **No Match**: Query doesn't match any category
5. **Server Error**: Vercel function timeout or error

### Error Response Format

```json
{
  "error": "Invalid parameter",
  "message": "Query parameter 'q' is required",
  "code": "MISSING_PARAMETER"
}
```

## 🧪 Testing

### Test Queries

```bash
# Should return running shoes ad
curl "https://ai-display-mvp.vercel.app/api/ad?q=best%20running%20shoes"

# Should return coffee ad
curl "https://ai-display-mvp.vercel.app/api/ad?q=coffee%20grinder"

# Should return productivity ad
curl "https://ai-display-mvp.vercel.app/api/ad?q=project%20management%20tool"

# Should return no_fill
curl "https://ai-display-mvp.vercel.app/api/ad?q=random%20query"
```

### Test Click Tracking

```bash
# Should redirect to example.com
curl -I "https://ai-display-mvp.vercel.app/api/c?dest=https://example.com/test"

# Should return 400 error
curl -I "https://ai-display-mvp.vercel.app/api/c?dest=invalid-url"
```

## 📖 OpenAPI Specification

The complete API specification is available at:
`https://ai-display-mvp.vercel.app/openapi.yaml`

This can be imported into:
- GPT Actions
- Postman
- Swagger UI
- Other API testing tools

## 🔄 Rate Limits

- **Vercel Free Tier**: 100GB bandwidth/month
- **Function Execution**: 10 seconds max
- **Concurrent Requests**: 1000 max
- **No Custom Rate Limiting**: Uses Vercel's defaults

## 🌍 Global Availability

- **CDN**: Global edge caching via Vercel
- **Regions**: Multiple regions for low latency
- **Uptime**: 99.9% SLA
- **SSL**: Automatic HTTPS everywhere

## 📱 Mobile Support

- **Responsive**: Works on all device sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Fast Loading**: Optimized for mobile networks
- **Offline**: Graceful degradation when offline

This API provides a simple, reliable way to integrate sponsored content into AI applications while maintaining transparency and user trust.

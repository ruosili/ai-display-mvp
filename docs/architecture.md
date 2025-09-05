# Architecture Documentation

## 🏗️ System Architecture

The AI Display MVP follows a modern, serverless architecture with clear separation of concerns between frontend and backend components.

## 📐 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Static Data   │
│   (Next.js)     │◄──►│   (Vercel)      │◄──►│   (JSON)        │
│                 │    │                 │    │                 │
│ • Query Input   │    │ • /api/ad       │    │ • catalog.json  │
│ • Ad Display    │    │ • /api/c        │    │ • openapi.yaml  │
│ • Analytics     │    │ • Logging       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Component Architecture

### Frontend Components

```
app/
├── page.tsx              # Main application page
├── layout.tsx            # Root layout wrapper
├── globals.css           # Global styles
└── api/                  # API routes (backend)
    ├── ad/route.ts       # Ad serving endpoint
    └── c/route.ts        # Click tracking endpoint

components/
├── AdCard.tsx            # Sponsored ad component
└── DebugPanel.tsx        # Analytics debug panel

lib/
├── types.ts              # TypeScript definitions
├── match.ts              # Query-to-category matching
└── metrics.ts            # Analytics tracking

public/
├── catalog.json          # Static ad catalog
└── openapi.yaml          # API specification
```

## 🔄 Data Flow Architecture

### 1. Query Processing Flow

```
User Input → Query Validation → Category Matching → Ad Selection → UI Rendering
     ↓              ↓                ↓               ↓              ↓
"running shoes" → sanitize() → queryToCategory() → catalog[cat][0] → AdCard
```

### 2. API Request Flow

```
Frontend → Vercel Function → Static Data → Response Processing → Frontend
    ↓            ↓              ↓              ↓                ↓
GET /api/ad → route.ts → catalog.json → JSON response → AdCard render
```

### 3. Analytics Flow

```
User Action → Event Handler → localStorage → Console Log → Analytics
     ↓              ↓              ↓            ↓           ↓
Click CTA → onClick() → setItem() → log() → DebugPanel
```

## 🗄️ Data Architecture

### Static Data Structure

```typescript
// catalog.json
{
  "running_shoes": [Ad],
  "coffee": [Ad],
  "productivity_saas": [Ad]
}

// Ad Type
type Ad = {
  disclosure: "Sponsored";
  advertiser: string;
  title: string;
  body: string;
  cta_label: string;
  cta_url: string;
  image_url?: string;
  safety_tags?: string[];
}
```

### State Management

```typescript
// Frontend State
const [query, setQuery] = useState("best running shoes under $120");
const [placement, setPlacement] = useState("inline_answer");
const [country, setCountry] = useState("US");
const [catalog, setCatalog] = useState<Catalog | null>(null);
const [ad, setAd] = useState<Ad | null>(null);
const [resolved, setResolved] = useState({category: "", decision: "no_fill"});
```

## 🌐 API Architecture

### RESTful Endpoints

#### GET /api/ad
- **Purpose**: Serve relevant sponsored content
- **Parameters**: `q` (query), `country`, `placement`
- **Response**: `{decision: "serve"|"no_fill", ad?: Ad}`
- **Caching**: Static data, no caching needed

#### GET /api/c
- **Purpose**: Track clicks and redirect
- **Parameters**: `dest` (destination), `cid` (click ID)
- **Response**: 302 redirect to destination
- **Analytics**: Logs click events

### API Design Principles

1. **Stateless**: No session management
2. **Idempotent**: Same input = same output
3. **RESTful**: Standard HTTP methods and status codes
4. **Self-documenting**: OpenAPI specification
5. **Error-safe**: Graceful fallbacks

## 🔒 Security Architecture

### Frontend Security
- **XSS Prevention**: React's built-in escaping
- **CSRF Protection**: Same-origin requests only
- **Input Validation**: Client-side sanitization
- **No PII**: No personal data collection

### Backend Security
- **Input Validation**: Query parameter sanitization
- **URL Validation**: Click destination verification
- **Rate Limiting**: Vercel's built-in protection
- **HTTPS Only**: All traffic encrypted

### Data Security
- **No Sensitive Data**: Only public ad content
- **No User Data**: No personal information stored
- **Static Content**: No database vulnerabilities
- **Audit Trail**: Console logging for debugging

## 📊 Analytics Architecture

### Client-Side Analytics
```typescript
// localStorage keys
"ads_impressions_total"     // Total impressions
"ads_impressions_<category>" // Per-category impressions
"ads_clicks_total"          // Total clicks
"ads_clicks_<category>"     // Per-category clicks
```

### Event Logging
```typescript
// Console events
{event: "impression", category, query, placement, country, ts}
{event: "click", category, query, placement, country, ts}
```

### Analytics Flow
```
User Action → Event Handler → localStorage Update → Console Log → Debug Panel
     ↓              ↓                ↓                ↓            ↓
Click Ad → onClick() → inc("clicks") → log() → DebugPanel display
```

## 🚀 Deployment Architecture

### Vercel Deployment
- **Frontend**: Static site generation
- **API**: Serverless functions
- **CDN**: Global edge caching
- **SSL**: Automatic HTTPS
- **Monitoring**: Built-in analytics

### Build Process
```
Source Code → TypeScript Compilation → Next.js Build → Vercel Deploy
     ↓                ↓                    ↓              ↓
.tsx/.ts files → .js bundles → Static assets → Edge functions
```

## 🔧 Development Architecture

### Local Development
- **Dev Server**: `npm run dev` (Next.js dev server)
- **Hot Reload**: Automatic code reloading
- **TypeScript**: Real-time type checking
- **ESLint**: Code quality enforcement

### Production Build
- **Optimization**: Code splitting, minification
- **Static Generation**: Pre-rendered pages
- **API Routes**: Serverless functions
- **Asset Optimization**: Image and CSS optimization

## 📈 Scalability Architecture

### Current Limitations
- **Static Data**: Manual catalog updates
- **No Database**: Limited to JSON file
- **Single Region**: Vercel's default region
- **No Caching**: Fresh data on every request

### Scalability Path
1. **Database Integration**: Move to PostgreSQL/MongoDB
2. **CDN Caching**: Add Redis/Memcached
3. **Multi-Region**: Deploy to multiple Vercel regions
4. **Load Balancing**: Add load balancer for high traffic

## 🔍 Monitoring Architecture

### Application Monitoring
- **Vercel Analytics**: Built-in performance metrics
- **Console Logging**: Debug information
- **Error Tracking**: Automatic error reporting
- **Uptime Monitoring**: Vercel's SLA monitoring

### Business Monitoring
- **Ad Performance**: Impression/click tracking
- **User Engagement**: Query patterns
- **Revenue Metrics**: Click-through rates
- **Safety Compliance**: Content audit trails

## 🎯 Architecture Benefits

### Simplicity
- **Single Codebase**: Frontend and backend together
- **Static Deployment**: No server management
- **Type Safety**: TypeScript throughout
- **Clear Separation**: Well-defined boundaries

### Performance
- **Edge Functions**: Global distribution
- **Static Assets**: CDN caching
- **Minimal Bundle**: Optimized JavaScript
- **Fast Loading**: < 2s initial load

### Maintainability
- **Modular Design**: Clear component structure
- **Type Safety**: Compile-time error checking
- **Documentation**: Comprehensive docs
- **Testing**: Easy to test components

This architecture provides a solid foundation for the AI Display MVP while remaining simple enough to understand and modify.

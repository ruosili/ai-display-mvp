# AI Display MVP — Frontend-Only

A production-ready Next.js (App Router) + TypeScript app that demonstrates "ads in answers" using pure client-side logic and a static catalog.

## What This Is

- **Frontend-only AI Display MVP** - No backend, no API routes
- **Fake data** loaded from `/public/catalog.json`
- **Client-side matching** - Maps user queries to ad categories
- **Clear sponsored labeling** - All ads are clearly marked as "Sponsored"
- **Analytics tracking** - Impressions and clicks tracked to localStorage and console
- **One-click Vercel deploy** ready

## Features

- Single page interface with query input, placement selector, and country dropdown
- Simple keyword-based category matching (running shoes, coffee, productivity tools)
- Sponsored ad cards with clear disclosure labels
- Debug panel showing analytics and raw data
- Voice slate placement support
- Safety-first approach with no sensitive categories or personalization

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Try these example queries:
- "best running shoes under 120" → Shows running shoes ad
- "dial in espresso grinder" → Shows coffee ad  
- "lightweight project management app" → Shows productivity SaaS ad
- "random query" → Shows "No ad"

### Debugging

1. **Toggle placement and country** - Test different ad placements
2. **Open DevTools Console** - See impression/click event logs
3. **Check localStorage** - View analytics counters:
   - `ads_impressions_total`
   - `ads_clicks_total`
   - `ads_impressions_<category>`
   - `ads_clicks_<category>`
4. **Use Debug Panel** - Click "Show debug" to see resolved data

## Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Deploy with default settings
4. Your app will be live at `https://your-project.vercel.app`

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- Render
- Any platform supporting Node.js

## Project Structure

```
ai-display-frontend/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── AdCard.tsx        # Sponsored ad component
│   └── DebugPanel.tsx    # Analytics debug panel
├── lib/
│   ├── types.ts          # TypeScript type definitions
│   ├── match.ts          # Query-to-category matching
│   └── metrics.ts        # Analytics tracking
├── public/
│   └── catalog.json      # Static ad catalog
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

## Safety & Policy

- ✅ **Always labeled "Sponsored"** - Clear disclosure on every ad
- ✅ **No sensitive categories** - Only safe, general interest categories
- ✅ **No personalization/PII** - Only uses query string and selected country
- ✅ **No health claims** - Safety tags prevent inappropriate content
- ✅ **Transparent analytics** - All tracking visible in debug panel

## API Reference

### Query Matching

The `queryToCategory()` function maps queries to categories:

- **running_shoes**: Contains "shoe", "run", "runner", "sneaker"
- **coffee**: Contains "coffee", "espresso", "grinder"  
- **productivity_saas**: Contains "project", "task", "productivity", "pm tool", "kanban"
- **no match**: Returns empty string, shows "No ad"

### Analytics Events

All events are logged to console and stored in localStorage:

```javascript
// Impression event
{ event: "impression", category, query, placement, country, ts }

// Click event  
{ event: "click", category, query, placement, country, ts }
```

## License

MIT License - Feel free to use this code for your own projects.

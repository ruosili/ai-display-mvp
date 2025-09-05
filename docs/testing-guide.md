# Testing Guide

## 🧪 Testing Overview

This guide covers comprehensive testing procedures for the AI Display MVP, including manual testing, automated testing, and integration testing.

## 🔍 Manual Testing

### Frontend Testing

#### 1. Basic Functionality Test

**Test the main application at**: [https://ai-display-mvp.vercel.app/](https://ai-display-mvp.vercel.app/)

**Steps**:
1. Open the application in your browser
2. Verify the page loads without errors
3. Check that all UI elements are visible and functional
4. Test the query input field
5. Test the placement dropdown
6. Test the country dropdown
7. Click "Fetch Ad" button

**Expected Results**:
- ✅ Page loads in < 2 seconds
- ✅ All UI elements are visible and clickable
- ✅ No JavaScript errors in console
- ✅ Responsive design works on mobile

#### 2. Query Matching Test

**Test different query types**:

| Query | Expected Category | Expected Ad |
|-------|------------------|-------------|
| "best running shoes under $120" | running_shoes | FleetFeet Local |
| "coffee grinder recommendations" | coffee | BeanLab |
| "project management tools" | productivity_saas | TaskWisp |
| "random unrelated query" | no_fill | No ad displayed |

**Steps**:
1. Enter each test query in the input field
2. Click "Fetch Ad"
3. Verify the correct ad is displayed (or "No ad" for no_fill)
4. Check that the "Sponsored" label is clearly visible

**Expected Results**:
- ✅ Correct category matching for each query
- ✅ Appropriate ad displayed for matching queries
- ✅ "No ad" message for non-matching queries
- ✅ "Sponsored" label always visible

#### 3. Placement Testing

**Test different placement options**:

| Placement | Expected Behavior |
|-----------|------------------|
| inline_answer | Ad embedded in main content |
| followup_prompt | Ad shown after main content |
| card | Ad displayed as separate card |
| results_list | Ad included in results list |
| voice_slate | Special voice notation shown |

**Steps**:
1. Select different placement options from dropdown
2. Enter a matching query (e.g., "running shoes")
3. Click "Fetch Ad"
4. Verify the ad is displayed appropriately for each placement

**Expected Results**:
- ✅ Ad displays correctly for each placement type
- ✅ Voice slate shows special notation
- ✅ UI adapts to different placement styles

#### 4. Country Testing

**Test different country options**:

| Country | Expected Behavior |
|---------|------------------|
| US | Default behavior |
| CA | Same ads, different country context |
| UK | Same ads, different country context |
| AU | Same ads, different country context |
| DE | Same ads, different country context |
| FR | Same ads, different country context |
| ES | Same ads, different country context |
| IT | Same ads, different country context |

**Steps**:
1. Select different country options from dropdown
2. Enter a matching query
3. Click "Fetch Ad"
4. Verify the ad is displayed for each country

**Expected Results**:
- ✅ Ad displays for all country options
- ✅ Country parameter is passed to API
- ✅ No errors for any country selection

#### 5. Click Tracking Test

**Steps**:
1. Enter a matching query and fetch an ad
2. Click on the CTA button/link
3. Verify the click is tracked
4. Check browser console for click logs
5. Verify redirect to destination URL

**Expected Results**:
- ✅ Click opens destination URL in new tab
- ✅ Click event is logged to console
- ✅ Click counter increments in localStorage
- ✅ No JavaScript errors

#### 6. Analytics Testing

**Steps**:
1. Open browser DevTools → Console
2. Perform several ad impressions and clicks
3. Check localStorage for analytics data
4. Verify debug panel shows correct data
5. Check console logs for events

**Expected Results**:
- ✅ Impressions tracked in localStorage
- ✅ Clicks tracked in localStorage
- ✅ Console logs show all events
- ✅ Debug panel displays current data

### API Testing

#### 1. Ad Serving API Test

**Test the `/api/ad` endpoint**:

```bash
# Test running shoes query
curl "https://ai-display-mvp.vercel.app/api/ad?q=best%20running%20shoes&country=US&placement=inline_answer"

# Test coffee query
curl "https://ai-display-mvp.vercel.app/api/ad?q=coffee%20grinder&country=CA&placement=card"

# Test productivity query
curl "https://ai-display-mvp.vercel.app/api/ad?q=project%20management&country=UK&placement=results_list"

# Test no-fill query
curl "https://ai-display-mvp.vercel.app/api/ad?q=random%20query&country=US&placement=inline_answer"
```

**Expected Results**:
- ✅ Running shoes query returns FleetFeet ad
- ✅ Coffee query returns BeanLab ad
- ✅ Productivity query returns TaskWisp ad
- ✅ Random query returns `{"decision": "no_fill"}`
- ✅ All responses are valid JSON
- ✅ Response time < 200ms

#### 2. Click Tracking API Test

**Test the `/api/c` endpoint**:

```bash
# Test valid click tracking
curl -I "https://ai-display-mvp.vercel.app/api/c?dest=https://example.com/test&cid=test123"

# Test invalid URL
curl -I "https://ai-display-mvp.vercel.app/api/c?dest=invalid-url&cid=test456"
```

**Expected Results**:
- ✅ Valid URL returns 302 redirect
- ✅ Invalid URL returns 400 error
- ✅ Redirect location matches destination
- ✅ Response time < 100ms

#### 3. OpenAPI Specification Test

**Test the OpenAPI spec**:

```bash
# Test OpenAPI spec availability
curl "https://ai-display-mvp.vercel.app/openapi.yaml"
```

**Expected Results**:
- ✅ OpenAPI spec returns valid YAML
- ✅ Contains both `getAd` and `trackClick` operations
- ✅ Server URL points to correct domain
- ✅ All required fields are present

## 🤖 Automated Testing

### Unit Tests

#### 1. Query Matching Tests

```javascript
// test/lib/match.test.js
import { queryToCategory } from '../lib/match';

describe('queryToCategory', () => {
  test('should match running shoes queries', () => {
    expect(queryToCategory('best running shoes')).toBe('running_shoes');
    expect(queryToCategory('sneakers for marathon')).toBe('running_shoes');
    expect(queryToCategory('running gear')).toBe('running_shoes');
  });

  test('should match coffee queries', () => {
    expect(queryToCategory('coffee grinder')).toBe('coffee');
    expect(queryToCategory('espresso machine')).toBe('coffee');
    expect(queryToCategory('coffee beans')).toBe('coffee');
  });

  test('should match productivity queries', () => {
    expect(queryToCategory('project management')).toBe('productivity_saas');
    expect(queryToCategory('task tracking')).toBe('productivity_saas');
    expect(queryToCategory('kanban board')).toBe('productivity_saas');
  });

  test('should return empty string for no match', () => {
    expect(queryToCategory('random query')).toBe('');
    expect(queryToCategory('unrelated topic')).toBe('');
    expect(queryToCategory('')).toBe('');
  });
});
```

#### 2. Analytics Tests

```javascript
// test/lib/metrics.test.js
import { recordImpression, recordClick, counters } from '../lib/metrics';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('Analytics', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue('0');
    localStorageMock.setItem.mockClear();
  });

  test('should record impressions', () => {
    const data = { category: 'running_shoes', query: 'test', placement: 'inline_answer', country: 'US', ts: Date.now() };
    
    recordImpression(data);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('ads_impressions_total', '1');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('ads_impressions_running_shoes', '1');
  });

  test('should record clicks', () => {
    const data = { category: 'coffee', query: 'test', placement: 'card', country: 'CA', ts: Date.now() };
    
    recordClick(data);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('ads_clicks_total', '1');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('ads_clicks_coffee', '1');
  });

  test('should return correct counters', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      const values = { 'ads_impressions_total': '5', 'ads_clicks_total': '2' };
      return values[key] || '0';
    });
    
    const result = counters();
    
    expect(result.impressions_total).toBe(5);
    expect(result.clicks_total).toBe(2);
  });
});
```

### Integration Tests

#### 1. API Integration Tests

```javascript
// test/api/integration.test.js
import { fetch } from 'node-fetch';

describe('API Integration', () => {
  const baseUrl = 'https://ai-display-mvp.vercel.app';

  test('should serve running shoes ad', async () => {
    const response = await fetch(`${baseUrl}/api/ad?q=best%20running%20shoes&country=US&placement=inline_answer`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.decision).toBe('serve');
    expect(data.ad).toBeDefined();
    expect(data.ad.advertiser).toBe('FleetFeet Local');
    expect(data.ad.disclosure).toBe('Sponsored');
  });

  test('should return no_fill for random query', async () => {
    const response = await fetch(`${baseUrl}/api/ad?q=random%20query&country=US&placement=inline_answer`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.decision).toBe('no_fill');
    expect(data.ad).toBeUndefined();
  });

  test('should track clicks', async () => {
    const response = await fetch(`${baseUrl}/api/c?dest=https://example.com/test&cid=test123`, {
      redirect: 'manual'
    });
    
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://example.com/test');
  });

  test('should handle invalid click URLs', async () => {
    const response = await fetch(`${baseUrl}/api/c?dest=invalid-url&cid=test456`);
    
    expect(response.status).toBe(400);
  });
});
```

#### 2. Frontend Integration Tests

```javascript
// test/components/AdCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdCard from '../../components/AdCard';

const mockAd = {
  disclosure: 'Sponsored',
  advertiser: 'Test Advertiser',
  title: 'Test Ad Title',
  body: 'Test ad description',
  cta_label: 'Click Here',
  cta_url: 'https://example.com/test',
  image_url: 'https://example.com/image.jpg',
  safety_tags: ['sponsored_label_required']
};

const mockProps = {
  ad: mockAd,
  query: 'test query',
  country: 'US',
  placement: 'inline_answer',
  category: 'running_shoes'
};

describe('AdCard', () => {
  test('should render ad content correctly', () => {
    render(<AdCard {...mockProps} />);
    
    expect(screen.getByText('Sponsored — Test Advertiser')).toBeInTheDocument();
    expect(screen.getByText('Test Ad Title')).toBeInTheDocument();
    expect(screen.getByText('Test ad description')).toBeInTheDocument();
    expect(screen.getByText('Click Here')).toBeInTheDocument();
  });

  test('should render image when provided', () => {
    render(<AdCard {...mockProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('should handle click events', () => {
    const mockOnClick = jest.fn();
    render(<AdCard {...mockProps} onClick={mockOnClick} />);
    
    const ctaButton = screen.getByText('Click Here');
    fireEvent.click(ctaButton);
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('should open CTA URL in new tab', () => {
    render(<AdCard {...mockProps} />);
    
    const ctaLink = screen.getByText('Click Here');
    expect(ctaLink).toHaveAttribute('href', 'https://example.com/test');
    expect(ctaLink).toHaveAttribute('target', '_blank');
    expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

## 🔧 Performance Testing

### Load Testing

#### 1. API Load Testing

```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 "https://ai-display-mvp.vercel.app/api/ad?q=best%20running%20shoes&country=US&placement=inline_answer"

# Using curl with timing
for i in {1..10}; do
  time curl -s "https://ai-display-mvp.vercel.app/api/ad?q=best%20running%20shoes&country=US&placement=inline_answer" > /dev/null
done
```

**Expected Results**:
- ✅ Average response time < 200ms
- ✅ 95th percentile < 500ms
- ✅ No errors under normal load
- ✅ Graceful degradation under high load

#### 2. Frontend Performance Testing

```javascript
// test/performance/frontend.test.js
import { performance } from 'perf_hooks';

describe('Frontend Performance', () => {
  test('should load page quickly', async () => {
    const start = performance.now();
    
    // Simulate page load
    await page.goto('https://ai-display-mvp.vercel.app/');
    
    const end = performance.now();
    const loadTime = end - start;
    
    expect(loadTime).toBeLessThan(2000); // 2 seconds
  });

  test('should render ads quickly', async () => {
    const start = performance.now();
    
    // Simulate ad rendering
    await page.type('input[placeholder="Enter a query…"]', 'best running shoes');
    await page.click('button:has-text("Fetch Ad")');
    await page.waitForSelector('.ad-card');
    
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).toBeLessThan(1000); // 1 second
  });
});
```

## 🐛 Error Testing

### Error Scenarios

#### 1. Network Errors

```javascript
// test/error-handling.test.js
describe('Error Handling', () => {
  test('should handle network errors gracefully', async () => {
    // Mock network failure
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    const result = await safeAdFetch('test query');
    
    expect(result.decision).toBe('no_fill');
    expect(console.error).toHaveBeenCalled();
  });

  test('should handle invalid API responses', async () => {
    // Mock invalid response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    
    const result = await safeAdFetch('test query');
    
    expect(result.decision).toBe('no_fill');
  });

  test('should handle malformed JSON responses', async () => {
    // Mock malformed JSON
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });
    
    const result = await safeAdFetch('test query');
    
    expect(result.decision).toBe('no_fill');
  });
});
```

#### 2. Input Validation

```javascript
// test/validation.test.js
describe('Input Validation', () => {
  test('should handle empty queries', () => {
    expect(queryToCategory('')).toBe('');
    expect(queryToCategory(null)).toBe('');
    expect(queryToCategory(undefined)).toBe('');
  });

  test('should handle special characters', () => {
    expect(queryToCategory('running shoes!!!')).toBe('running_shoes');
    expect(queryToCategory('coffee@grinder')).toBe('coffee');
    expect(queryToCategory('project-management')).toBe('productivity_saas');
  });

  test('should handle very long queries', () => {
    const longQuery = 'best running shoes for marathon training with excellent cushioning and support'.repeat(10);
    expect(queryToCategory(longQuery)).toBe('running_shoes');
  });
});
```

## 📊 Test Coverage

### Coverage Goals

- **Unit Tests**: > 90% coverage
- **Integration Tests**: > 80% coverage
- **API Tests**: 100% endpoint coverage
- **Error Handling**: 100% error scenario coverage

### Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## 🚀 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run API tests
      run: npm run test:api
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

## 📋 Testing Checklist

### Pre-Deployment Testing

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] API endpoints respond correctly
- [ ] Frontend renders without errors
- [ ] Error handling works properly
- [ ] Performance meets requirements
- [ ] Security tests pass
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Accessibility standards met

### Post-Deployment Testing

- [ ] Live application loads correctly
- [ ] All API endpoints accessible
- [ ] Ad serving works as expected
- [ ] Click tracking functions properly
- [ ] Analytics data is collected
- [ ] Error monitoring is active
- [ ] Performance metrics are within range
- [ ] User experience is smooth

This comprehensive testing guide ensures the AI Display MVP is robust, reliable, and ready for production use.

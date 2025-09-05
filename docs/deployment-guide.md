# Deployment Guide

## 🚀 Vercel Deployment

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Node.js 18+ (for local development)
- Git (for version control)

### Step 1: Prepare Repository

1. **Ensure clean git history**:
   ```bash
   git status
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify .gitignore**:
   ```bash
   # Check that node_modules is ignored
   cat .gitignore | grep node_modules
   ```

3. **Test local build**:
   ```bash
   npm run build
   ```

### Step 2: Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import Git Repository**:
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

4. **Configure Project**:
   - **Project Name**: `ai-display-mvp` (or your preferred name)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (~2 minutes)

#### Option B: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   vercel
   ```

4. **Follow prompts**:
   - Link to existing project: No
   - Project name: `ai-display-mvp`
   - Directory: `./`
   - Override settings: No

### Step 3: Verify Deployment

1. **Check deployment status**:
   - Go to Vercel Dashboard
   - Verify deployment is successful
   - Check build logs for any errors

2. **Test live application**:
   ```bash
   # Test main page
   curl "https://your-project.vercel.app/"
   
   # Test API endpoints
   curl "https://your-project.vercel.app/api/ad?q=best%20running%20shoes"
   curl "https://your-project.vercel.app/api/c?dest=https://example.com/test"
   
   # Test OpenAPI spec
   curl "https://your-project.vercel.app/openapi.yaml"
   ```

3. **Verify HTTPS**:
   - Check that all URLs use HTTPS
   - Verify SSL certificate is valid
   - Test in different browsers

### Step 4: Configure Custom Domain (Optional)

1. **Add custom domain**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update OpenAPI spec**:
   ```yaml
   # Update public/openapi.yaml
   servers:
     - url: https://your-custom-domain.com
   ```

3. **Commit and redeploy**:
   ```bash
   git add public/openapi.yaml
   git commit -m "Update OpenAPI spec with custom domain"
   git push origin main
   ```

## 🔧 Environment Configuration

### Environment Variables

Currently, no environment variables are required. The application uses:
- Static data from `public/catalog.json`
- Default configuration values
- Vercel's built-in environment

### Future Environment Variables

If you add features that require configuration:

```bash
# In Vercel Dashboard → Project Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
DATABASE_URL=your-database-url
```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Vercel Analytics**:
   - Go to Project Settings → Analytics
   - Enable Web Analytics
   - View real-time metrics

2. **Monitor Performance**:
   - Check Core Web Vitals
   - Monitor page load times
   - Track user engagement

### Application Logs

1. **View Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Click on function name
   - View real-time logs

2. **Monitor API Usage**:
   - Check function execution count
   - Monitor response times
   - Track error rates

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to the main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
# Check deployment status in dashboard
```

### Manual Deployments

1. **Redeploy from Vercel Dashboard**:
   - Go to Project → Deployments
   - Click "Redeploy" on latest deployment

2. **Redeploy from CLI**:
   ```bash
   vercel --prod
   ```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures

**Problem**: Build fails during deployment
**Solution**:
```bash
# Check local build
npm run build

# Fix TypeScript errors
npm run type-check

# Fix linting errors
npm run lint
```

#### 2. API Endpoints Not Working

**Problem**: 404 errors for API endpoints
**Solution**:
- Check file structure: `app/api/ad/route.ts`
- Verify function exports: `export const GET = ...`
- Check Vercel function logs

#### 3. Static Files Not Loading

**Problem**: Images or JSON files not loading
**Solution**:
- Check file paths in `public/` folder
- Verify file permissions
- Check Vercel build logs

#### 4. Environment Issues

**Problem**: Different behavior in production
**Solution**:
- Check environment variables
- Verify build configuration
- Compare local vs production logs

### Debug Commands

```bash
# Check build locally
npm run build

# Check TypeScript
npm run type-check

# Check linting
npm run lint

# Test API locally
npm run dev
curl "http://localhost:3000/api/ad?q=test"

# Check Vercel CLI
vercel --version
vercel env ls
vercel logs
```

## 📈 Performance Optimization

### Build Optimization

1. **Enable build caching**:
   ```bash
   # In vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 10
       }
     }
   }
   ```

2. **Optimize bundle size**:
   ```bash
   # Analyze bundle
   npm run build
   npx @next/bundle-analyzer
   ```

### Runtime Optimization

1. **Enable edge functions**:
   ```typescript
   // In API routes
   export const runtime = 'edge';
   ```

2. **Add caching headers**:
   ```typescript
   // In API routes
   return NextResponse.json(data, {
     headers: {
       'Cache-Control': 'public, max-age=3600',
     },
   });
   ```

## 🔒 Security Configuration

### HTTPS Configuration

Vercel automatically provides HTTPS:
- SSL certificates are auto-generated
- HTTP requests redirect to HTTPS
- HSTS headers are included

### Security Headers

Add security headers in `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## 🌍 Global Deployment

### CDN Configuration

Vercel automatically provides:
- Global CDN distribution
- Edge caching
- Automatic scaling
- DDoS protection

### Regional Deployment

1. **Check deployment regions**:
   - Go to Project Settings → Functions
   - View available regions
   - Select optimal region

2. **Monitor performance**:
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor response times

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Code is committed to git
- [ ] All tests pass locally
- [ ] Build completes without errors
- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] No sensitive data in code
- [ ] Environment variables configured
- [ ] Documentation updated

### Post-Deployment

- [ ] Application loads correctly
- [ ] All API endpoints working
- [ ] HTTPS is enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Monitoring configured
- [ ] Performance metrics acceptable
- [ ] Error tracking active

### Ongoing Maintenance

- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] Error log review
- [ ] Analytics analysis
- [ ] Backup verification
- [ ] Documentation updates

## 🎯 Success Metrics

### Deployment Success

- ✅ **Zero build errors**
- ✅ **All tests passing**
- ✅ **API endpoints responding**
- ✅ **HTTPS enabled**
- ✅ **Performance < 2s load time**

### Production Readiness

- ✅ **99.9% uptime**
- ✅ **Global CDN distribution**
- ✅ **Automatic scaling**
- ✅ **Error monitoring**
- ✅ **Security headers**

This deployment guide ensures your AI Display MVP is properly deployed, configured, and maintained on Vercel with optimal performance and security.

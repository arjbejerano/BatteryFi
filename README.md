# Project Build Guide

## Tech Stack

This project is built using the following technologies:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Prerequisites

Make sure your system has Node.js and npm installed.

We recommend using nvm to install Node.js: [nvm Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

## Install Dependencies

```sh
npm install
```

## Development Server

Start the development server with hot reload and instant preview:

```sh
npm run dev
```

## Build Project

Build for production:

```sh
npm run build
```

## Preview Build

Preview the built project:

```sh
npm run preview
```

## Project Structure

```
src/
├── components/     # UI Components
├── pages/         # Page Components
├── hooks/         # Custom Hooks
├── lib/           # Utility Library
└── main.tsx       # Application Entry Point
```

## Deployment to Vercel

### Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a GitHub repository

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if you haven't already):
   ```sh
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import your project on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import" next to your GitHub repository
   - Vercel will auto-detect your Vite project settings

3. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add the following variables (optional, if you want to override defaults):
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
     - `VITE_STRIPE_PUBLIC_KEY` - Your Stripe public key (if using Stripe)
   - Note: The app will work with the default hardcoded values, but using environment variables is recommended for production

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your project
   - You'll get a deployment URL (e.g., `your-project.vercel.app`)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```sh
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```sh
   vercel login
   ```

3. **Deploy**:
   ```sh
   vercel
   ```
   - Follow the prompts to link your project
   - For production deployment, use: `vercel --prod`

4. **Set Environment Variables** (if needed):
   ```sh
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_STRIPE_PUBLIC_KEY
   ```

### Environment Variables

The following environment variables can be configured (all optional with fallbacks):

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key (for payment integration)
- `CDN_IMG_PREFIX` - CDN URL for images (optional)
- `VITE_ENABLE_ROUTE_MESSAGING` - Enable route messaging (development feature)

**Note**: The application includes default values for Supabase configuration, so it will work out of the box. However, for production, it's recommended to use environment variables.

### Automatic Deployments

Once connected to Vercel, every push to your main branch will automatically trigger a new deployment. You can also set up preview deployments for pull requests in the Vercel dashboard.

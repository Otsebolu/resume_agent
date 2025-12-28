# Resume Analyzer Frontend

A Next.js application that connects to the FastAPI backend for AI-powered resume analysis.

## Features

- 📄 PDF CV upload
- 📝 Job description input
- 🤖 AI-powered match analysis
- 📊 Match score visualization
- 🎓 Personalized learning plan with video recommendations
- 🎨 Beautiful, modern UI with shadcn/ui

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm (package manager)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env.local` file in the `frontend` directory:
```env
FASTAPI_BACKEND_URL=http://localhost:8000
```

For production, replace with your deployed FastAPI backend URL.

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variable:
   - `FASTAPI_BACKEND_URL`: Your deployed FastAPI backend URL
4. Deploy

The application will automatically deploy and use Vercel's serverless functions for the API routes.

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # API route to forward requests to FastAPI
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page with upload form
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── response-display.tsx  # Response display component
└── lib/
    └── utils.ts              # Utility functions
```

## API Integration

The frontend sends requests to `/api/analyze` which forwards them to the FastAPI backend at `/api/analyze`.

Request format:
- `cv_file`: PDF file
- `job_description`: String

Response format:
```json
{
  "match_score": 60,
  "reason": "...",
  "learning_plan": [
    {
      "title": "...",
      "video": "...",
      "thumbnail": "..."
    }
  ]
}
```

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **pnpm** - Package manager

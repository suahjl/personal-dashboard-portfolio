# Personal Portfolio Website

A Next.js portfolio website, featuring research papers, data visualizations, and personal projects.

## Features

- **Home Page**: Portfolio of research papers, role summary, and links to CV and GitHub
- **Dashboard Tab**: Interactive data visualizations from the dashboard-global-plucking repository
- **Papers Tab**: Individual data visualizations for each research paper
- **Projects Tab**: Showcase of weekend projects and personal work

## Technology Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-dashboard-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
personal-dashboard-portfolio/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                 # Home page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard tab
│   ├── papers/
│   │   └── [slug]/
│   │       └── page.tsx        # Individual paper data visualizations
│   ├── projects/
│   │   └── page.tsx            # Weekend projects tab
│   └── api/
│       └── data/
│           └── route.ts       # API route to serve data files
├── components/
│   ├── Navigation.tsx          # Tab navigation component
│   ├── PaperCard.tsx           # Paper display card
│   ├── DataVisualization.tsx   # Reusable data viz component
│   ├── ChartContainer.tsx      # Chart wrapper with filters
│   └── ProjectCard.tsx         # Project showcase card
├── lib/
│   ├── data-fetcher.ts         # Functions to fetch data from APIs/files
│   └── types.ts                # TypeScript types for data structures
└── data/
    └── papers.json             # Paper metadata
```

## Configuration

### Adding Papers

Edit `data/papers.json` to add your research papers. The `link` field should point to an external URL where your paper is hosted (e.g., BIS website, journal page, or PDF URL):

```json
[
  {
    "id": "paper-1",
    "title": "Your Paper Title",
    "authors": ["Your Name", "Co-Author"],
    "publication": "Journal Name",
    "year": 2024,
    "link": "https://example.com/paper",
    "abstract": "Paper abstract here"
  }
]
```

Note: Papers use external URLs only - no need to host PDFs locally.

### Configuring Data Sources

The API route at `app/api/data/route.ts` handles data fetching. Currently configured to fetch from:
- `dashboard-global-plucking` repository (via GitHub)

To add more data sources, update the API route with additional cases.

### Custom Domain Setup (Vercel)

1. Push your code to GitHub
2. Import the project in Vercel
3. Go to Project Settings → Domains
4. Add your custom domain (suahjl.com)
5. Update your DNS records as instructed by Vercel

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will automatically detect Next.js and configure the build
5. Add your custom domain in project settings

The site will automatically deploy on every push to the main branch.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- The dashboard-global-plucking integration fetches data from GitHub. Make sure the repository is public or configure authentication.
- Update the API route path (`data/sample.json`) to match your actual repository structure.
- Add your CV file to the `public/` folder and update the link in `app/page.tsx`.
- Papers use external URLs only - no need to host PDFs locally. Just add the URL to the `link` field in `data/papers.json`.
- Customize the styling in Tailwind classes throughout the components.

## License

Private project - All rights reserved.

# find-a-friend-web

Single React web app for Find a Friend.

## Features

- **React + TypeScript** for the frontend
- **TanStack Router** for file-based routing
- **Tailwind CSS v4** for styling
- **Base UI primitives** wrapped in local UI components

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## UI Customization

- App code lives in `src`
- Reusable UI primitives live in `src/components/ui`
- Design tokens and global styles live in `src/styles/globals.css`
- Shared helpers live in `src/lib`

To add more shadcn/base UI primitives, run from the project root:

```bash
npx shadcn@latest add accordion dialog popover sheet table
```

Import local UI components like this:

```tsx
import { Button } from "@/components/ui/button";
```

## Project Structure

```text
find-a-friend-web/
├── src/
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   ├── routes/
│   └── styles/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev`: start the development server
- `npm run build`: build the app
- `npm run serve`: preview the production build
- `npm run check-types`: build and run TypeScript checks

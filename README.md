# LinkLens

LinkLens is an educational web app that explains common warning signs in a pasted URL. It uses simple heuristics and does not contact external URL-scanning services.

**Live demo:** [Open LinkLens](https://linklens-gqo2czhlo-v-b92d.vercel.app/)

## Features

- Analyzes a URL and explains the signals it finds
- Checks for patterns such as HTTP, embedded credentials, internationalized domains, numeric IP addresses, and unusually long URLs
- Provides practical steps users can take before opening an unexpected link
- Uses a React interface and a REST endpoint
- Runs locally with Express and deploys with a Vercel API function

## Tech stack

- React, TypeScript, Vite
- Tailwind CSS
- Node.js, Express
- Vercel Functions
- GitHub Actions

## Run locally

Install dependencies:

```bash
npm install
```

Start the frontend in **Terminal 1**:

```bash
npm run dev
```

Start the Express API in **Terminal 2**:

```bash
npm run server:dev
```

## How it works

The app sends the pasted URL as text to `/api/analyze`. The analyzer checks its format and selected URL patterns, then returns an explanation. It does not open or fetch the submitted URL.

## Limitations

LinkLens is a learning project. Its checks are heuristic examples, not a verdict on whether a website is safe. A low-risk result does not guarantee that a link is trustworthy.

For a safe demo, try:

```text
https://account.verify.example/sign-in
```

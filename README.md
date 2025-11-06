# Tower of Hanoi (React)

This is a small React + Vite app that visualizes the Tower of Hanoi algorithm. The core logic is ported from a single-file implementation and split into components for clarity.

Features:
- Auto play mode with adjustable speed
- Manual mode where you can move disks yourself
- Call stack visualization for recursion
- Simple UI using Tailwind CSS via CDN

Prerequisites:
- Node.js (14+ recommended)

Install and run (Windows PowerShell):

```powershell
cd "c:\Users\jeetu\Desktop\Projects\DSA PROJECT\Tower OF Hanoi"
npm install
npm run dev
```

Open the printed dev server URL (usually http://localhost:5173) in your browser.

Notes:
- Tailwind is included via the Play CDN in `index.html` for simplicity.
- Icons come from `lucide-react`.

Next steps / improvements:
- Add unit tests for move generation
- Add keyboard controls and accessibility improvements
- Bundle Tailwind properly for production builds

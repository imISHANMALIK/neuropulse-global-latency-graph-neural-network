# Neuro Pulse

[![[cloudflarebutton]]](https://deploy.workers.cloudflare.com)

A production-ready full-stack application template powered by Cloudflare Workers and Pages. This starter includes a modern React frontend with Tailwind CSS, shadcn/ui components, and a Hono-powered API backend. Perfect for building fast, scalable web apps with seamless edge deployment.

## ✨ Features

- **React 18** with Vite for blazing-fast development and builds
- **TypeScript** end-to-end for type safety
- **Tailwind CSS** with custom design system, dark mode, and animations
- **shadcn/ui** component library (all components pre-installed)
- **Cloudflare Workers** API backend with Hono routing
- **Tanstack Query** for server-state management
- **React Router** for client-side routing
- **Sonner** for toast notifications
- **Sidebar layout** with collapsible navigation (optional)
- **Theme toggle** (light/dark mode) with persistence
- **Error boundaries** and client error reporting
- **Production-optimized** with code splitting, lazy loading, and Tree Shaking
- **SPA fallback** handling for client-side routing
- **Observability** enabled for Workers

## 🛠️ Tech Stack

| Frontend | Backend | Tools |
|----------|---------|-------|
| React 18 | Hono | Vite |
| TypeScript | Cloudflare Workers | Bun |
| Tailwind CSS | Cloudflare KV/DO ready | Wrangler |
| shadcn/ui | - | Tanstack Query |
| Lucide Icons | - | React Router |
| Framer Motion | - | Zod |

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd neuro-pulse-odsjgxkr3ipmtphglj88e
   bun install
   ```

2. **Development**
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Build for Production**
   ```bash
   bun build
   ```

## 💻 Development

### Scripts
| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server (frontend + proxy to worker) |
| `bun build` | Build for production |
| `bun lint` | Run ESLint |
| `bun preview` | Local preview of production build |
| `bun cf-typegen` | Generate Worker types |
| `bun deploy` | Build + deploy to Cloudflare |

### Project Structure
```
├── src/              # React app
│   ├── components/   # UI components + shadcn/ui
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities + error reporting
│   ├── pages/        # Route pages (edit HomePage.tsx)
│   └── main.tsx      # Entry point + routing
├── worker/           # Cloudflare Worker API
│   ├── index.ts      # Core handler (DO NOT EDIT)
│   ├── userRoutes.ts # Add your API routes here
│   └── core-utils.ts # Env types (DO NOT EDIT)
├── tailwind.config.js # Design system
├── vite.config.ts    # Vite + Cloudflare plugin
└── wrangler.jsonc    # Worker config
```

### Adding API Routes
Edit `worker/userRoutes.ts`:
```typescript
app.post('/api/users', async (c) => {
  // Your route logic
  return c.json({ success: true });
});
```

### Customizing UI
- Edit `src/pages/HomePage.tsx` for homepage
- Use `AppLayout` from `src/components/layout/AppLayout.tsx` for sidebar
- All shadcn/ui components available in `src/components/ui/`
- Theme in `src/index.css` and `tailwind.config.js`

### Environment Variables
Configure in Cloudflare dashboard or `wrangler.toml`. Access via `env` in Worker routes.

## ☁️ Deployment

Deploy to Cloudflare Pages + Workers in one command:

```bash
bun deploy
```

Or use the [one-click deploy][[cloudflarebutton]].

### Manual Deployment
1. Install Wrangler: `bun add -g wrangler`
2. Login: `wrangler login`
3. Deploy: `wrangler deploy`

Assets are automatically handled as a SPA with Worker precedence for `/api/*`.

### Custom Domain
```bash
wrangler pages deploy --project-name=<project> --branch=main
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`bun dev`)
3. Commit changes (`bun lint`)
4. Push and PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Hono](https://hono.dev/)

Built with ❤️ for Cloudflare.
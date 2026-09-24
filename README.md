# CoreRent Elite

Create an ultra-premium, minimalist Web3 DePIN application interface for "CoreRent ⚡" from scratch. The design language must strictly follow a luxury, soft-minimalism tech aesthetic inspired by Apple, Stripe, and Linear: smooth borders, perfect rounded corners (12px to 16px border-radius), heavy usage of elegant dark whitespace, and beautiful clean typography (Inter or SF Pro style).

CRITICAL STYLE RESTRICTIONS:
- BACKGROUND: Absolute pitch-black (#000000). 
- NO MESH GRIDS, no lines, no cyberpunk neon animations. The background must be clean, solid, stable, and deep.
- BORDERS: Smooth, soft dark gray solid borders (1px solid #1C1C1E).
- ACCENTS: Crisp pure white for primary elements, muted soft gray (#8E8E93) for details, exchange-like emerald green (#30D158) for status indicators, and subtle destructive red (#FF453A) for emergency actions. The design must look highly expensive, easy on the eyes, and trigger maximum psychological trust (social engineering via elite UI).

APPLICATION ARCHITECTURE (3 NAVIGATION TABS WITH SMOOTH TRANSITIONS):
Create a sleek, rounded top navigation bar or sidebar with 3 clean tabs to isolate features:

1. [ DASHBOARD ] TAB (ACTIVE BY DEFAULT):
- Display the clean white bold headline: "High-Performance Compute. Zero Friction."
- Muted gray description: "Deploy isolated GPU and CPU clusters in 45 seconds directly from your Web3 wallet with zero setup."
- A beautiful layout of 3 monospaced premium metric cards with smooth 12px corners: [ Nodes Online: 1,420 ], [ Avg Deploy Time: 42s ], [ Network Uptime: 99.99% ] with an emerald pulsing green dot.
- Three clean typography blocks layout explaining our core pillars: "Simplicity (1-click Web3 login)", "Instant Speed (<45s provision)", and "Ironclad Isolation (Automated gateway firewall shielding drops malicious actions)".

2. [ GPU CATALOG ] TAB (INFINITE SCROLL MARKETPLACE):
- Implement an infinite scrolling data table catalog (simulating the dynamic loading of thousands of active GPU rows from a DePIN API ledger like io.net or RunPod as the user scrolls down).
- Columns: "GPU Hardware" (NVIDIA RTX 4090 24GB, NVIDIA A100 80GB, etc.), "Environment Preset" (Clean rounded inline dropdown: [Jupyter Notebook, Stable Diffusion, Ubuntu SSH]), "Location / Uptime" (e.g. "🇺🇸 USA // 99.9%"), "Duration" (A smooth numeric input field for custom hours), "CoreRent Price" (Calculate dynamically in real-time: take the live API baseline cost and strictly apply: 'User Price = Live Cost + \$0.40 markup'. Multiply this hourly total by user-inputted hours), "Action" (A rounded smooth white button "[ Rent Now ]" with black text).
- Include a beautiful required legal checkbox below the catalog: "[ ] Enforce CoreRent secure gateway isolation & firewall shielding." "Rent Now" buttons must stay disabled until checked.

3. [ NODES & CPU ] TAB (INFINITE SCROLL MARKETPLACE):
- A separate dedicated infinite scroll table catalog for hosting blockchain testnet nodes and general CPU cloud instances.
- Rows: Standard Node VPS (4 vCPU / 16GB RAM), Heavy Node VPS (8 vCPU / 32GB RAM) repeating dynamically as the user scrolls down.
- Environment Dropdown: [Ubuntu 24.04 LTS, Debian 12].
- Pricing math: Strictly apply an ultra-competitive flat +\$0.05/hr CoreRent markup over the live baseline API cost ('User Price = Live Cost + \$0.05').

GLOBAL ADVANCED SEO INTERFACES (WHITE-HAT PROGRAMMATIC SEO):
- Configure advanced Programmatic SEO infrastructure allowing dynamic URL path parameters like `/rent-[service]-[location]`.
- Support tech categories (gpu rental, ai compute, secure vpn, fast proxy, node vps, high-performance cpu) combined with global regions (USA, Germany, UK, Japan, Finland).
- Automatically update the page layout header title, meta descriptions, and OpenGraph snippet arrays natively based on these parameters to optimize Google search bots indexing.
- MULTI-LANGUAGE HREFLANG: Embed multi-language localized tags structure (hreflang) inside head logic.
- SCHEMA.ORG JSON-LD: Inject a structured metadata script layout (Schema.org/Product) stating dynamic parameters (Name: "CoreRent DePIN Compute", Price: "0.05 - 0.85 USDC", Availability: "InStock") to unlock premium exchange-like snippet visuals directly on global search engine indexes.

SECURE REVENUE WALLET, WEB3 CONNECTOR & VERCEL ANALYTICS:
- SECURITY ENFORCEMENT: Absolutely DO NOT hardcode any public wallet address for collecting fees in the frontend source code. The transaction builder must securely read the platform's revenue destination address from a secure environment variable using `import.meta.env.VITE_REVENUE_WALLET_ADDRESS` or `process.env.VITE_REVENUE_WALLET_ADDRESS`. This is critical to hide the wallet from client-side inspectors and repository viewers.
- MULTI-WALLET CONNECTOR: Integrate the official Solana WalletMultiButton adapter layout in the top right corner. Clicking it triggers an authentic, smooth multi-wallet selection modal (Phantom, Solflare, OKX, Backpack). Once authenticated, display their real truncated address and public USDC balance tracker.
- VERCEL ANALYTICS INTEGRATION: Import and inject the official `@vercel/analytics` package. Attach a custom event tracker to the "[ Rent Now ]" button click, logging an event named "rent_button_clicked" along with the hardware model and hours selected to seamlessly monitor checkout conversion rates via the Vercel dashboard.

TRANSACTION EXECUTION MODAL:
- Clicking an active "Rent Now" button opens a smooth, heavily padded rounded modal window. It displays a clean scrolling monospace terminal text logging the split-payment execution (\$0.40/hr profit for GPU or \$0.05/hr profit for CPU safely routed via the environment variable to the gateway wallet, baseline cost sent to the node provider pool). 
- Upon block confirmation, seamlessly transition into a stunningly clean embedded visual mock of a running Jupyter Notebook workspace or terminal panel to deliver maximum user comfort and prove deployment.

Ensure execution is visually jaw-dropping, perfectly adaptive across mobile and desktop devices, and feels like an elite developer tool.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://core-rent-ace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3bf56090-bb25-4448-8adf-e1d1f1026460).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

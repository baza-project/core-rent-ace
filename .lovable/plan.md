# CoreRent application plan

## Experience
- Replace the placeholder with a premium pitch-black CoreRent workspace using a compact three-tab navigation.
- Build the dashboard, GPU catalog, and Nodes & CPU catalog with responsive desktop tables and mobile cards.
- Add smooth transitions, live price calculations, required gateway consent, infinite row loading, and accessible controls.

## Wallet and rental flow
- Add a polished multi-wallet chooser for Phantom, Solflare, OKX, and Backpack using installed official Solana wallet adapters where available.
- Show the connected public address and USDC balance state.
- Add a rental confirmation/execution modal with split-payment logs and a deployed notebook or terminal preview.
- Read the configured revenue wallet from an environment value without hardcoding an address; clearly handle missing configuration.
- Track completed Rent Now interactions with Vercel Analytics.

## SEO
- Add a dynamic `/rent-$service-$location` route supporting the requested service and region combinations.
- Generate route-specific titles, descriptions, OpenGraph fields, hreflang links, canonical URLs, and Product JSON-LD.
- Add unique metadata for the main application route.

## Technical details
- Define the full visual system as semantic OKLCH tokens in the global stylesheet.
- Keep all browser-only wallet behavior behind client-safe boundaries.
- Validate the application at desktop and mobile sizes, including catalog scrolling, disabled states, wallet modal, and deployment flow.

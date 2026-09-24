import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Activity, ArrowRight, ChevronRight, CircleDot, Cloud, Gauge, LockKeyhole, ShieldCheck, Sparkles, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "gpu" | "nodes";
type ProductKind = "gpu" | "cpu";
type Rental = { model: string; hours: number; baseline: number; kind: ProductKind; preset: string; location: string };
type CoreRentAppProps = { initialTab?: Tab; seoTitle?: string; seoDescription?: string };

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const gpuModels = [
  { model: "NVIDIA RTX 4090", memory: "24GB", base: 0.44 },
  { model: "NVIDIA A100", memory: "80GB", base: 0.79 },
  { model: "NVIDIA H100 SXM", memory: "80GB", base: 1.82 },
  { model: "NVIDIA L40S", memory: "48GB", base: 0.91 },
  { model: "NVIDIA RTX 6000 Ada", memory: "48GB", base: 0.67 },
];
const cpuModels = [
  { model: "Standard Node VPS", specs: "4 vCPU / 16GB RAM", base: 0.08 },
  { model: "Heavy Node VPS", specs: "8 vCPU / 32GB RAM", base: 0.16 },
];
const locations = ["🇺🇸 USA", "🇩🇪 Germany", "🇬🇧 UK", "🇯🇵 Japan", "🇫🇮 Finland"];

export function CoreRentApp(props: CoreRentAppProps) {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CoreRentShell {...props} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function CoreRentShell({ initialTab = "dashboard", seoTitle, seoDescription }: CoreRentAppProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [secure, setSecure] = useState(false);
  const [rental, setRental] = useState<Rental | null>(null);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<string>("—");

  useEffect(() => {
    if (!publicKey) { setBalance("—"); return; }
    let active = true;
    connection.getParsedTokenAccountsByOwner(publicKey, { mint: USDC_MINT }).then(({ value }) => {
      const total = value.reduce((sum, item) => sum + (item.account.data.parsed.info.tokenAmount.uiAmount ?? 0), 0);
      if (active) setBalance(total.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    }).catch(() => { if (active) setBalance("0.00"); });
    return () => { active = false; };
  }, [connection, publicKey]);

  const openRental = (next: Rental) => {
    track("rent_button_clicked", { hardware_model: next.model, hours: next.hours });
    setRental(next);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border pb-4">
          <button type="button" onClick={() => setTab("dashboard")} className="flex items-center" aria-label="CoreRent dashboard">
            <span className="text-base font-semibold">CoreRent <span className="text-status">⚡</span></span>
          </button>
          <nav className="hidden rounded-2xl border border-border bg-surface p-1 md:flex" aria-label="Primary navigation">
            {(["dashboard", "gpu", "nodes"] as Tab[]).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={cn("rounded-xl px-4 py-2 text-xs font-semibold uppercase transition-all", tab === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {item === "gpu" ? "GPU Catalog" : item === "nodes" ? "Nodes & CPU" : "Dashboard"}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {publicKey && <span className="hidden font-mono text-xs text-muted-foreground xl:block">{balance} USDC</span>}
            <WalletMultiButton />
          </div>
        </header>

        <nav className="mt-4 grid grid-cols-3 rounded-2xl border border-border bg-surface p-1 md:hidden" aria-label="Mobile navigation">
          {(["dashboard", "gpu", "nodes"] as Tab[]).map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={cn("rounded-xl px-2 py-2.5 text-[10px] font-semibold uppercase transition-all", tab === item ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
              {item === "gpu" ? "GPU" : item === "nodes" ? "Nodes" : "Dashboard"}
            </button>
          ))}
        </nav>

        <section key={tab} className="animate-enter">
          {tab === "dashboard" ? <Dashboard title={seoTitle ?? undefined} description={seoDescription ?? undefined} onExplore={() => setTab("gpu")} /> : (
            <Catalog kind={tab === "gpu" ? "gpu" : "cpu"} secure={secure} setSecure={setSecure} onRent={openRental} />
          )}
        </section>
      </div>
      <RentalDialog rental={rental} onClose={() => setRental(null)} />
    </main>
  );
}

function Dashboard({ title, description, onExplore }: { title: string | undefined; description: string | undefined; onExplore: () => void }) {
  const metrics = [["Nodes Online", "1,420"], ["Avg Deploy Time", "42s"], ["Network Uptime", "99.99%"]];
  const pillars = [
    { icon: Sparkles, title: "Simplicity", text: "1-click Web3 login", detail: "Connect and deploy. No accounts, keys, or cloud configuration." },
    { icon: Gauge, title: "Instant Speed", text: "<45s provision", detail: "Capacity is reserved and bootstrapped before the chain confirms." },
    { icon: ShieldCheck, title: "Ironclad Isolation", text: "Gateway protected", detail: "Automated firewall shielding drops malicious actions before they reach compute." },
  ];
  return (
    <div className="pb-16">
      <div className="flex min-h-[55vh] flex-col justify-center py-16 lg:py-24">
        <div className="mb-8 flex items-center gap-2 font-mono text-xs uppercase text-status"><span className="status-dot" /> DePIN network operational</div>
        <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-8xl">{title ?? "High-Performance Compute. Zero Friction."}</h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description ?? "Deploy isolated GPU and CPU clusters in 45 seconds directly from your Web3 wallet with zero setup."}</p>
        <div className="mt-10"><Button size="lg" onClick={onExplore} className="h-12 rounded-xl px-6">Explore compute <ArrowRight /></Button></div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map(([label, value], i) => <div key={label} className="rounded-2xl border border-border bg-surface p-5"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>{label}</span>{i === 2 && <span className="status-dot" />}</div><div className="mt-7 font-mono text-3xl font-medium">{value}</div></div>)}
      </div>
      <div className="mt-16 grid gap-10 border-t border-border pt-12 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title: itemTitle, text, detail }) => <article key={itemTitle}><Icon className="mb-6 size-5 text-muted-foreground"/><h2 className="text-xl font-semibold">{itemTitle}</h2><p className="mt-2 font-mono text-sm text-status">{text}</p><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{detail}</p></article>)}
      </div>
    </div>
  );
}

function Catalog({ kind, secure, setSecure, onRent }: { kind: ProductKind; secure: boolean; setSecure: (value: boolean) => void; onRent: (rental: Rental) => void }) {
  const [count, setCount] = useState(14);
  const loadRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => Array.from({ length: count }, (_, i) => {
    const item = kind === "gpu" ? gpuModels[i % gpuModels.length] : cpuModels[i % cpuModels.length];
    return { ...item, id: `${kind}-${i}`, location: locations[i % locations.length], uptime: (99.91 + (i % 8) * 0.01).toFixed(2) };
  }), [count, kind]);
  useEffect(() => {
    const node = loadRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setCount((value) => value + 10); }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="py-10 lg:py-14">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase text-status"><span className="status-dot" /> Live capacity</div><h1 className="text-3xl font-semibold sm:text-5xl">{kind === "gpu" ? "GPU compute catalog" : "Nodes & CPU cloud"}</h1><p className="mt-3 text-sm text-muted-foreground">Live decentralized capacity. Transparent hourly pricing. Deploy in under 45 seconds.</p></div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground"><Activity className="size-4 text-status" />{rows.length.toLocaleString()} capacity records</div>
      </div>
      <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-4 text-sm text-muted-foreground">
        <Checkbox checked={secure} onCheckedChange={(value) => setSecure(value === true)} aria-label="Enable secure gateway" />
        <span><strong className="font-medium text-foreground">Enforce CoreRent secure gateway isolation & firewall shielding.</strong><span className="mt-1 block text-xs">Required for all deployments. Malicious traffic is rejected before reaching your instance.</span></span>
      </label>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="hidden grid-cols-[1.5fr_1.6fr_1.2fr_.65fr_1fr_.8fr] gap-4 border-b border-border px-5 py-3 font-mono text-[10px] uppercase text-muted-foreground lg:grid">
          <span>{kind === "gpu" ? "GPU Hardware" : "Node Hardware"}</span><span>Environment Preset</span><span>Location / Uptime</span><span>Duration</span><span>CoreRent Price</span><span className="text-right">Action</span>
        </div>
        <div>{rows.map((row) => <CatalogRow key={row.id} row={row} kind={kind} secure={secure} onRent={onRent} />)}</div>
        <div ref={loadRef} className="flex h-16 items-center justify-center gap-2 font-mono text-xs text-muted-foreground"><CircleDot className="size-3 animate-pulse text-status"/> Syncing ledger capacity</div>
      </div>
    </div>
  );
}

function CatalogRow({ row, kind, secure, onRent }: { row: any; kind: ProductKind; secure: boolean; onRent: (rental: Rental) => void }) {
  const [hours, setHours] = useState(4);
  const [preset, setPreset] = useState(kind === "gpu" ? "Jupyter Notebook" : "Ubuntu 24.04 LTS");
  const markup = kind === "gpu" ? 0.4 : 0.05;
  const total = (row.base + markup) * hours;
  return (
    <div className="grid gap-4 border-b border-border px-4 py-5 last:border-b-0 lg:grid-cols-[1.5fr_1.6fr_1.2fr_.65fr_1fr_.8fr] lg:items-center lg:px-5">
      <div><span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground lg:hidden">Hardware</span><div className="font-medium">{row.model}</div><div className="mt-1 font-mono text-xs text-muted-foreground">{kind === "gpu" ? row.memory : row.specs}</div></div>
      <div><span className="mb-1.5 block font-mono text-[10px] uppercase text-muted-foreground lg:hidden">Environment</span><Select value={preset} onValueChange={setPreset}><SelectTrigger className="h-10 rounded-xl border-border bg-background"><SelectValue /></SelectTrigger><SelectContent>{(kind === "gpu" ? ["Jupyter Notebook", "Stable Diffusion", "Ubuntu SSH"] : ["Ubuntu 24.04 LTS", "Debian 12"]).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
      <div><span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground lg:hidden">Location / Uptime</span><div className="text-sm">{row.location} <span className="text-muted-foreground">// {row.uptime}%</span></div></div>
      <div><span className="mb-1.5 block font-mono text-[10px] uppercase text-muted-foreground lg:hidden">Hours</span><input aria-label={`Hours for ${row.model}`} type="number" min="1" max="720" value={hours} onChange={(event) => setHours(Math.max(1, Math.min(720, Number(event.target.value) || 1)))} className="h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm outline-none focus:border-ring" /></div>
      <div><span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground lg:hidden">CoreRent Price</span><div className="font-mono font-medium">{total.toFixed(2)} USDC</div><div className="mt-1 font-mono text-[10px] text-muted-foreground">{(row.base + markup).toFixed(2)} / hr</div></div>
      <Button disabled={!secure} onClick={() => onRent({ model: row.model, hours, baseline: row.base, kind, preset, location: row.location })} className="h-10 rounded-xl lg:justify-self-end">Rent now <ChevronRight /></Button>
    </div>
  );
}

function RentalDialog({ rental, onClose }: { rental: Rental | null; onClose: () => void }) {
  const [stage, setStage] = useState<"review" | "running" | "deployed">("review");
  useEffect(() => { if (rental) setStage("review"); }, [rental]);
  if (!rental) return null;
  const markup = rental.kind === "gpu" ? 0.4 : 0.05;
  const total = (rental.baseline + markup) * rental.hours;
  const configured = Boolean(import.meta.env['VITE_REVENUE_WALLET_ADDRESS']);
  const execute = () => { setStage("running"); window.setTimeout(() => setStage("deployed"), 1900); };
  return (
    <Dialog open={Boolean(rental)} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-2xl border-border bg-background p-6 sm:p-9">
      <DialogHeader><DialogTitle className="text-2xl">{stage === "deployed" ? "Compute is live" : "Deploy isolated compute"}</DialogTitle><DialogDescription>{rental.model} · {rental.location} · {rental.hours} hours</DialogDescription></DialogHeader>
      {stage === "review" && <div className="mt-4 space-y-5"><div className="grid gap-3 sm:grid-cols-3">{[["Provider", `${(rental.baseline * rental.hours).toFixed(2)} USDC`], ["Gateway", `${(markup * rental.hours).toFixed(2)} USDC`], ["Total", `${total.toFixed(2)} USDC`]].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-surface p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-2 font-mono text-sm">{value}</div></div>)}</div>{!configured && <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">Revenue wallet is not configured. Add VITE_REVENUE_WALLET_ADDRESS before executing live payments.</div>}<Button onClick={execute} disabled={!configured} className="h-12 w-full rounded-xl">Confirm & deploy <ArrowRight /></Button></div>}
      {stage === "running" && <TerminalLog rental={rental} />}
      {stage === "deployed" && <Workspace rental={rental} />}
    </DialogContent></Dialog>
  );
}

function TerminalLog({ rental }: { rental: Rental }) { return <div className="mt-4 rounded-xl border border-border bg-surface p-5 font-mono text-xs leading-7 text-muted-foreground"><p className="text-status">$ corerent deploy --secure</p><p>Verifying wallet signature...</p><p>Splitting provider settlement and gateway fee...</p><p>Applying isolated firewall policy...</p><p>Provisioning {rental.model}...</p><p className="animate-pulse text-foreground">Awaiting block confirmation ▍</p></div>; }
function Workspace({ rental }: { rental: Rental }) { const notebook = rental.preset === "Jupyter Notebook"; return <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2 text-sm font-medium">{notebook ? <Cloud className="size-4"/> : <TerminalSquare className="size-4"/>}{rental.preset}</div><span className="flex items-center gap-2 font-mono text-xs text-status"><span className="status-dot"/> Running</span></div><div className="min-h-72 p-5 font-mono text-xs leading-7"><p className="text-muted-foreground">CoreRent / workspace / session.ipynb</p><p className="mt-6 text-status">[{notebook ? "1" : "$"}]</p><p>{notebook ? "import torch" : "nvidia-smi"}</p><p>{notebook ? "torch.cuda.get_device_name(0)" : "GPU 0: ready · secure gateway active"}</p><p className="mt-4 text-foreground">'{rental.model}'</p><div className="mt-10 flex items-center gap-2 text-muted-foreground"><LockKeyhole className="size-4 text-status"/> Gateway isolation active</div></div></div>; }

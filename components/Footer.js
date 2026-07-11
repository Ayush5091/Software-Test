export default function Footer() {
  return (
    <footer className="border-t border-base-line mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-faint">
        <p>© {new Date().getFullYear()} FitBook. Train with intent.</p>
        <p className="font-mono">Built with Next.js · MongoDB · JWT</p>
      </div>
    </footer>
  );
}

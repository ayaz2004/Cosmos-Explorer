export default function AppHeader({ isLoading }) {
  return (
    <header className="relative z-10 border-b border-border-glass px-4 py-4 flex-shrink-0 bg-[rgba(2,6,23,0.62)] backdrop-blur-xl">
      <div className="max-w-3xl mx-auto flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center border border-[rgba(96,165,250,0.3)]
            bg-[linear-gradient(135deg,rgba(37,99,235,0.35),rgba(2,132,199,0.22))] shadow-[0_0_22px_rgba(56,189,248,0.25)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] text-stellar-300" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4.3" />
            <path d="M4.5 12c2.2-3.2 4.8-4.8 7.5-4.8 2.8 0 5.3 1.6 7.5 4.8-2.2 3.2-4.7 4.8-7.5 4.8-2.7 0-5.3-1.6-7.5-4.8z" />
            <circle cx="18.6" cy="7.2" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className="min-w-0">
          <h1
            className="text-xl md:text-2xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-text-primary">Cosmos</span>{' '}
            <span className="bg-gradient-to-r from-stellar-400 to-stellar-500 bg-clip-text text-transparent">Explorer</span>
          </h1>
          <p className="text-xs text-text-muted leading-tight mt-0.5">
            AI-powered cosmic guide
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 rounded-full border border-border-glass bg-surface-glass px-3 py-1.5">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: isLoading
                ? 'var(--color-solar-400)'
                : 'var(--color-aurora-400)',
              boxShadow: isLoading
                ? '0 0 8px rgba(251, 191, 36, 0.5)'
                : '0 0 8px rgba(52, 211, 153, 0.5)',
              animation: isLoading ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
            }}
          />
          <span className="text-xs text-text-secondary">
            {isLoading ? 'Thinking' : 'Online'}
          </span>
        </div>
      </div>
    </header>
  );
}

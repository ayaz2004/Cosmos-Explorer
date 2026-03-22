const HERO_QUESTIONS = {
  primary: 'How does the James Webb Space Telescope work?',
  insight: 'What are the most mysterious things about black holes?',
  deepSpace: 'Tell me about galaxies and nebulae in deep space',
};

const FEATURE_CARDS = [
  {
    title: 'Stellar Knowledge',
    description: 'Learn about stars, constellations, and celestial phenomena',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.6 6.8 19.3l1-5.9L3.5 9.2l5.9-.9L12 3z" />
      </svg>
    ),
    prompt: 'Explain the life cycle of a star in simple terms.',
  },
  {
    title: 'Deep Space Insights',
    description: 'Explore galaxies, nebulae, and the far reaches of space',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 3a8 8 0 108 8A7 7 0 0114 3z" />
      </svg>
    ),
    prompt: HERO_QUESTIONS.deepSpace,
  },
  {
    title: 'AI-Powered',
    description: 'Intelligent responses tailored to your cosmic curiosity',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4v4m0 8v4M4 12h4m8 0h4M6.5 6.5l2.8 2.8m5.4 5.4 2.8 2.8m0-11-2.8 2.8m-5.4 5.4-2.8 2.8" />
      </svg>
    ),
    prompt: 'How does AI help scientists discover new exoplanets?',
  },
];

export default function EmptyState({ onQuestionClick }) {
  const handleExploreClick = () => {
    onQuestionClick(HERO_QUESTIONS.primary);
  };

  const handleLearnMoreClick = () => {
    onQuestionClick(HERO_QUESTIONS.insight);
  };

  return (
    <section className="px-4 pt-6 pb-3 md:pt-8 md:pb-4 animate-fade-in">
      <div className="w-full max-w-5xl">
        <div className="mx-auto w-fit rounded-full border border-border-glass bg-surface-glass px-4 py-1.5 text-xs text-stellar-300 shadow-[0_0_24px_rgba(59,130,246,0.12)] backdrop-blur-md">
          ✦ AI-Powered Cosmic Explorer
        </div>

        <h2
          className="mt-5 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-text-primary">Explore the </span>
          <span className="bg-gradient-to-r from-stellar-400 to-stellar-500 bg-clip-text text-transparent">Universe</span>
          <br />
          <span className="text-text-primary">with AI</span>
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-center text-sm md:text-base text-text-secondary leading-relaxed">
          Your personal guide to the cosmos. Ask questions about stars, galaxies,
          black holes, and the mysteries of the universe. Powered by advanced AI.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleExploreClick}
            className="h-12 px-7 rounded-full font-semibold text-base text-white border border-transparent cursor-pointer
              transition-all duration-300 hover:scale-[1.03] active:scale-95
              shadow-[0_0_30px_rgba(59,130,246,0.35)]"
            style={{
              background: 'linear-gradient(135deg, var(--color-stellar-500), var(--color-stellar-400))',
            }}
          >
            Start Exploring
          </button>

          <button
            onClick={handleLearnMoreClick}
            className="h-12 px-7 rounded-full font-semibold text-base text-text-primary border border-border-glass
              bg-[rgba(2,6,23,0.75)] cursor-pointer transition-all duration-300
              hover:bg-[rgba(2,6,23,0.92)] hover:border-border-glass-strong"
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
        {FEATURE_CARDS.map((card, index) => (
          <button
            key={card.title}
            onClick={() => onQuestionClick(card.prompt)}
            className="glass group text-left p-5 rounded-2xl min-h-[154px] cursor-pointer
              transition-all duration-300 hover:-translate-y-1 hover:border-border-glass-strong
              hover:shadow-[0_12px_35px_rgba(2,12,42,0.45)]"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-stellar-400 bg-[rgba(59,130,246,0.12)] border border-[rgba(96,165,250,0.2)] mb-5">
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {card.title}
              </p>
              <p className="text-text-secondary text-sm mt-3 leading-relaxed">{card.description}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-text-muted">
        Tip: Click any card to start with a curated question.
      </p>
    </section>
  );
}

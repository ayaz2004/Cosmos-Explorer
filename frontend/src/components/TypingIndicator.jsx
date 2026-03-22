export default function TypingIndicator() {
  return (
    <div className="flex items-start px-4 py-3 animate-fade-in" role="status" aria-label="CosmosChat is thinking">
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 min-w-[180px] max-w-[220px] border"
        style={{
          background: 'rgba(12, 20, 45, 0.82)',
          borderColor: 'rgba(59, 130, 246, 0.18)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="thinking-orb" aria-hidden="true">
            <span className="thinking-core" />
            <span className="thinking-ring" />
            <span className="thinking-dot" />
          </div>
          <span className="text-[31px] text-text-secondary leading-none">Thinking...</span>
        </div>
      </div>
    </div>
  );
}

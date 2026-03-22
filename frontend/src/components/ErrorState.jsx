export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 animate-fade-in">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        }}
      >
        ⚠️
      </div>

      {/* Error Bubble */}
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        <p className="text-sm font-medium text-red-400 mb-1">
          🛸 Houston, we have a problem!
        </p>
        <p className="text-xs text-text-secondary mb-3">
          {error?.message || 'Something went wrong while exploring the cosmos. The stars will align again soon!'}
        </p>
        <button
          onClick={onRetry}
          className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer
            transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
          }}
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}

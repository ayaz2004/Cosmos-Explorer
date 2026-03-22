import { memo } from 'react';
import { getMessageText, renderMarkdown } from '../utils/messageContent';

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const MessageBubble = memo(function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const time = message.createdAt ? formatTime(message.createdAt) : null;
  const text = getMessageText(message);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-2 animate-fade-in ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, var(--color-stellar-500), var(--color-aurora-500))'
            : 'linear-gradient(135deg, var(--color-nebula-500), var(--color-stellar-500))',
        }}
        aria-hidden="true"
      >
        {isUser ? '👤' : '🌌'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'rounded-tr-sm'
            : 'glass rounded-tl-sm'
        }`}
        style={
          isUser
            ? {
                background:
                  'linear-gradient(135deg, var(--color-nebula-600), var(--color-space-600))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }
            : undefined
        }
      >
        {isUser ? (
          <p className="text-sm leading-relaxed text-text-primary">{text}</p>
        ) : (
          <div
            className="message-content text-sm leading-relaxed text-text-primary"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        )}

        {/* Timestamp */}
        {time && (
          <p
            className={`text-[10px] mt-2 ${
              isUser ? 'text-right text-cosmic-300/60' : 'text-text-muted'
            }`}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;

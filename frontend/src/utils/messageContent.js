export function getMessageText(message) {
  if (typeof message?.content === 'string' && message.content.length > 0) {
    return message.content;
  }

  if (!Array.isArray(message?.parts)) {
    return '';
  }

  return message.parts
    .filter((part) => part?.type === 'text' && typeof part?.text === 'string')
    .map((part) => part.text)
    .join('');
}

export function renderMarkdown(text) {
  if (!text) return '';

  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gm, '<h4 class="text-sm font-semibold text-stellar-300 mt-3 mb-1">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 class="text-base font-semibold text-stellar-300 mt-3 mb-1">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 class="text-lg font-bold text-stellar-300 mt-3 mb-2">$1</h2>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>');

  html = html.replace(/((<li>.*<\/li>\s*)+)/g, '<ul class="list-disc pl-4 my-1">$1</ul>');

  return html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (
        !trimmed ||
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol')
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join('\n');
}

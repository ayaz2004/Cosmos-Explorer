import app, { initializeKnowledge } from './app.js';
import { env } from './config.js';

const PORT = env.port;
initializeKnowledge()
  .catch((error) => {
    console.error('Startup initialization warning:', error);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 CosmosChat backend running on http://localhost:${PORT}`);
    });
  });

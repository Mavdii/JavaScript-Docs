import type { IntegrationContent } from '@/types/content';

export const telegramIntegration: IntegrationContent = {
  id: 'integration-telegram',
  title: 'Telegram Bot API',
  description: 'Build Telegram bots with JavaScript using the Telegram Bot API.',
  slug: 'integrations/telegram',
  pillar: 'integrations',
  category: 'apis-services',
  tags: ['Telegram', 'Bot', 'API', 'messaging'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Build Telegram bots that send messages, handle commands, respond to inline queries, and process callbacks. We\'ll set up webhooks, build a routing layer, and handle edge cases.',
  relatedTopics: ['project-telegram-bot'],
  order: 2,
  updatedAt: '2025-06-01',
  readingTime: 15,
  featured: false,
  keywords: ['Telegram bot', 'Bot API', 'messaging', 'webhooks'],
  requiredLibraries: ['node-telegram-bot-api (Node.js)', 'fetch (browser)'],
  setupSteps: ['Create a bot via @BotFather on Telegram', 'Save the API token', 'Set up webhooks or long-polling'],
  authNotes: 'Authentication is via a Bot Token provided by @BotFather. Keep this token secret.',
  sections: [
    { type: 'heading', level: 2, text: 'Getting Started with @BotFather', id: 'bot-father' },
    { type: 'paragraph', text: 'Every bot starts with @BotFather — Telegram\'s built-in bot for creating and managing other bots. Open Telegram, search for @BotFather, and send /newbot. It\'ll walk you through choosing a name and username, then you\'ll get your unique Bot Token. Guard that token like it\'s your password — it controls your bot.' },
    { type: 'list', items: [
      'Open Telegram → Search @BotFather → Send /newbot',
      'Choose a display name (e.g., "My JS Bot")',
      'Choose a username ending in "bot" (e.g., "my_js_bot")',
      'Copy the API token — format: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
      'Use /setdescription to add a bot description',
      'Use /setcommands to define the command menu',
    ] },
    { type: 'callout', variant: 'danger', title: 'Never Expose Your Bot Token', text: 'The bot token grants full control over your bot. Never commit it to source code. Use environment variables or a secrets manager.' },

    { type: 'heading', level: 2, text: 'Type-Safe Bot API Client', id: 'api-client' },
    { type: 'code', language: 'typescript', code: `interface TelegramResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
  error_code?: number;
}

interface SendMessageParams {
  chat_id: number | string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup;
  reply_to_message_id?: number;
  disable_notification?: boolean;
}

interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

class TelegramBot {
  private baseUrl: string;

  constructor(private token: string) {
    this.baseUrl = \`https://api.telegram.org/bot\${token}\`;
  }

  private async call<T>(method: string, params?: Record<string, unknown>): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}/\${method}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: params ? JSON.stringify(params) : undefined,
    });

    const data: TelegramResponse<T> = await res.json();

    if (!data.ok) {
      throw new Error(\`Telegram API error [\${data.error_code}]: \${data.description}\`);
    }

    return data.result;
  }

  sendMessage(params: SendMessageParams) {
    return this.call<Message>('sendMessage', params);
  }

  editMessageText(chatId: number | string, messageId: number, text: string) {
    return this.call('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
    });
  }

  deleteMessage(chatId: number | string, messageId: number) {
    return this.call('deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  getUpdates(offset?: number, timeout = 30) {
    return this.call<Update[]>('getUpdates', {
      offset,
      timeout,
      allowed_updates: ['message', 'callback_query'],
    });
  }

  setWebhook(url: string, secretToken?: string) {
    return this.call('setWebhook', {
      url,
      secret_token: secretToken,
      allowed_updates: ['message', 'callback_query'],
    });
  }

  getMe() {
    return this.call<User>('getMe');
  }
}` },

    { type: 'heading', level: 2, text: 'Sending Rich Messages', id: 'rich-messages' },
    { type: 'code', language: 'typescript', code: `const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);

// Send a message with inline keyboard
await bot.sendMessage({
  chat_id: chatId,
  text: '<b>Welcome!</b>\\nChoose an option:',
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        { text: '📊 Stats', callback_data: 'action:stats' },
        { text: '⚙️ Settings', callback_data: 'action:settings' },
      ],
      [
        { text: '📖 Help', callback_data: 'action:help' },
        { text: '🌐 Website', url: 'https://example.com' },
      ],
    ],
  },
});

// Send a photo
await bot.call('sendPhoto', {
  chat_id: chatId,
  photo: 'https://example.com/image.jpg',
  caption: '<i>Check out this image!</i>',
  parse_mode: 'HTML',
});` },

    { type: 'heading', level: 2, text: 'Command Handler Architecture', id: 'command-handler' },
    { type: 'code', language: 'typescript', code: `type CommandHandler = (
  chatId: number,
  args: string[],
  message: Message
) => Promise<void>;

class BotRouter {
  private commands = new Map<string, CommandHandler>();
  private callbackHandlers = new Map<string, (chatId: number, data: string) => Promise<void>>();
  private defaultHandler: CommandHandler | null = null;

  command(name: string, handler: CommandHandler): this {
    this.commands.set(name, handler);
    return this;
  }

  callback(prefix: string, handler: (chatId: number, data: string) => Promise<void>): this {
    this.callbackHandlers.set(prefix, handler);
    return this;
  }

  default(handler: CommandHandler): this {
    this.defaultHandler = handler;
    return this;
  }

  async handleUpdate(update: Update): Promise<void> {
    if (update.callback_query) {
      const { data, message } = update.callback_query;
      if (data && message) {
        const [prefix] = data.split(':');
        const handler = this.callbackHandlers.get(prefix);
        await handler?.(message.chat.id, data);
      }
      return;
    }

    const msg = update.message;
    if (!msg?.text) return;

    const [cmd, ...args] = msg.text.split(' ');
    const command = cmd.replace(/^\\/,'').replace(/@.*$/, '');

    const handler = this.commands.get(command) || this.defaultHandler;
    if (handler) {
      await handler(msg.chat.id, args, msg);
    }
  }
}

// Usage
const router = new BotRouter()
  .command('start', async (chatId) => {
    await bot.sendMessage({ chat_id: chatId, text: 'Welcome! Use /help.' });
  })
  .command('help', async (chatId) => {
    await bot.sendMessage({
      chat_id: chatId,
      text: 'Available commands:\\n/start - Start\\n/help - This message',
    });
  })
  .callback('action', async (chatId, data) => {
    const [, action] = data.split(':');
    await bot.sendMessage({
      chat_id: chatId,
      text: \`You selected: \${action}\`,
    });
  })
  .default(async (chatId, args, msg) => {
    await bot.sendMessage({
      chat_id: chatId,
      text: \`Unknown command. Type /help for available commands.\`,
    });
  });` },

    { type: 'heading', level: 2, text: 'Webhook Setup (Recommended)', id: 'webhooks' },
    { type: 'code', language: 'typescript', code: `// Express.js webhook handler
import express from 'express';

const app = express();
app.use(express.json());

// Verify webhook secret for security
function verifyWebhookSecret(req: express.Request, secret: string): boolean {
  const signature = req.headers['x-telegram-bot-api-secret-token'];
  return signature === secret;
}

app.post('/webhook/telegram', (req, res) => {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  
  if (!verifyWebhookSecret(req, secret!)) {
    return res.status(401).send('Unauthorized');
  }

  const update = req.body;
  
  // Handle asynchronously (Telegram expects 200 OK immediately)
  router.handleUpdate(update).catch(err => {
    console.error('Error handling update:', err);
  });

  res.status(200).send('OK');
});

// Set webhook on startup
app.listen(3000, async () => {
  const webhookUrl = 'https://your-domain.com/webhook/telegram';
  await bot.setWebhook(webhookUrl, process.env.TELEGRAM_WEBHOOK_SECRET);
  console.log('Bot listening on port 3000');
});` },

    { type: 'heading', level: 2, text: 'Long Polling (Development)', id: 'long-polling' },
    { type: 'code', language: 'typescript', code: `// Simpler for local development, less efficient for production
async function pollUpdates() {
  let offset = 0;

  while (true) {
    try {
      const updates = await bot.getUpdates(offset);
      
      for (const update of updates) {
        await router.handleUpdate(update);
        offset = update.update_id + 1; // next offset
      }

      // Small delay to prevent CPU spinning
      if (updates.length === 0) {
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (err) {
      console.error('Polling error:', err);
      await new Promise(r => setTimeout(r, 5000)); // back off on error
    }
  }
}

// Start polling
pollUpdates().catch(console.error);` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Always validate the webhook secret — never trust incoming updates',
      'Return 200 OK immediately from webhooks, process asynchronously',
      'Use callback_data prefixes (e.g., "action:delete") to route callbacks',
      'Handle missing/invalid fields gracefully — not all message types are populated',
      'Implement rate limiting for user commands to prevent spam',
      'Use HTML parse mode for rich formatting, escape user input with htmlspecialchars',
      'Test locally with long polling before deploying webhooks',
    ] },
    { type: 'callout', variant: 'tip', title: 'Callback Query IDs', text: 'Always acknowledge callback queries with answerCallbackQuery() — this removes the loading state from the user\'s button. You can optionally show a notification or modal.' },
  ],
};

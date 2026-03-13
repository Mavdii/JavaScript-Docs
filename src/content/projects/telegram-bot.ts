import type { ProjectContent } from '@/types/content';

export const telegramBotProject: ProjectContent = {
  id: 'project-telegram-bot',
  title: 'Telegram Bot',
  description: 'Build a Telegram bot that responds to commands and callbacks.',
  slug: 'projects/telegram-bot',
  pillar: 'projects',
  category: 'applications',
  tags: ['Telegram', 'bot', 'Node.js', 'API'],
  difficulty: 'intermediate',
  contentType: 'project',
  summary: 'Create a Telegram bot from scratch. Learn webhook setup, command routing, inline keyboards, and state management for multi-step conversations.',
  relatedTopics: ['integration-telegram'],
  order: 5,
  updatedAt: '2025-06-01',
  readingTime: 20,
  featured: false,
  keywords: ['Telegram bot', 'webhooks', 'commands'],
  techStack: ['Node.js', 'TypeScript', 'Telegram Bot API', 'Express'],
  learningGoals: ['Set up bot webhooks', 'Handle commands and callbacks', 'Build multi-step conversations', 'Parse user input'],
  features: ['Command routing', 'Inline buttons', 'Conversational state', 'Error handling'],
  sections: [
    { type: 'heading', level: 2, text: 'Project Setup', id: 'setup' },
    { type: 'paragraph', text: 'We\'ll build a bot that responds to /start, /help, and some callback buttons. The bot will be hosted on a server with Express, and Telegram will send updates via webhooks.' },
    { type: 'code', language: 'typescript', code: `// bot.ts
import express from 'express';
import { TelegramBot } from './telegram-bot';

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);
const router = new BotRouter();

// Set up routes
router
  .command('start', handleStart)
  .command('help', handleHelp)
  .command('quote', handleQuote)
  .callback('like', handleLike)
  .default(handleUnknown);

// Webhook endpoint
app.post('/webhook/telegram', (req, res) => {
  const update = req.body;
  router.handleUpdate(update).catch(err => {
    console.error('Update error:', err);
  });
  res.status(200).send('OK');
});

app.listen(3000, async () => {
  const webhookUrl = 'https://your-domain.com/webhook/telegram';
  await bot.setWebhook(webhookUrl);
  console.log('Bot running and webhook set');
});` },

    { type: 'heading', level: 2, text: 'Command Handlers', id: 'handlers' },
    { type: 'code', language: 'typescript', code: `async function handleStart(chatId: number, args: string[]) {
  await bot.sendMessage({
    chat_id: chatId,
    text: '<b>Welcome to Quote Bot! 📖</b>\\nUse /help for available commands.',
    parse_mode: 'HTML',
  });
}

async function handleHelp(chatId: number, args: string[]) {
  await bot.sendMessage({
    chat_id: chatId,
    text: \`<b>Available Commands:</b>
/start - Start the bot
/help - Show this help
/quote - Get a random quote
/joke - Get a joke\`,
    parse_mode: 'HTML',
  });
}

async function handleQuote(chatId: number, args: string[]) {
  const quote = await fetchRandomQuote();
  
  await bot.sendMessage({
    chat_id: chatId,
    text: \`<b>"\${quote.text}"</b>\\n— <i>\${quote.author}</i>\`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '❤️ Like', callback_data: 'like:\${quote.id}' },
          { text: '🔄 Next', callback_data: 'quote:next' },
        ],
      ],
    },
  });
}

async function handleLike(chatId: number, data: string) {
  const [, quoteId] = data.split(':');
  
  // Save like to database
  await saveUserLike(chatId, quoteId);
  
  await bot.sendMessage({
    chat_id: chatId,
    text: '❤️ Quote liked!',
  });
}

async function handleUnknown(chatId: number, args: string[]) {
  await bot.sendMessage({
    chat_id: chatId,
    text: 'I don\'t understand that command. Type /help for options.',
  });
}` },

    { type: 'heading', level: 2, text: 'Stateful Conversations', id: 'state' },
    { type: 'paragraph', text: 'Some bots need to track conversation state. For example, collecting a user\'s name, then email, then confirming. We\'ll use a simple in-memory state store.' },
    { type: 'code', language: 'typescript', code: `interface UserState {
  stage: 'idle' | 'asking_name' | 'asking_email' | 'confirming';
  data: Record<string, any>;
  updatedAt: number;
}

const userStates = new Map<number, UserState>();

// Clean up old states after 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [userId, state] of userStates) {
    if (now - state.updatedAt > 30 * 60 * 1000) {
      userStates.delete(userId);
    }
  }
}, 10 * 60 * 1000);

function getOrCreateState(userId: number): UserState {
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      stage: 'idle',
      data: {},
      updatedAt: Date.now(),
    });
  }
  return userStates.get(userId)!;
}

async function handleRegister(chatId: number) {
  const state = getOrCreateState(chatId);
  state.stage = 'asking_name';
  state.data = {};
  state.updatedAt = Date.now();

  await bot.sendMessage({
    chat_id: chatId,
    text: 'What\'s your name?',
  });
}

// In message handler:
async function handleMessage(chatId: number, text: string, message: Message) {
  const state = getOrCreateState(chatId);

  if (state.stage === 'asking_name') {
    state.data.name = text;
    state.stage = 'asking_email';
    state.updatedAt = Date.now();

    await bot.sendMessage({
      chat_id: chatId,
      text: 'What\'s your email?',
    });
  } else if (state.stage === 'asking_email') {
    state.data.email = text;
    state.stage = 'confirming';
    state.updatedAt = Date.now();

    await bot.sendMessage({
      chat_id: chatId,
      text: \`Confirm your info:\\nName: \${state.data.name}\\nEmail: \${state.data.email}\`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Yes', callback_data: 'confirm:yes' },
            { text: '❌ No', callback_data: 'confirm:no' },
          ],
        ],
      },
    });
  }
}` },

    { type: 'heading', level: 2, text: 'Database Integration', id: 'database' },
    { type: 'code', language: 'typescript', code: `// Save likes to database
async function saveUserLike(chatId: number, quoteId: string) {
  await db.insert('user_likes', {
    user_id: chatId,
    quote_id: quoteId,
    created_at: new Date(),
  });
}

// Get user preferences
async function getUserPreferences(chatId: number) {
  const result = await db.query(
    'SELECT preferences FROM users WHERE telegram_id = ?',
    [chatId]
  );
  return result[0]?.preferences || {};
}

// Track user in database
async function trackUser(chatId: number, firstName: string, username?: string) {
  await db.insert(
    'users',
    {
      telegram_id: chatId,
      first_name: firstName,
      username,
      created_at: new Date(),
    },
    { onConflict: 'update' }
  );
}` },

    { type: 'heading', level: 2, text: 'Error Handling & Logging', id: 'errors' },
    { type: 'code', language: 'typescript', code: `class BotRouter {
  async handleUpdate(update: Update): Promise<void> {
    try {
      if (update.message) {
        const msg = update.message;
        if (!msg.text) return;

        const [cmd, ...args] = msg.text.split(' ');
        const command = cmd.replace(/^\\/,'').replace(/@\\w+$/, '');

        try {
          const handler = this.commands.get(command) || this.defaultHandler;
          if (handler) {
            await handler(msg.chat.id, args, msg);
          }
        } catch (err) {
          console.error(\`Error handling command \${command}:\`, err);
          
          await bot.sendMessage({
            chat_id: msg.chat.id,
            text: 'Sorry, something went wrong. Try again later.',
          });
        }
      } else if (update.callback_query) {
        const { data, message } = update.callback_query;
        if (!data || !message) return;

        try {
          const [prefix, ...parts] = data.split(':');
          const handler = this.callbackHandlers.get(prefix);
          
          if (handler) {
            await handler(message.chat.id, data);
          }

          // Acknowledge the button press
          await bot.call('answerCallbackQuery', {
            callback_query_id: update.callback_query.id,
            text: '✅ Done',
          });
        } catch (err) {
          console.error('Error handling callback:', err);
          await bot.call('answerCallbackQuery', {
            callback_query_id: update.callback_query.id,
            text: '❌ Error',
            show_alert: true,
          });
        }
      }
    } catch (err) {
      console.error('Fatal error:', err);
    }
  }
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Always acknowledge callback queries with answerCallbackQuery()',
      'Validate all user input before using it',
      'Use try/catch in handlers to prevent crashes',
      'Clean up old conversation states to avoid memory leaks',
      'Rate limit users to prevent abuse',
      'Log important events for debugging',
      'Use inline buttons for quick actions instead of asking users to type',
    ] },
    { type: 'callout', variant: 'tip', title: 'Testing Locally', text: 'Use ngrok to expose your local server: `ngrok http 3000`, then set that URL as your webhook. This lets you test without deploying.' },
  ],
};

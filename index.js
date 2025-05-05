require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// List of keywords/phrases that indicate a profile share
const profileKeywords = [
  'full stack developer',
  'years experience',
  'looking for',
  'open to work',
  'hire me',
  'portfolio',
  'resume',
  'cv',
  'linkedin.com/in/',
  'github.com/',
  'i am a developer',
  'i have experience',
  'looking for job',
  'seeking opportunities',
  'available for work',
  'hiring',
  'if you are interested',
  'looking to'
];

// Minimum number of keyword matches to trigger deletion
const MIN_MATCHES = 2;

// Channels to monitor (by name)
const MONITORED_CHANNELS = ['general'];

client.on('messageCreate', async (message) => {
  // Ignore bot messages and DMs
  if (message.author.bot || !message.guild) return;

  // Only monitor specific channels
  if (!MONITORED_CHANNELS.includes(message.channel.name)) return;

  // Count keyword matches
  const content = message.content.toLowerCase();
  let matchCount = 0;
  for (const keyword of profileKeywords) {
    if (content.toLowerCase().includes(keyword)) matchCount++;
  }

  if (matchCount >= MIN_MATCHES) {
    try {
      await message.delete();
      await message.channel.send(
        `${message.author}, please share your profile in the #introduce or #jobs channel instead of #general.`
      );
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Monitoring channels: ${MONITORED_CHANNELS.join(', ')}`);
});

client.login(process.env.DISCORD_TOKEN); 
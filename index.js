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
  'i am',
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
  'looking to',
  'message me',
  'dm',
  'if interested',
  'seeking'
];

// Minimum number of keyword matches to trigger deletion
const MIN_MATCHES = 2;

// Channels to monitor (by name)
const MONITORED_CHANNELS = ['969872347362381864'];
// Warning channel ID
const WARNING_CHANNEL_ID = '1001541723702448128'; // Replace with your actual warning channel ID

client.on('messageCreate', async (message) => {
  // Ignore bot messages and DMs
  if (message.author.bot || !message.guild) return;

  // Only monitor specific channels
  if (!MONITORED_CHANNELS.includes(message.channelId)) return;

  // Count keyword matches
  const content = message.content.toLowerCase();
  let matchCount = 0;
  for (const keyword of profileKeywords) {
    if (content.includes(keyword)) matchCount++;
  }

  if (matchCount >= MIN_MATCHES) {
    try {
      await message.delete();
      const warningChannel = await message.guild.channels.fetch(WARNING_CHANNEL_ID);
      if (warningChannel) {
        const warningEmbed = {
          color: 0xFF0000, // Red color
          title: '⚠️ Profile Share Warning',
          description: 'Please share your profile in <#970485590707564545> or <#970486424002519150> channel instead of <#969872347362381864>',
          fields: [
            {
              name: 'User',
              value: `${message.author.tag}`
            },
            {
              name: 'Channel',
              value: `<#${message.channelId}>`
            },
            {
              name: 'Content',
              value: message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content
            },
            {
              name: 'Time',
              value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`
            }
          ],
          timestamp: new Date(),
          footer: {
            text: `User ID: ${message.author.id}`
          }
        };

        await warningChannel.send({ 
          content: `Profile share detected from ${message.author}`,
          embeds: [warningEmbed] 
        });
      }
    } catch (err) {
      console.error('Failed to handle message:', err);
    }
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Monitoring channels: ${MONITORED_CHANNELS.join(', ')}`);
});

client.login(process.env.DISCORD_TOKEN); 
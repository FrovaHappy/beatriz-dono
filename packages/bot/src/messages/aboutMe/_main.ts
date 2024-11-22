import { Colors, type Locale } from 'discord.js'

export default function main(locale: Locale) {
  const { linkGithub, linkDiscord, linkTopgg } = config
  return {
    embeds: [
      {
        title: ' About Me <:kannawave:1275989866794192897>',
        description: `✨👋 Hi <user_name>!\nI'm your friendly multipurpose bot, here to assist you with everything from welcoming new members to customizing your server with cool commands like color changes. 🎨\n\nLet's make this server amazing together! 🌟\n\n<a:sparkles:1275991218383224832> [Join Our Discord Community](${linkDiscord})\n<:heart:1275997495704686713> [Show Some Love and Vote on Top.gg](${linkTopgg})\n<a:sparkles:1275991218383224832> [Contribute on GitHub](${linkGithub})`,
        color: Colors.Blue
      }
    ]
  }
}

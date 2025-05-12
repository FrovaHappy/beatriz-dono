const { PUBLIC_APPLICATION_ID: applicationId, PUBLIC_URL_API: urlApi } = import.meta.env

const urls = {
  github: 'https://github.com/FrovaHappy/beatriz-dono',
  discord: 'https://discord.gg/JRpHsGC8YQ',
  joinBot: `https://discord.com/oauth2/authorize?client_id=${applicationId}&permissions=8&integration_type=0&scope=bot`,
  oAuth: `https://discord.com/oauth2/authorize?client_id=${applicationId}&response_type=code&redirect_uri=${encodeURIComponent(`${urlApi}/auth0/discord`)}&scope=email+guilds+identify`,
  api: urlApi,
  kofi: 'https://ko-fi.com/frovahappy'
} as const

export type Urls = typeof urls
export default urls

# Beatriz-Bot
Un bot multi-herramientas para mejorar la experiencia de discord

* [ER diagram Database](https://lucid.app/lucidchart/da082022-5f26-47bf-8acb-a496613683e9/edit?viewport_loc=159%2C94%2C1779%2C852%2C0_0&invitationId=inv_938d3df7-30f9-49ae-95a8-f480185cb1f7)

## instalación
```bash
npm install
npm run dev:prisma // para desplegar bases de datos
```
## en desarrollo
```bash
npm run dev
```
## despliegue de slash-command
```bash
npm run dev:deploy
```
## build del proyecto
```bash
npm run build
```
## en producción
```bash
npm run start
```
## Variables de Entorno
```js
DISCORD_TOKEN = "token del bot"
DISCORD_CLIENT = "id del bot"
DISCORD_GUILDS = "un array de ids" // ejem: '["guildId"]' usar las comillas simple en el exterior 
DEFAULT_COOLDOWN = "un numero entero en segundos"
DISCORD_OWNER = "id del usuario principal de bot"
DISCORD_GUILD_OWNER = "id del server donde se desplegaran los comandos el owner"
DISCORD_URL_INVITE = "enlace de invitación a un servidor"

# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema
DATABASE_URL="mongodb+srv://root:randompassword@cluster0.ab1cd.mongodb.net/mydb?retryWrites=true&w=majority"
```

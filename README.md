# Beatriz-Dono

A Bot multipurpose for discord

## Init Project

### Install in Local

First execute `npm install` for installed all dependencies of monorepo.
then you need to generate the prism types, for that you have this script:

``` bash
npm run bot:generate_db
```

### Install with Docker

You need [Docker Desktop][docker_desktop] before you can continue with the run.

To run the development mode you have this command:

```bash
npm run docker:dev
```

And to run prod mode you have this command:

```bash
npm run docker:prod
```

this command is for testing the Dockerfile configurations

## Bot

### Environment Variables

The configurations are accessed through the thisGlobal.config object.

```bash
DISCORD_TOKEN = 'your discord token'
DISCORD_CLIENT = 'your discord client'
DISCORD_INVITE_URL = 'https://discord.gg/your-invite-url'

PRIVATES_SERVERS = '["342443455343334912", "443664366665643264"]' // add your private servers ids base, keep in mind that this is handled from db
OWNERS_SERVERS = '["342443455343334912"]' // this also is handled from db
COOLDOWNS_DEFAULT = '5' // in seconds
DATABASE_URL = 'mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority' // add your mongodb url
```

### Structures Files

> [!WARNING]
> the structure of the project to be changed, this can change in the future.

The project bot have the following structure directory and files for valid modules

``` js
📦services
 ┗ 📂colors // name of the service 
   ┣ 📂buttons 
   ┣ 📂menus
   ┣ 📂modals
   ┣ 📂buttons
   ┗ 📂commands
     ┗ 📂main/index.ts // in the file index.ts you can define the command, use main as reference to the main command
📦events
 ┗ 📂someEvent/index.ts // the events will follow with the same structure.
```

> [!INFO]
> the next name files/directories are reserved and cannot be executed.
> `/shared`, `.gitkeep`, `someFile.ts` and `someFile.js`.

However, these files require a defined export to be taken as valid.

### Command File

This is a example of a command file:

```typescript
/* index.ts*/

import { SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import { BuildCommand } from '../../buildersSchema'

const name = CommandsNames.nameCommand

export default BuildCommand({
  cooldown: 60,
  name,
  scope: 'owner',
  data: new SlashCommandBuilder().setName(name).setDescription('some Description'),
  async execute(interaction) {
    return { content: 'Hello! Im command 🎁' }
  }
}) satisfies BaseFileCommand
```

## Website

For the following commit... trust me 🫡.

[docker_desktop]:https://www.docker.com/products/docker-desktop/

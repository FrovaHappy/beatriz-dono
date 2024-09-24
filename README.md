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
# Bot Requieres
DISCORD_TOKEN = 'your discord token'
DISCORD_CLIENT = 'your discord client'
DISCORD_INVITE_URL = 'https://discord.gg/your-invite-url'
DATABASE_URL = 'mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority' // add your mongodb url

# Bot Optionals
PRIVATES_SERVERS = '["342443455343334912", "443664366665643264"]' // add your private servers ids base, keep in mind that this is handled from db
OWNERS_SERVERS = '["342443455343334912"]' // this also is handled from db
COOLDOWNS_DEFAULT = '5' // in seconds

# Website Requieres
IMGUR_CLIENT= 'your imgur client'
IMGUR_KEY= 'your imgur key'
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

> [!NOTE]
> the next name files/directories are reserved and cannot be executed.
> `/shared`, `.gitkeep`, `someFile.ts` and `someFile.js`.

However, these files require a defined export to be taken as valid.

### Builders Schema

The Builders Schema is a class that is used to build the commands, buttons, menus, modals, and events.

> [!NOTE]
> the property ` name ` is added forcefully to ` data ` property. this is for have a consistent with the Collections.
In the case of Button how customId and Command how name for example.

#### How to use a BuildCommand

```typescript
import { SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '@core/build/BuildCommand'
import { CommandsNames } from '@/const/interactionsNames'

export default new BuildCommand({
  // Optional
  scope: 'owner',
  cooldown: 60, // default is declared in the config file
  ephemeral: false,
  resolve: 'reply',

  // Required
  name: CommandsNames.hello,
  permissions: [], // use asome permissions how for example ['SendMessages', 'SendStickers', ...] for default
  data: new SlashCommandBuilder().setDescription('some Description'),
  async execute(interaction) {
    return { content: 'Hello! Im command 🎁' } as MessageOptions | undefined // see types/main.d.ts
  }
})
```

#### How to use a BuildButton

```typescript
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { BuildButton } from '@core/build/BuildButton'
import { ButtonNames } from '@/const/interactionsNames'

export default new BuildButton({
  // Optional
  scope: 'owner',
  cooldown: 60, // default is declared in the config file
  ephemeral: false,
  resolve: 'reply',

  // Required
  name: ButtonNames.hello,
  permissions: [], // use asome permissions how for example ['SendMessages', 'SendStickers', ...] for default
  data: new ButtonBuilder().setLabel('some Label').setStyle(ButtonStyle.Primary),
  async execute(interaction) {
    return { content: 'Hello! Im button 🎁' } as MessageOptions | undefined // see types/main.d.ts
  }
})
```

#### How to use a BuildMenu

```typescript
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'
import { BuildMenu } from '@core/build/BuildMenu'
import { MenuNames } from '@/const/interactionsNames'

export default new BuildMenu({
  // Optional
  scope: 'owner',
  cooldown: 60, // default is declared in the config file
  ephemeral: false,
  resolve: 'reply',

  // Required
  name: MenuNames.hello,
  permissions: [], // use asome permissions how for example ['SendMessages', 'SendStickers', ...] for default
  menuType: 'string', // string, user, role, mentionable, channels
  data: new StringSelectMenuBuilder({
    placeholder: 'some Placeholder'
  }).addOptions(
    new StringSelectMenuOptionBuilder().setValue('value').setLabel('label').setEmoji('🎁')
  ),
  async execute(interaction) {
    return { content: 'Hello! Im menu 🎁' } as MessageOptions | undefined // see types/main.d.ts
  }
})
```

#### How to use a BuildModal

> [!WARNING]
> Is required to use an BuildButton for execute the  interaction of the modal, and this not has that return a MessageOptions type.

```typescript
/* button.ts*/
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { BuildButton } from '@core/build/BuildButton'
import { ButtonNames, ModalNames } from '@/const/interactionsNames'

export default new BuildButton({
  name: ButtonNames.hello,
  permissions: [], // use asome permissions how for example ['SendMessages', 'SendStickers', ...] for default
  data: new ButtonBuilder().setLabel('some Label').setStyle(ButtonStyle.Primary),
  async execute(interaction) {
    const modal = globalThis.modals.get(ModalNames.hello)

    interaction.showModal(modal.data)
    // don't executed nothing from this point
  }


/* Modal.ts*/
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from 'discord.js'
import { BuildModal } from '@core/build/BuildModal'
import { ModalNames } from '@/const/interactionsNames'

export default new BuildModal({
  // Optional
  scope: 'owner',
  cooldown: 60, // default is declared in the config file
  ephemeral: false,
  resolve: 'reply',

  // Required
  name: ModalNames.hello,
  permissions: [], // use asome permissions how for example ['SendMessages', 'SendStickers', ...] for default
  data: new ModalBuilder({ title: 'some Title' }).addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(textEdit)),
  async execute(interaction) {
    return { content: 'Hello! Im modal 🎁' } as MessageOptions | undefined // see types/main.d.ts
  }
})
```

#### How to use a BuildEvent

```typescript
import { BuildEvent } from '@core/build/BuildEvent'
import { Events } from 'discord.js'

export default new BuildEvent({
  // Optional
  scope: 'owner',
  cooldown: 60, // default is declared in the config file
  ephemeral: false,
  resolve: 'reply',

  // Required
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    // handle interaction here...
  }
})
```

## Website

For the following commit... trust me 🫡.

[docker_desktop]:https://www.docker.com/products/docker-desktop/

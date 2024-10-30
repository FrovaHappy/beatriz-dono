# Beatriz-Dono

A Bot multipurpose for discord

## Init Project

> [!NOTE]
> Si necesitas cambiar configuraciones del bot, puedes hacerlo manualmente desde la base de datos (falta por agrear un comando o interface para la manipulación de settings).

### Configuración y Ejecución en local

Sigue estos pasos para poner en marcha el proyecto:

1. **Agregar el archivo `.env`:**  
Crea un archivo `.env` en la raíz del proyecto. Este archivo debe incluir las variables de entorno necesarias para el proyecto ([ver Env sección](#environment-variables)).

2. **Instalar dependencias:**  
Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

3. **Generar base de datos**
  Crea y configura la base de datos ejecutando el comando:

```bash
npm run generate_db
```

4. **Ejecutar el Proyecto**
Inicia el servidor en modo de desarrollo con el siguiente comando:

```bash
npm run dev
```

### Install with Docker

Para ejecutar con docker necesitas tener instalado [docker](https://docs.docker.com/engine/install/) en tu computadora.

1. Crea un archivo `.env` en la raíz del proyecto. Este archivo debe incluir las variables de entorno necesarias para el proyecto ([ver Env sección](#environment-variables)).

2. Ejecuta el siguiente comando para generar el contenedor de docker:

```bash
npm run docker:build
```

## Environment Variables

The configurations are accessed through the thisGlobal.config object in the case of the bot.
> [!NOTE]
> The env of website not is required for the build of the docker container.

```bash
# General Environment
DISCORD_CLIENT = 'discord client id'
# Bot Requieres
DISCORD_TOKEN = 'Token of Bot Discord'
DISCORD_OWNER = 'your server discord owner id'
DATABASE_URL = 'URL of the database mongodb'

# API Requieres
DISCORD_CLIENT_SECRET = 'Token of Application Discord'
URL_CLIENT_DOMAIN = 'URL of the website needed for session'
SECRET_KEY = 'secret used for session'
IMGUR_CLIENT = 'your imgur client'
IMGUR_KEY = 'your imgur key'

# Website Requieres
URL_API = 'URL of the API '
```

### Add I18n Languages

#### Added a new language

First you have to add the language to the i18n folder, then you have to add the language to the services folder.

```js
📦i18ns
 ┗ 📂colors // name of the service
   ┣ en-US.json // file main, this is required.
   ┣ es-ES.json
   ┗ pt-BR.json
```

And add type in the i18n/types.d.ts. use the interactionsNames as key reference.

```typescript
... // other types
import type color from './colors/en-US.json'
import CommandNames from '@/const/interactionsNames'

export interface I18n {
  ... // other types
  CommandNames.colors: typeof color
}
```

#### How use the i18n

You have the `getI18n` function to get the i18n, and the `getI18nCollection` to get all the i18n.

* The `getI18nCollection` return an array with the language and the i18n, with the type `Array<[Locate, I18n[InteractionNames]]>`.
* The `getI18n` return the i18n with the type `I18n[InteractionNames]`.

### Structures Files

The program searches for instances of the builders found inside the `/services` folder. This allows you to use the file system of your choice. Here are some recommendations for this project:

* **Services with only one file**: You can leave it in the root of the project.
* **Services with more than two interactions**: Group them accordingly.
* **More complex systems**: Consider using a hexagonal or similar architecture.

``` js
📦services
 ┗ 📂services1
   ┣ 📜service.button.ts      // File for buttons Ej: editColorsDefault.button.ts
   ┣ 📜service.menu.ts        // File for menus Ej: colorDefault.menu.ts
   ┣ 📜service.modal.ts       // File for modals Ej: editColorDefault.modal.ts
   ┗ 📜service.command.ts     // File for commands Ej: help.command.ts
 ┗ 📂services2                // suggestion for services with more than two interactions
   ┣ 📂commands
   │  ┗ 📜service.command.ts
   ┗ 📂modals
 ┗ 📂services3                // For services complex systems use the architecture of preference
   ┣ 📂api
   ┣ 📂models
   ┗ 📂controllers

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

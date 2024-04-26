# Beatriz-Dono

A Bot multipurpose for discord

## Contents

* [Init Projects](#init-project)
  * [Install in Local](#install-in-local)
  * [Install with Docker](#install-with-docker)
* [Bot (Backend)](#bot)
  * [Configurations](#configurations)
    * [structures Files](#structures-files)
    * [Command File](#command-file)
* [Website](#website)

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

### Configurations

#### Structures Files

The project bot have the following structure directory and files for valid modules

``` js
📦src
 ┣ 📂buttons
 ┃ ┣ 📂someButton
 ┃ ┃ ┗ 📜index.ts //  for a button valid require of subfolder/index.ts (*) 
 ┣ 📂commands
 ┃ ┣ 📂someCommand
 ┃ ┃ ┗ 📜index.ts //  for a command valid require of subfolder/index.ts (*)
 ┣ 📂events
 ┃ ┗ 📜someEvent.ts // 🙀 currently it works like this, but this will change in the future.  
```

However, these files require a defined export to be taken as valid.

#### Command File

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

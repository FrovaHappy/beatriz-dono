import { ActionRowBuilder, Colors, EmbedBuilder, resolveColor } from 'discord.js'
import type { EditReplyConstructorFn } from '../../types/UtilityTypes'
import { ButtonsNames } from '../../enums'
interface EndingSusses {
  color: `#${string}`
}
const cleanRole: EditReplyConstructorFn = ({ interaction }) => {
  const buttonInvite = interaction.client.buttons.get(ButtonsNames.invite)?.data
  return {
    embeds: [
      new EmbedBuilder({
        color: resolveColor('#333333'),
        title: 'Color Quitado'
      })
    ],
    components: [new ActionRowBuilder().addComponents(buttonInvite)]
  }
}
const errorService: EditReplyConstructorFn = ({ interaction }) => {
  const buttonInvite = interaction.client.buttons.get(ButtonsNames.invite)?.data
  return {
    embeds: [
      new EmbedBuilder({
        color: Colors.Red,
        title: 'Error en el servicio',
        description: 'por favor avisa de este bug'
      })
    ],
    components: [new ActionRowBuilder().addComponents(buttonInvite)]
  }
}
const endingSusses: EditReplyConstructorFn<EndingSusses> = ({ color, interaction }) => {
  const buttonInvite = interaction.client.buttons.get(ButtonsNames.invite)?.data
  return {
    embeds: [
      new EmbedBuilder({
        color: resolveColor(color),
        title: 'Aquí tienes tu nuevo color...',
        description: 'Disfrútalo 🌸🌸'
      })
    ],
    components: [new ActionRowBuilder().addComponents(buttonInvite)]
  }
}
const invalidColor: EditReplyConstructorFn<EndingSusses> = ({ interaction, color }) => {
  const buttonInvite = interaction.client.buttons.get(ButtonsNames.invite)?.data
  return {
    embeds: [
      new EmbedBuilder({
        title: 'El color es invalido...',
        description: `
      Asegúrate de que el color pasado cumpla con la siguientes cualidades:

      - debe tener el siguiente formato \`#ffffff\` \n- el color \`#000000\` es invalido

      El input recibido fue: \`${color}\`
      `,
        color: Colors.Orange
      })
    ],
    components: [new ActionRowBuilder().addComponents(buttonInvite)]
  }
}
const requireSettings: EditReplyConstructorFn = ({ interaction }) => {
  const buttonInvite = interaction.client.buttons.get(ButtonsNames.invite)?.data
  return {
    embeds: [
      new EmbedBuilder({
        title: 'Este Comando Requiere de acciones Previas',
        description: 'ejecuta el comando `/set-colors` ☕'
      })
    ],
    components: [new ActionRowBuilder().addComponents(buttonInvite)]
  }
}

export default { endingSusses, cleanRole, errorService, invalidColor, requireSettings }

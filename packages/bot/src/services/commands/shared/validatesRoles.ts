import { type ColorCommand } from '@prisma/client'
import config from '@core/config'
import { type Interaction } from 'discord.js'
interface ReturnData {
  validColorMain: boolean
  validColorPermission: boolean
}
export default function validatesRoles(interaction: Interaction, server: ColorCommand): ReturnData {
  const colorController = interaction.guild?.roles.cache.has(server.pointerId) ?? false
  const colorPermission = interaction.guild?.roles.cache.has(server?.rolePermission ?? config.roleUndefined) ?? false

  return {
    validColorMain: colorController,
    validColorPermission: colorPermission
  }
}

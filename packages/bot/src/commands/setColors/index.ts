import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import db from '../../db'
import createRole from './createRole'
import messages from './messages'
import config from '../../config'
const name = CommandsNames.setColors
export default BuildCommand({
  cooldown: 30,
  ephemeral: true,
  name,
  scope: 'public',
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Inicia la primera configuración de colores.')
    .addRoleOption(roleOption => roleOption.setName('role').setDescription('rol requerido para /colors'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(i) {
    const rolePermission = i.options.getRole('role', false)?.id ?? null

    if (!i.appPermissions?.has([PermissionFlagsBits.ManageRoles])) {
      return messages.requiredPermissions
    }
    const serverId = i.guildId
    if (!serverId) {
      return { content: 'server not found' }
    }
    const { pointerId } =
      (await db.colorCommand.findUnique({
        where: { serverId }
      })) ?? {}

    const role = i.guild?.roles.cache.find(r => r.id === pointerId ?? config.roleUndefined) ?? (await createRole(i))

    if (!role) return { content: 'no se pudo crear/encontrar el role' }
    await db.colorCommand.upsert({
      where: { serverId },
      create: { pointerId: role.id, serverId, rolePermission },
      update: { pointerId, rolePermission }
    })
    return { content: 'role creado' }
  }
})

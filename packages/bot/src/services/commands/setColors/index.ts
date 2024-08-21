import BuildCommand from '@core/build/BuildCommand'
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import db from '@core/db'
import createRole from './createRole'
import { CommandNames } from '@/const/interactionsNames'

export default new BuildCommand({
  cooldown: 30,
  ephemeral: true,
  name: CommandNames.colorsSet,
  permissions: [],
  scope: 'public',
  data: new SlashCommandBuilder()
    .setDescription('Inicia la primera configuración de colores.')
    .addRoleOption(roleOption => roleOption.setName('role').setDescription('rol requerido para /colors'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(i) {
    const rolePermission = i.options.getRole('role', false)?.id ?? null

    if (!i.appPermissions?.has([PermissionFlagsBits.ManageRoles])) {
      return {
        content: 'manage roles is required'
      }
    }
    const serverId = i.guildId
    if (!serverId) {
      return { content: 'server not found' }
    }
    const { pointerId } =
      (await db.colorCommand.findUnique({
        where: { serverId }
      })) ?? {}

    const role = i.guild?.roles.cache.find(r => r.id === pointerId) ?? (await createRole(i))

    if (!role) return { content: 'no se pudo crear/encontrar el role' }
    await db.colorCommand.upsert({
      where: { serverId },
      create: { pointerId: role.id, serverId, rolePermission },
      update: { pointerId, rolePermission }
    })
    return { content: 'role creado' }
  }
})

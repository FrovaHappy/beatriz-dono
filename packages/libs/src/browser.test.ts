import { describe, expect, it, vi } from 'vitest'
import { filterTextExample, getCssFonts } from './browser'

describe('browser', () => {
  describe('getCssFonts', () => {
    it('should return CSS font declarations', () => {
      const cssResult = getCssFonts()
      expect(typeof cssResult).toBe('string')
      expect(cssResult).toContain('@font-face')
      expect(cssResult).toContain('font-family')
      expect(cssResult).toContain('src: url')
    })

    it('should include all font families', () => {
      const cssResult = getCssFonts()
      // Check that common font families are included
      expect(cssResult).toContain('Inter')
      expect(cssResult).toContain('Roboto')
    })

    it('should include style tag wrapper', () => {
      const cssResult = getCssFonts()
      expect(cssResult).toContain('<style')
      expect(cssResult).toContain('</style>')
    })
  })

  describe('filterTextExample', () => {
    it('should have required user properties', () => {
      expect(filterTextExample).toHaveProperty('userId')
      expect(filterTextExample).toHaveProperty('userName')
      expect(filterTextExample).toHaveProperty('userDisplayName')
      expect(filterTextExample).toHaveProperty('userAvatar')
      expect(filterTextExample).toHaveProperty('userBanner')
      expect(filterTextExample).toHaveProperty('userDiscriminator')
    })

    it('should have required guild properties', () => {
      expect(filterTextExample).toHaveProperty('guildName')
      expect(filterTextExample).toHaveProperty('guildId')
      expect(filterTextExample).toHaveProperty('membersCount')
      expect(filterTextExample).toHaveProperty('guildAvatar')
      expect(filterTextExample).toHaveProperty('guildBanner')
    })

    it('should have valid data types', () => {
      expect(typeof filterTextExample.userId).toBe('string')
      expect(typeof filterTextExample.userName).toBe('string')
      expect(typeof filterTextExample.guildName).toBe('string')
      expect(typeof filterTextExample.membersCount).toBe('string')
    })

    it('should have valid avatar and banner URLs', () => {
      expect(filterTextExample.userAvatar).toMatch(/^https?:\/\//)
      expect(filterTextExample.userBanner).toMatch(/^https?:\/\//)
      expect(filterTextExample.guildAvatar).toMatch(/^https?:\/\//)
      expect(filterTextExample.guildBanner).toMatch(/^https?:\/\//)
    })
  })

  // Note: generateImage tests are skipped as they require DOM environment
  // and canvas APIs that are not available in Node.js test environment
})

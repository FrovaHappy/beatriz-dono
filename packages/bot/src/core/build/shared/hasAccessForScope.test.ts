import '../../../config'
import { hasAccessForScope, reorderScope } from './hasAccessForScope'

globalThis.config = {
  ...globalThis.config,
  setting: {
    ...globalThis.config.setting,
    privatesServers: ['111'],
    ownersServers: ['222']
  }
}

describe('hasAccessForScope', () => {
  it('should return true if the scope is public', () => {
    expect(hasAccessForScope('public', '000')).toBe(true)
  })
  it('should return true if the scope is private and the user not is owner', () => {
    expect(hasAccessForScope('private', '111')).toBe(true)
  })
  it('should return true if the scope not is private and the user is owner', () => {
    expect(hasAccessForScope('private', '222')).toBe(true)
  })

  it('should return true if the scope is owner', () => {
    expect(hasAccessForScope('owner', '222')).toBe(true)
  })
  it('should return false if the scope is not owner', () => {
    expect(hasAccessForScope('owner', '111')).toBe(false)
  })
  it('should return false if the scope is not private and the user not is owner', () => {
    expect(hasAccessForScope('private', '333')).toBe(false)
  })
})

describe('reorderScope', () => {
  it('should return the correct order', () => {
    expect(reorderScope(['111', '222', '333'], ['333'])).toEqual({
      privates: ['111', '222'],
      owners: ['333']
    })
  })
})

import { canEditPost, hasPermission } from './can'

describe('can', () => {
  it('hasPermission return true for user with this permission', () => {
    expect(hasPermission({ role: 'CAN_BLOCK_POST', id: 'x' }, 'CAN_BLOCK_POST')).toBe(true)
  })

  it('hasPermission return false for user without this permission', () => {
    expect(hasPermission({ role: 'DEFAULT', id: 'x' }, 'CAN_BLOCK_POST')).toBe(false)
  })

  it('hasPermission return true for user with "ALL" permission', () => {
    expect(hasPermission({ role: 'CAN_ALL', id: 'x' }, 'CAN_BLOCK_POST')).toBe(true)
  })

  it('only author can edit his idea', () => {
    expect(canEditPost({ role: 'DEFAULT', id: 'x' }, { authorId: 'x' })).toBe(true)
    expect(canEditPost({ role: 'DEFAULT', id: 'hacker' }, { authorId: 'x' })).toBe(false)
  })
})

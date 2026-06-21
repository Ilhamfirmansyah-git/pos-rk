import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Uncomment when writing Dexie unit tests:
// import 'fake-indexeddb/auto'

const originalWarn = console.warn.bind(console)
vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (msg.includes('ReactDOM.render') || msg.includes('act(...)')) return
  originalWarn(...args)
})

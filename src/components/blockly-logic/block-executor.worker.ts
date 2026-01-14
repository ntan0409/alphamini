/// <reference lib="webworker" />
// WebWorker (TypeScript) that executes arbitrary JS code sent from the main thread.
// Main -> Worker messages: { type: 'run', code: string, resultKey?: string }
// Worker -> Main messages:
// { type: 'log', message }
// { type: 'done', result }
// { type: 'error', error }

// Forward console.* to the main thread as log messages
const forward = (level: string, args: unknown[]) => {
  try {
    const message = args.map(a => {
      try { return typeof a === 'string' ? a : JSON.stringify(a); } catch { return String(a); }
    }).join(' ')
    self.postMessage({ type: 'log', message, level })
  } catch (e) { /* ignore */ }
}

// Replace console methods with forwarders (keeps other console methods intact)

// console.log = (...args: unknown[]) => forward('log', args)
// console.info = (...args: unknown[]) => forward('info', args)
// console.warn = (...args: unknown[]) => forward('warn', args)
// console.error = (...args: unknown[]) => forward('error', args)

self.addEventListener('message', async (e: MessageEvent) => {
  const data = e.data || {}
  if (data.type === 'run') {
    const code = data.code || ''
    try {
      // Wrap code in an async IIFE so async/await works.
      // The provided code is expected to return an object like { result: [] } on success or { error: '' } on failure.
      const wrapper = `(async function(){\n${code}\n})()`

      const fn = new Function(wrapper)
      const res = fn()
      const awaited = (res && typeof res.then === 'function') ? await res : res

      // If the user's code returns an object with `result` or `error`, forward it directly.
      if (awaited && typeof awaited === 'object') {
        if ('result' in awaited) {
          try { self.postMessage({ result: awaited.result }) } catch (e) { /* ignore */ }
          return
        }
        if ('error' in awaited) {
          try { self.postMessage({ error: awaited.error }) } catch (e) { /* ignore */ }
          return
        }
      }

      // Fallback: return the awaited value as result (wrap in array if undefined)
      try { self.postMessage({ result: awaited === undefined ? [] : awaited }) } catch (e) { /* ignore */ }
    } catch (err) {
      try { self.postMessage({ error: String(err) }) } catch (e) { /* ignore */ }
    }
  }
})

self.addEventListener('error', function (ev) {
  try { self.postMessage({ type: 'error', error: ev?.message || String(ev) }) } catch (e) { /* ignore */ }
})

export {}

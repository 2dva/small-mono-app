import EventEmitter from 'events'

const EMIT_DUMMY_EVENTS = false
const ENABLED = false

export const ee = new EventEmitter()

export const captureLogs = () => {
  type LogFunction = (m: string) => boolean
  let old_write: LogFunction
  let hook_stream = function(_stream: typeof process.stdout, fn: LogFunction) {
      old_write = _stream.write; // Reference default write method
      _stream.write = fn // _stream now write with our shiny function
      return function() {
          _stream.write = old_write; // reset to the default write method
      };
  }

  if (!ENABLED) return

  // hook up standard output
  hook_stream(process.stdout, function(params) {
      ee.emit('log', params)
      old_write(JSON.stringify(params));
      return true
  });

}

if (EMIT_DUMMY_EVENTS) {
  setInterval(() => {
    const data = { timestamp: new Date().toISOString() };
    console.log(data)
  }, 30000);
}

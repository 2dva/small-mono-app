import EventEmitter from 'events'

const EMIT_DUMMY_EVENTS = false

export const ee = new EventEmitter()

export const captureLogs = () => {
  // console.log = function(params) {
  //     ee.emit('log', params)
  //     process.stdout.write(JSON.stringify(params) + '\n');
  // };
  type LogFunction = (m: string) => boolean
  let old_write: LogFunction
  let hook_stream = function(_stream: typeof process.stdout, fn: LogFunction) {
      old_write = _stream.write; // Reference default write method
      _stream.write = fn // _stream now write with our shiny function
      return function() {
          _stream.write = old_write; // reset to the default write method
      };
  }

  // hook up standard output
  let unhook_stdout = hook_stream(process.stdout, function(params) {
      ee.emit('log', params)
      old_write(JSON.stringify(params) + '\n');
      return true
  });

}

if (EMIT_DUMMY_EVENTS) {
  const intervalId = setInterval(() => {
    const data = { timestamp: new Date().toISOString() };
    // res.write(`data: ${JSON.stringify(data)}\n\n`);
    console.log(data) // ee.emit('log', { data })
  }, 30000);
}

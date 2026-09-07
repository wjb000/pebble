import { networkInterfaces } from 'node:os'

const nets = networkInterfaces()
const addrs = []
for (const list of Object.values(nets)) {
  for (const net of list ?? []) {
    if (net.family === 'IPv4' && !net.internal) addrs.push(net.address)
  }
}
const ip = addrs[0] ?? '127.0.0.1'
console.log('')
console.log('Same WiFi (phone/tablet/other laptop):')
console.log(`  http://${ip}:5173/sim`)
console.log(`  http://${ip}:5173/`)
console.log('')
console.log('On this Mac only:')
console.log('  http://127.0.0.1:5173/sim')
console.log('')

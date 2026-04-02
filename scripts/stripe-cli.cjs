/**
 * Runs the Stripe CLI even when npm/cmd doesn't have WinGet's PATH yet.
 * Override with STRIPE_CLI_PATH=C:\path\to\stripe.exe if needed.
 */
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function findStripeExe() {
  if (process.env.STRIPE_CLI_PATH && fs.existsSync(process.env.STRIPE_CLI_PATH)) {
    return process.env.STRIPE_CLI_PATH
  }
  const local = process.env.LOCALAPPDATA
  if (local) {
    const packagesDir = path.join(local, 'Microsoft', 'WinGet', 'Packages')
    if (fs.existsSync(packagesDir)) {
      try {
        for (const name of fs.readdirSync(packagesDir)) {
          if (name.startsWith('Stripe.StripeCli')) {
            const exe = path.join(packagesDir, name, 'stripe.exe')
            if (fs.existsSync(exe)) return exe
          }
        }
      } catch {
        /* ignore */
      }
    }
    const linkExe = path.join(local, 'Microsoft', 'WinGet', 'Links', 'stripe.exe')
    if (fs.existsSync(linkExe)) return linkExe
  }
  return 'stripe'
}

const stripe = findStripeExe()
const args = process.argv.slice(2)

if (stripe === 'stripe') {
  console.error(
    'Stripe CLI not found. Install: winget install Stripe.StripeCli\n' +
      'Then restart the terminal, or set STRIPE_CLI_PATH to stripe.exe'
  )
}

const r = spawnSync(stripe, args, { stdio: 'inherit', shell: false })
process.exit(r.status === null ? 1 : r.status)

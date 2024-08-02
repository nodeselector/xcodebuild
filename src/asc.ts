import * as core from '@actions/core'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export type AppStoreConnectApiConfig = {
  KeyId: string
  IssuerId: string
  KeyPath: string
}

const ascDir = path.join(os.homedir(), '.appstoreconnect/private_keys')
const ascInfoPath = `${ascDir}/keyinfo.json`

export async function loadAppStoreConnectApiConfig(): Promise<AppStoreConnectApiConfig> {
  let cfg: AppStoreConnectApiConfig = {
    KeyId: '',
    IssuerId: '',
    KeyPath: ''
  }

  core.debug(`Looking for App Store Connect API key info at ${ascInfoPath}`)

  if (fs.existsSync(ascInfoPath)) {
    core.debug('found key info on disk')
    const data = fs.readFileSync(ascInfoPath, 'utf8')
    cfg = JSON.parse(data)
  }

  if (!cfg.KeyId) {
    core.debug('key id not found in key info reading from inputs')
    cfg.KeyId = core.getInput('app-store-connect-api-key-key-id')
  }

  if (!cfg.IssuerId) {
    core.debug('issuer id not found in key info reading from inputs')
    cfg.IssuerId = core.getInput('app-store-connect-api-key-issuer-id')
  }

  if (!cfg.KeyPath) {
    core.debug('key path not found in key info reading from inputs')
    cfg.KeyPath = core.getInput('app-store-connect-api-key-key-path')
  }

  return cfg
}

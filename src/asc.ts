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

  if (fs.existsSync(ascInfoPath)) {
    const data = fs.readFileSync(ascInfoPath, 'utf8')
    cfg = JSON.parse(data)
  }

  if (!cfg.KeyId) {
    cfg.KeyId = core.getInput('app-store-connect-api-key-key-id')
  }

  if (!cfg.IssuerId) {
    cfg.IssuerId = core.getInput('app-store-connect-api-key-issuer-id')
  }

  if (!cfg.KeyPath) {
    cfg.KeyPath = core.getInput('app-store-connect-api-key-key-path')
  }

  return cfg
}

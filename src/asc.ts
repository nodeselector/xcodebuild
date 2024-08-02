import * as core from '@actions/core'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export type AppStoreConnectApiConfig = {
  KeyId: string
  IssuerId: string
  KeyPath: string
}

type keyinfoFile = {
  keyId: string
  issuerId: string
  privateKey: string
}

const ascDir = path.join(os.homedir(), '.appstoreconnect/private_keys')
const ascInfoPath = `${ascDir}/keyinfo.json`

export async function loadAppStoreConnectApiConfig(): Promise<AppStoreConnectApiConfig> {
  const cfg: AppStoreConnectApiConfig = {
    KeyId: '',
    IssuerId: '',
    KeyPath: ''
  }

  core.debug(`Looking for App Store Connect API key info at ${ascInfoPath}`)

  if (fs.existsSync(ascInfoPath)) {
    core.debug('found key info on disk')
    const data = fs.readFileSync(ascInfoPath, 'utf8')
    const keyinfo: keyinfoFile = JSON.parse(data)
    cfg.KeyId = keyinfo.keyId
    cfg.IssuerId = keyinfo.issuerId
    cfg.KeyPath = path.join(ascDir, `AuthKey_${cfg.KeyId}.p8`)
  }

  if (!cfg.KeyId) {
    core.debug('key id not found in key info reading from inputs')
    cfg.KeyId = core.getInput('app-store-connect-api-key-key-id')
  }

  if (!cfg.KeyId) {
    throw new Error(
      'App Store Connect API key ID is required but was not found in key info or inputs'
    )
  }

  if (!cfg.IssuerId) {
    core.debug('issuer id not found in key info reading from inputs')
    cfg.IssuerId = core.getInput('app-store-connect-api-key-issuer-id')
  }

  if (!cfg.IssuerId) {
    throw new Error(
      'App Store Connect API issuer ID is required but was not found in key info or inputs'
    )
  }

  if (!cfg.KeyPath) {
    cfg.KeyPath = core.getInput('app-store-connect-api-key-key-path')
  } 

  return cfg
}

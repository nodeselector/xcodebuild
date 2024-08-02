import { spawn, SpawnResult } from './spawn'
import { AppStoreConnectApiConfig } from './asc'

import path from 'node:path'

export type UploadOptions = {
  Type: string
  ExportPath: string
  ProductName: string
  AppStoreConnectApiConfig: AppStoreConnectApiConfig
}

function argumentsBuilder(options: UploadOptions): string[] {
  const file = path.join(options.ExportPath, `${options.ProductName}.ipa`) // TODO ipa extension is hardcoded
  const args = [
    'altool',
    '--upload-app', // TODO start using --upload-package (--upload-app is deprecated)
    '--type',
    options.Type,
    '--file',
    file,
    '--apiKey',
    options.AppStoreConnectApiConfig.KeyId,
    '--apiIssuer',
    options.AppStoreConnectApiConfig.IssuerId
  ]
  return args
}

/**
 * Upload an app.
 * @param options The options for the upload.
 * @returns {Promise<SpawnResult>} The result of the upload.
 */
export async function uploadApp(options: UploadOptions): Promise<SpawnResult> {
  const args = argumentsBuilder(options)
  return spawn('xcrun', args)
}

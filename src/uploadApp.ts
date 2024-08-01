import { spawn, SpawnResult } from './spawn'
import path from 'node:path'

type UploadOptions = {
  Type: string
  ExportPath: string
  ProductName: string
  AppStoreConnectAPIKeyID: string
  AppStoreConnectAPIIssuer: string
}

async function argumentsBuilder(options: UploadOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const file = path.join(options.ExportPath, `${options.ProductName}.ipa`) // TODO ipa extension is hardcoded
    const args = [
      'xcrun',
      'altool',
      '--upload-app',
      '--type', options.Type,
      '--file', file,
      '--apiKey', options.AppStoreConnectAPIKeyID,
      '--issuer', options.AppStoreConnectAPIIssuer
    ]
    resolve(args)
  })
}

/**
 * Upload an app.
 * @param options The options for the upload.
 * @returns {Promise<SpawnResult>} The result of the upload.
 */
export async function uploadApp(options: UploadOptions): Promise<SpawnResult> {
  const args = await argumentsBuilder(options)
  return spawn('xcrun', args)
}
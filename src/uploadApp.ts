import { spawn, SpawnResult } from './spawn'

type UploadOptions = {
  Type: string
  File: string
  AppStoreConnectAPIKeyID: string
  AppStoreConnectAPIIssuer: string
}

async function argumentsBuilder(options: UploadOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const args = [
      'xcrun',
      'altool',
      '--upload-app',
      '--type', options.Type,
      '--file', options.File,
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
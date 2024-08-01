import { SpawnResult, spawn } from './spawn'

type ArchiveOptions = {
  Scheme: string
  Project: string
  ArchivePath: string
  AllowProvisioningUpdates: boolean
  AllowProvisioningDeviceRegistration: boolean
  AppStoreConnectAPIKey: string
  AppStoreConnectAPIIssuer: string
  AppStoreConnectAPIKeyID: string
}

async function argumentsBuilder(options: ArchiveOptions): Promise<string[]> {
  // TODO if an option is not provided we should figure out defaults based
  // on what we can infer from the project.
  return new Promise((resolve, reject) => {
    resolve([
      'archive',
      '--scheme',
      options.Scheme,
      '--project',
      options.Project,
      '--archive-path',
      options.ArchivePath,
      '--allow-provisioning-updates',
      options.AllowProvisioningUpdates.toString(),
      '--allow-provisioning-device-registration',
      options.AllowProvisioningDeviceRegistration.toString(),
      '--app-store-connect-api-key',
      options.AppStoreConnectAPIKey,
      '--app-store-connect-api-issuer',
      options.AppStoreConnectAPIIssuer,
      '--app-store-connect-api-key-id',
      options.AppStoreConnectAPIKeyID
    ])
  })
}

export async function archive(options: ArchiveOptions): Promise<SpawnResult> {
  return spawn('xcodebuild', await argumentsBuilder(options))
}

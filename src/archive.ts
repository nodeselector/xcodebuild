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
      '-destination',
      'generic/platform=iOS',
      '-scheme',
      options.Scheme,
      '-project',
      options.Project,
      '-archivePath',
      options.ArchivePath,
      '-allowProvisioningUpdates',
      // options.AllowProvisioningUpdates.toString(),
      // '-allowProvisioningDeviceRegistration',
      // options.AllowProvisioningDeviceRegistration.toString(), TODO
      '-authenticationKeyPath',
      options.AppStoreConnectAPIKey,
      '-authenticationKeyIssuerID',
      options.AppStoreConnectAPIIssuer,
      '-authenticationKeyID',
      options.AppStoreConnectAPIKeyID
    ])
  })
}

export async function archive(options: ArchiveOptions): Promise<SpawnResult> {
  return spawn('xcodebuild', await argumentsBuilder(options))
}

import { SpawnResult, spawn } from './spawn'

type ArchiveOptions = {
  Scheme: string
  Project: string
  ArchivePath: string
  Workspace: string
  Destination: string
  AllowProvisioningUpdates: boolean
  AllowProvisioningDeviceRegistration: boolean
  AppStoreConnectAPIKey: string
  AppStoreConnectAPIIssuer: string
  AppStoreConnectAPIKeyID: string
}

async function argumentsBuilder(options: ArchiveOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const args = [
      'archive',
    ]

    if (options.Scheme) {
      args.push('-scheme', options.Scheme)
    }

    if (options.Project) {
      args.push('-project', options.Project)
    }

    if (options.ArchivePath) {
      args.push('-archivePath', options.ArchivePath)
    }

    if (options.Workspace) {
      args.push('-workspace', options.Workspace)
    }

    if (options.Destination) {
      args.push('-destination', options.Destination)
    }

    if (options.AllowProvisioningUpdates) {
      args.push('-allowProvisioningUpdates')
    }

    if (options.AllowProvisioningDeviceRegistration) {
      args.push('-allowProvisioningDeviceRegistration')
    }

    if (options.AppStoreConnectAPIKey) {
      args.push('-authenticationKeyPath', options.AppStoreConnectAPIKey)
    }

    if (options.AppStoreConnectAPIIssuer) {
      args.push('-authenticationKeyIssuerID', options.AppStoreConnectAPIIssuer)
    }

    if (options.AppStoreConnectAPIKeyID) {
      args.push('-authenticationKeyID', options.AppStoreConnectAPIKeyID)
    }

    resolve(args)
  })
}

export async function archive(options: ArchiveOptions): Promise<SpawnResult> {
  return spawn('xcodebuild', await argumentsBuilder(options))
}

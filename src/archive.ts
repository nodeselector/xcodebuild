import { SpawnResult, spawn } from './spawn'
import { AppStoreConnectApiConfig } from './asc'

export type ArchiveOptions = {
  Scheme: string
  Project: string
  ArchivePath: string
  Workspace: string
  Destination: string
  AllowProvisioningUpdates: boolean
  AllowProvisioningDeviceRegistration: boolean
  AppStoreConnectApiConfig: AppStoreConnectApiConfig
}

function argumentsBuilder(options: ArchiveOptions): string[] {
  const args = ['archive']

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

  if (options.AppStoreConnectApiConfig.KeyPath) {
    args.push(
      '-authenticationKeyPath',
      options.AppStoreConnectApiConfig.KeyPath
    )
  }

  if (options.AppStoreConnectApiConfig.IssuerId) {
    args.push(
      '-authenticationKeyIssuerID',
      options.AppStoreConnectApiConfig.IssuerId
    )
  }

  if (options.AppStoreConnectApiConfig.KeyId) {
    args.push('-authenticationKeyID', options.AppStoreConnectApiConfig.KeyId)
  }

  return args
}

export async function archive(options: ArchiveOptions): Promise<SpawnResult> {
  return spawn('xcodebuild', argumentsBuilder(options))
}

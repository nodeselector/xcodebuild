import { SpawnResult, spawn } from './spawn'
import plist from 'plist'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

type ExportOptions = {
  ArchivePath: string
  ExportPath: string
  ExportOptionsPlist: string
  ExportMethod: string
  AllowProvisioningUpdates: boolean
  AllowProvisioningDeviceRegistration: boolean
  AppStoreConnectAPIKey: string
  AppStoreConnectAPIIssuer: string
  AppStoreConnectAPIKeyID: string
}

async function argumentsBuilder(options: ExportOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const args = [
      '-exportArchive',
      '-archivePath', options.ArchivePath,
      '-exportPath', options.ExportPath,
      '-exportOptionsPlist', options.ExportOptionsPlist
    ]

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

/**
 * Archive a project.
 * @param options The options for the archive.
 * @returns {Promise<SpawnResult>} The result of the archive.
 */
export async function exportArchive(options: ExportOptions): Promise<SpawnResult> {
  const exportPlistPath = path.join(os.tmpdir(), 'exportOptions.plist')
  options.ExportOptionsPlist = exportPlistPath
  // if options.ExportPath is not set, use a default
  if (!options.ExportPath) {
    options.ExportPath = path.join(os.tmpdir(), 'export')
    fs.mkdirSync(options.ExportPath, { recursive: true })
  }
  fs.mkdirSync(path.dirname(exportPlistPath), { recursive: true })
  fs.writeFileSync(exportPlistPath, generateExportPlist(options.ExportMethod))
  const args = await argumentsBuilder(options)
  return spawn('xcodebuild', args)
}

function generateExportPlist(exportType: string): string {
  let data = {
    method: exportType,
    destination: 'export',
  }

  return plist.build(data)
}
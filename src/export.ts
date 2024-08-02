import { SpawnResult, spawn } from './spawn'
import { AppStoreConnectApiConfig } from './asc'

import * as core from '@actions/core'
import plist from 'plist'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export type ExportOptions = {
  ArchivePath: string
  ExportPath: string
  ExportOptionsPlist: string
  ExportMethod: string
  AllowProvisioningUpdates: boolean
  AllowProvisioningDeviceRegistration: boolean
  AppStoreConnectApiConfig: AppStoreConnectApiConfig
}

function argumentsBuilder(options: ExportOptions): string[] {
  const args = [
    '-exportArchive',
    '-archivePath',
    options.ArchivePath,
    '-exportPath',
    options.ExportPath,
    '-exportOptionsPlist',
    options.ExportOptionsPlist
  ]

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

/**
 * Archive a project.
 * @param options The options for the archive.
 * @returns {Promise<SpawnResult>} The result of the archive.
 */
export async function exportArchive(
  options: ExportOptions
): Promise<SpawnResult> {
  const exportPlistPath = path.join(os.tmpdir(), 'exportOptions.plist')
  options.ExportOptionsPlist = exportPlistPath
  // if options.ExportPath is not set, use a default
  if (!options.ExportPath) {
    options.ExportPath = path.join(os.tmpdir(), 'export')
    fs.mkdirSync(options.ExportPath, { recursive: true })
  }
  core.setOutput('export-path', options.ExportPath)

  fs.mkdirSync(path.dirname(exportPlistPath), { recursive: true })
  fs.writeFileSync(exportPlistPath, generateExportPlist(options.ExportMethod))
  const args = argumentsBuilder(options)
  return spawn('xcodebuild', args)
}

function generateExportPlist(exportType: string): string {
  const data = {
    method: exportType,
    destination: 'export'
  }

  return plist.build(data)
}

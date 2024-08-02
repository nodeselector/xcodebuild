import * as core from '@actions/core'
import { archive, ArchiveOptions } from './archive'
import { exportArchive, ExportOptions } from './export'
import { uploadApp, UploadOptions } from './uploadApp'
import { loadAppStoreConnectApiConfig } from './asc'
import { SpawnResult } from './spawn'

/**
 * Logs the result of a command and groups the output.
 * @param {string} groupName - The name of the group.
 * @param {any} result - The result object containing command details.
 */
function logResult(groupName: string, result: SpawnResult): void {
  core.startGroup(groupName)
  core.info(`Command: ${result.Command}`)
  core.info(`Arguments: ${result.Args.join(' ')}`)
  core.info(`Code: ${result.Code}`)
  core.info(`Stdout: ${result.Stdout}`)
  core.info(`Stderr: ${result.Stderr}`)
  core.endGroup()
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    if (process.platform !== 'darwin') {
      throw new Error('This action is only supported on macOS')
    }

    const ascConfig = await loadAppStoreConnectApiConfig()
    const action = core.getInput('action')

    switch (action) {
      case 'archive': {
        const options: ArchiveOptions = {
          Scheme: core.getInput('scheme'),
          Workspace: core.getInput('workspace'),
          Destination: core.getInput('destination'),
          Project: core.getInput('project'),
          ArchivePath: core.getInput('archive-path'),
          AllowProvisioningUpdates: core.getBooleanInput(
            'allow-provisioning-updates'
          ),
          AllowProvisioningDeviceRegistration: core.getBooleanInput(
            'allow-device-registration'
          ),
          AppStoreConnectApiConfig: ascConfig
        }
        console.log('options', options)
        const result = await archive(options)
        logResult('xcodebuild', result)
        if (result.Code !== 0)
          throw new Error(`Archive failed with code ${result.Code}`)
        break
      }
      case 'export': {
        const options: ExportOptions = {
          ArchivePath: core.getInput('archive-path'),
          ExportPath: core.getInput('export-path'),
          ExportOptionsPlist: core.getInput('export-options-plist'),
          ExportMethod: core.getInput('export-method'),
          AllowProvisioningUpdates: core.getBooleanInput(
            'allow-provisioning-updates'
          ),
          AllowProvisioningDeviceRegistration: core.getBooleanInput(
            'allow-device-registration'
          ),
          AppStoreConnectApiConfig: ascConfig
        }
        console.log('options', options)
        const result = await exportArchive(options)
        logResult('xcodebuild', result)
        if (result.Code !== 0)
          throw new Error(`Export failed with code ${result.Code}`)
        break
      }
      case 'upload': {
        const options: UploadOptions = {
          Type: core.getInput('upload-type'),
          ExportPath: core.getInput('export-path'),
          ProductName: core.getInput('product-name'),
          AppStoreConnectApiConfig: ascConfig
        }
        console.log('options', options)
        const result = await uploadApp(options)
        logResult('xcrun altool', result)
        if (result.Code !== 0)
          throw new Error(`Upload failed with code ${result.Code}`)
        break
      }
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

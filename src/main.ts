import * as core from '@actions/core'
import { archive } from './archive'
import { exportArchive } from './export'
import { uploadApp } from './uploadApp'

/**
 * Logs the result of a command and groups the output.
 * @param {string} groupName - The name of the group.
 * @param {any} result - The result object containing command details.
 */
function logResult(groupName: string, result: any): void {
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
    const action = core.getInput('action')
    let options: any
    let result: any

    switch (action) {
      case 'archive':
        options = {
          Scheme: core.getInput('scheme'),
          Workspace: core.getInput('workspace'),
          Destination: core.getInput('destination'),
          Project: core.getInput('project'),
          ArchivePath: core.getInput('archive-path'),
          AllowProvisioningUpdates: core.getBooleanInput('allow-provisioning-updates'),
          AllowProvisioningDeviceRegistration: core.getBooleanInput('allow-device-registration'),
          AppStoreConnectAPIKey: core.getInput('app-store-connect-api-key-key-path'),
          AppStoreConnectAPIIssuer: core.getInput('app-store-connect-api-key-issuer-id'),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-key-id')
        }
        console.log('options', options)
        result = await archive(options)
        if (result.Code !== 0) throw new Error(`Archive failed with code ${result.Code}`)
        logResult('xcodebuild', result)
        break

      case 'export':
        options = {
          ArchivePath: core.getInput('archive-path'),
          ExportPath: core.getInput('export-path'),
          ExportOptionsPlist: core.getInput('export-options-plist'),
          ExportMethod: core.getInput('export-method'),
          AllowProvisioningUpdates: core.getBooleanInput('allow-provisioning-updates'),
          AllowProvisioningDeviceRegistration: core.getBooleanInput('allow-device-registration'),
          AppStoreConnectAPIKey: core.getInput('app-store-connect-api-key-key-path'),
          AppStoreConnectAPIIssuer: core.getInput('app-store-connect-api-key-issuer-id'),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-key-id')
        }
        console.log('options', options)
        result = await exportArchive(options)
        if (result.Code !== 0) throw new Error(`Export failed with code ${result.Code}`)
        logResult('xcodebuild', result)
        break

      case 'upload':
        options = {
          Type: core.getInput('upload-type'),
          ExportPath: core.getInput('export-path'),
          ProductName: core.getInput('product-name'),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-key-id'),
          AppStoreConnectAPIIssuer: core.getInput('app-store-connect-api-key-issuer-id')
        }
        console.log('options', options)
        result = await uploadApp(options)
        if (result.Code !== 0) throw new Error(`Upload failed with code ${result.Code}`)
        logResult('xcrun altool', result)
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
import * as core from '@actions/core'
import { archive } from './archive'
import { exportArchive } from './export'
import { uploadApp } from './uploadApp'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    switch (core.getInput('action')) {
      case 'archive': {
        const options = {
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
          AppStoreConnectAPIKey: core.getInput('app-store-connect-api-key-key-path'),
          AppStoreConnectAPIIssuer: core.getInput(
            'app-store-connect-api-key-issuer-id'
          ),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-key-id')
        }

        console.log('options', options)
        const result = await archive(options)
        core.startGroup('xcodebuild')
        core.info(`Command: ${result.Command}`)
        core.info(`Arguments: ${result.Args.join(' ')}`)
        core.info(`Code: ${result.Code}`)
        core.info(`Stdout: ${result.Stdout}`)
        core.info(`Stderr: ${result.Stderr}`)
        core.endGroup()
        break
      }
      case 'export': {
        const options = {
          ArchivePath: core.getInput('archive-path'),
          ExportPath: core.getInput('export-path'),
          ExportOptionsPlist: core.getInput('export-options-plist'),
          ExportMethod: core.getInput('export-method'),
          AllowProvisioningUpdates: core.getBooleanInput('allow-provisioning-updates'),
          AllowProvisioningDeviceRegistration: core.getBooleanInput(
            'allow-device-registration'
          ),
          AppStoreConnectAPIKey: core.getInput('app-store-connect-api-key-key-path'),
          AppStoreConnectAPIIssuer: core.getInput(
            'app-store-connect-api-key-issuer-id'
          ),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-key-id')
        }

        console.log('options', options)
        const result = await exportArchive(options)
        core.startGroup('xcodebuild')
        core.info(`Command: ${result.Command}`)
        core.info(`Arguments: ${result.Args.join(' ')}`)
        core.info(`Code: ${result.Code}`)
        core.info(`Stdout: ${result.Stdout}`)
        core.info(`Stderr: ${result.Stderr}`)
        core.endGroup()
        break
      }
      case 'upload': {
        const options = {
          Type: core.getInput('upload-type'),
          ExportPath: core.getInput('export-path'),
          ProductName: core.getInput('product-name'),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-key-id'),
          AppStoreConnectAPIIssuer: core.getInput('app-store-connect-api-key-issuer-id')
        }
        console.log('options', options)
        const result = await uploadApp(options)
        core.startGroup('xcrun altool')
        core.info(`Command: ${result.Command}`)
        core.info(`Arguments: ${result.Args.join(' ')}`)
        core.info(`Code: ${result.Code}`)
        core.info(`Stdout: ${result.Stdout}`)
        core.info(`Stderr: ${result.Stderr}`)
        core.endGroup()
        break
      }
      default: {
        throw new Error(`Unknown action: ${core.getInput('action')}`)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

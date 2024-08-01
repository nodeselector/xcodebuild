import * as core from '@actions/core'
import { archive } from './archive'

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
          Project: core.getInput('project'),
          ArchivePath: core.getInput('archive-path'),
          AllowProvisioningUpdates: core.getBooleanInput(
            'allow-provisioning-updates'
          ),
          AllowProvisioningDeviceRegistration: core.getBooleanInput(
            'allow-device-registration'
          ),
          AppStoreConnectAPIKey: core.getInput('app-store-connect-api-key'),
          AppStoreConnectAPIIssuer: core.getInput(
            'app-store-connect-api-issuer'
          ),
          AppStoreConnectAPIKeyID: core.getInput('app-store-connect-api-key-id')
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
      default: {
        throw new Error(`Unknown action: ${core.getInput('action')}`)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

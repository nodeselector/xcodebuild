/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as archive from '../src/archive'
import * as exportArchive from '../src/export'
import * as uploadApp from '../src/uploadApp'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let archiveMock: jest.SpiedFunction<typeof archive.archive>
let getBooleanInputMock: jest.SpiedFunction<typeof core.getBooleanInput>
let exportArchiveMock: jest.SpiedFunction<typeof exportArchive.exportArchive>
let uploadAppMock: jest.SpiedFunction<typeof uploadApp.uploadApp>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(process, 'platform', { value: 'darwin' })

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getBooleanInputMock = jest
      .spyOn(core, 'getBooleanInput')
      .mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    archiveMock = jest.spyOn(archive, 'archive').mockImplementation()
    exportArchiveMock = jest
      .spyOn(exportArchive, 'exportArchive')
      .mockImplementation()
    uploadAppMock = jest.spyOn(uploadApp, 'uploadApp').mockImplementation()
  })

  it('does not run on linux', async () => {
    Object.defineProperty(process, 'platform', { value: 'linux' })
    await main.run()
    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      'This action is only supported on macOS'
    )
  })

  it('runs on darwin', async () => {
    await main.run()
    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith('Unknown action: undefined')
  })

  it('calls archive for archive action', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'action':
          return 'archive'
        case 'scheme':
          return 'MyScheme'
        case 'workspace':
          return 'MyWorkspace'
        case 'destination':
          return 'MyDestination'
        case 'project':
          return 'MyProject'
        case 'archive-path':
          return 'MyArchivePath'
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'allow-provisioning-updates':
          return true
        case 'allow-device-registration':
          return true
        default:
          return false
      }
    })
    archiveMock.mockResolvedValue({
      Code: 0,
      Stdout: '',
      Stderr: '',
      Command: 'xcodebuild',
      Args: []
    })
    await main.run()
    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(archiveMock).toHaveBeenCalledWith({
      Scheme: 'MyScheme',
      Workspace: 'MyWorkspace',
      Destination: 'MyDestination',
      Project: 'MyProject',
      ArchivePath: 'MyArchivePath',
      AllowProvisioningUpdates: true,
      AllowProvisioningDeviceRegistration: true,
      AppStoreConnectApiConfig: {
        KeyId: '',
        IssuerId: '',
        KeyPath: ''
      }
    })
  })

  it('calls export for export action', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'action':
          return 'export'
        case 'archive-path':
          return 'MyArchivePath'
        case 'export-path':
          return 'MyExportPath'
        case 'export-options-plist':
          return 'MyExportOptionsPlist'
        case 'export-method':
          return 'MyExportMethod'
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'allow-provisioning-updates':
          return true
        case 'allow-device-registration':
          return true
        default:
          return false
      }
    })
    exportArchiveMock.mockResolvedValue({
      Code: 0,
      Stdout: '',
      Stderr: '',
      Command: 'xcodebuild',
      Args: []
    })
    await main.run()
    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(exportArchiveMock).toHaveBeenCalledWith({
      ArchivePath: 'MyArchivePath',
      ExportPath: 'MyExportPath',
      ExportOptionsPlist: 'MyExportOptionsPlist',
      ExportMethod: 'MyExportMethod',
      AllowProvisioningUpdates: true,
      AllowProvisioningDeviceRegistration: true,
      AppStoreConnectApiConfig: {
        KeyId: '',
        IssuerId: '',
        KeyPath: ''
      }
    })
  })

  it('calls uploadApp from uploadApp action', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'action':
          return 'upload'
        case 'upload-type':
          return 'MyType'
        case 'export-path':
          return 'MyExportPath'
        case 'product-name':
          return 'MyProductName'
        default:
          return ''
      }
    })
    uploadAppMock.mockResolvedValue({
      Code: 0,
      Stdout: '',
      Stderr: '',
      Command: 'xcrun',
      Args: []
    })
    await main.run()
    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(uploadAppMock).toHaveBeenCalledWith({
      Type: 'MyType',
      ExportPath: 'MyExportPath',
      ProductName: 'MyProductName',
      AppStoreConnectApiConfig: {
        KeyId: '',
        IssuerId: '',
        KeyPath: ''
      }
    })
  })
})

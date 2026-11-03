import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

function generateEndpoint(channel: string) {
  return (...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

function generateCommand(channel: string) {
  return (...args: any[]) => ipcRenderer.send(channel, ...args)
}

function generateCallback(channel: string) {
  return (callback: (values: any) => void) => {
    const func = (_event: Electron.IpcRendererEvent, values: any) => callback(values)
    ipcRenderer.on(channel, func)

    return () => {
      ipcRenderer.removeListener(channel, func)
    }
  }
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)

  contextBridge.exposeInMainWorld('kanbanApi', {
    sync: generateEndpoint('kanban/sync'),
    get: generateEndpoint('kanban/get'),
    getChanges: generateEndpoint('kanban/get-changes')
  })

  contextBridge.exposeInMainWorld('attachmentApi', {
    createLink: generateEndpoint('attachment/createLink'),
    createFiles: generateEndpoint('attachment/createFiles'),
    getForTask: generateEndpoint('attachment/getForTask'),

    openFile: generateCommand('attachment/openFile'),
    openFileLocation: generateCommand('attachment/openFileLocation'),
    edit: generateEndpoint('attachment/edit'),
    delete: generateEndpoint('attachment/delete')
  })
} catch (error) {
  console.error(error)
}

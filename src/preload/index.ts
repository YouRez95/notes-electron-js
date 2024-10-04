import { CreateNotes, DeleteNotes, GetNotes, ReadNotes, WriteNotes } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNotes: (...args: Parameters<ReadNotes>) => ipcRenderer.invoke('readNotes', ...args),
    writeNotes: (...args: Parameters<WriteNotes>) => ipcRenderer.invoke('writeNotes', ...args),
    createNotes: (...args: Parameters<CreateNotes>) => ipcRenderer.invoke('createNotes', ...args),
    deleteNotes: (...args: Parameters<DeleteNotes>) => ipcRenderer.invoke('deleteNotes', ...args)
  })
} catch (error) {
  console.log(error)
}

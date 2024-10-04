import { APP_DIRECTORY_NAME, FILE_ENCODING, WELCOME_NOTE } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNotes, DeleteNotes, GetNotes, ReadNotes, WriteNotes } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}/${APP_DIRECTORY_NAME}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileName = await readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const notes = notesFileName.filter((filename) => filename.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('Creating welcome note')

    const content = await readFile(welcomeNoteFile, { encoding: FILE_ENCODING })
    await writeFile(`${rootDir}/${WELCOME_NOTE}`, content, { encoding: FILE_ENCODING })

    notes.push(WELCOME_NOTE)
  }

  return Promise.all(notes.map(getNotesInfoFromFilename))
}

export const getNotesInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStat = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStat.mtimeMs
  }
}

export const readNotes: ReadNotes = async (filename) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${filename}.md`, { encoding: FILE_ENCODING })
}

export const writeNotes: WriteNotes = async (title, content) => {
  const rootDir = getRootDir()
  return writeFile(`${rootDir}/${title}.md`, content, { encoding: FILE_ENCODING })
}

export const createNotes: CreateNotes = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'New Note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'MarkDown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('operation creation file canceled')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)
  if (rootDir !== parentDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be created under ${rootDir}, avoid using other directories`
    })

    return false
  }

  console.info('Creating note', filePath)
  await writeFile(filePath, '')

  return filename
}

export const deleteNotes: DeleteNotes = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete ${filename}`,
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Deletion file canceled')
    return false
  }

  console.info('Deletion note', filename)
  await remove(`${rootDir}/${filename}.md`)
  return true
}

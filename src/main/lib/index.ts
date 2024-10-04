import { APP_DIRECTORY_NAME, FILE_ENCODING } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { GetNotes, ReadNotes, WriteNotes } from '@shared/types'
import { ensureDir, readFile, readdir, stat, writeFile } from 'fs-extra'
import { homedir } from 'os'

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

import { NoteContent, NoteInfo } from './models'

export type GetNotes = () => Promise<NoteInfo[]>
export type ReadNotes = (title: NoteInfo['title']) => Promise<NoteContent>
export type WriteNotes = (title: NoteInfo['title'], content: NoteContent) => Promise<void>

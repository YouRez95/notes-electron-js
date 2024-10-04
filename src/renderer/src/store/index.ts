import { NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

const loadNotes = async () => {
  const notes = await window.context.getNotes()
  const sortedNotes = notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
  return sortedNotes
}

const noteAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(noteAtomAsync, (result) => result)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex == null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  return {
    ...selectedNote,
    content: `Hello from Note ${selectedNoteIndex}`
  }
})

export const createNewEmptyNote = atom(null, (get, set) => {
  const notes = get(notesAtom) || []

  const newNote: NoteInfo = {
    title: `Note ${notes.length + 1}`,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes])
  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})

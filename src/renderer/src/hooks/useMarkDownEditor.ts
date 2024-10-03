import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'

export const useMarkDownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)

  return { selectedNote }
}

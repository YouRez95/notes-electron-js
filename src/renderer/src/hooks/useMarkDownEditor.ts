import { MDXEditorMethods } from '@mdxeditor/editor'
import { saveNoteAtom, selectedNoteAtom } from '@renderer/store'
import { AUTO_SAVING_TIME } from '@shared/constants'
import { NoteContent } from '@shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import { throttle } from 'lodash'
import { useRef } from 'react'

export const useMarkDownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNotes = useSetAtom(saveNoteAtom)
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleAutoSaving = throttle(
    async (content: NoteContent) => {
      if (!selectedNote) return

      console.info('Auto saving', selectedNote.title)
      await saveNotes(content)
    },
    AUTO_SAVING_TIME,
    {
      leading: false,
      trailing: true
    }
  )

  const handleBlurSaving = async () => {
    if (!selectedNote) return

    handleAutoSaving.cancel()
    const content = editorRef.current?.getMarkdown()
    console.log('content', content)
    if (content && selectedNote.content !== content) {
      console.info('Blur saving', selectedNote.title)
      await saveNotes(content)
    }
  }

  return { selectedNote, handleAutoSaving, editorRef, handleBlurSaving }
}

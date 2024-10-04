import { NotePreview } from '@/components'
import { useNoteList } from '@/hooks/useNoteList'
import { cn } from '@renderer/utils'
import { isEmpty } from 'lodash'
import { ComponentProps } from 'react'

export type NotePreviewProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNoteList({ onSelect })

  if (!notes || isEmpty(notes)) {
    return (
      <ul className={cn('text-center pt-4', className)} {...props}>
        <span>No Notes Yet!</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>
      {notes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  )
}

import { ActionButton } from '@/components'
import { createNewEmptyNote } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { ComponentProps } from 'react'
import { LuFileSignature } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ComponentProps<'button'>) => {
  const createEmptyNote = useSetAtom(createNewEmptyNote)

  const handleCreationNote = () => {
    createEmptyNote()
  }

  return (
    <ActionButton onClick={handleCreationNote} {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

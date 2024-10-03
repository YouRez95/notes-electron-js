import { ActionButton } from '@/components'
import { ComponentProps } from 'react'
import { LuFileSignature } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ComponentProps<'button'>) => {
  return (
    <ActionButton {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

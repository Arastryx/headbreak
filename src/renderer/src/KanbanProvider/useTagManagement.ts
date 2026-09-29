import { arrayMoveMutable } from 'array-move'
import { useCallback } from 'react'
import { v4 } from 'uuid'
import { KanbanModifier, TagPayload } from './useKanbanManagement'
import dayjs from 'dayjs'

function findTagIndex(copy: Headbreak.Tag[], id: string) {
  const targetIndex = copy?.findIndex((c) => c.id === id)

  if (targetIndex == -1) {
    throw new Error(`Tried to edit non-existent tag ${id}`)
  }

  return targetIndex
}

function findTag(copy: Headbreak.Tag[], id: string) {
  return copy[findTagIndex(copy, id)]
}

export function useTagManagement(modify: KanbanModifier) {
  const createTag = useCallback(() => {
    const tag: Headbreak.Tag = {
      id: v4(),
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString()
    }

    modify((copy) => {
      copy.tags.push(tag)
    })

    return tag
  }, [modify])

  const editTag = useCallback(
    (id: string, payload: Partial<TagPayload>) => {
      modify((copy) => {
        const targetIndex = findTagIndex(copy.tags, id)
        copy.tags[targetIndex] = { ...copy.tags[targetIndex], ...payload }
      })
    },
    [modify]
  )

  const deleteTag = useCallback(
    (id: string) => {
      modify((copy) => {
        const targetTag = findTag(copy.tags, id)
        targetTag.markForDeletion = true
      })
    },
    [modify]
  )

  return { createTag, editTag, deleteTag }
}

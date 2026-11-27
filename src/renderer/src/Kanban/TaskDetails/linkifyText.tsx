import { Chip } from '@mui/material'
import { TaskLink } from '@renderer/Common/Components/TaskLink'

export function linkifyText(phrase: string) {
  const linkRegex = /(@[0-9]+)/
  const split = phrase.split(linkRegex)

  const result = split.map((s) => {
    if (linkRegex.test(s)) {
      const number = Number(s.slice(1))
      return <TaskLink number={number} />
    }

    return s
  })

  return result
}

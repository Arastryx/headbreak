import { Chip, ChipProps } from '@mui/material'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { Micon } from './Micon'

export interface TagChipProps extends Omit<ChipProps, 'label' | 'icon'> {
  tag: Headbreak.Tag | string
}

export function TagChip({ tag: tagOrId, sx, ...tagProps }: TagChipProps) {
  const { tags } = useKanban()

  const tag = typeof tagOrId === 'string' ? tags?.find((t) => t.id === tagOrId) : tagOrId

  if (!tag) {
    throw new Error('Could not find tag with given ID')
  }

  return (
    <Chip
      label={tag.label}
      icon={<Micon icon={tag.icon ?? 'circle'} color="inherit" />}
      {...tagProps}
      sx={[
        tagProps.variant === 'filled'
          ? (theme) => ({
              bgcolor: tag.color,
              color: theme.palette.getContrastText(tag.color ?? '#000')
            })
          : {
              borderColor: tag.color,
              color: tag.color
            },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    />
  )
}

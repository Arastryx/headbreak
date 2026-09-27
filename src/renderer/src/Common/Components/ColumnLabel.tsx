import { TypographyProps, Typography } from '@mui/material'
import { Micon } from './Micon'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'

export interface ColumnLabelProps extends Omit<TypographyProps, 'children'> {
  column: Headbreak.LogColumn | string
}

export function ColumnLabel({ column, ...props }: ColumnLabelProps) {
  const { kanban } = useKanban()
  const target = typeof column === 'string' ? kanban?.find((c) => c.id == column) : column

  if (!target) {
    return (
      <Typography component="span" {...props} sx={{ ...props.sx }}>
        [UKNOWN COLUMN]
      </Typography>
    )
  }

  return (
    <Typography component="span" {...props} sx={{ color: target.color, ...props.sx }}>
      {target.label ?? 'Unnamed'}{' '}
      <Micon fontSize="inherit" icon={target.icon ?? 'loop'} sx={{ verticalAlign: 'middle' }} />
    </Typography>
  )
}

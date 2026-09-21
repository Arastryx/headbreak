import { TypographyProps, Typography } from '@mui/material'
import { Micon } from './Micon'

export interface ColumnLabelProps extends Omit<TypographyProps, 'children'> {
  column: Headbreak.LogColumn
}

export function ColumnLabel({ column, ...props }: ColumnLabelProps) {
  return (
    <Typography component="span" {...props} sx={{ color: column.color, ...props.sx }}>
      {column.label ?? 'Unnamed'}{' '}
      <Micon fontSize="inherit" icon={column.icon ?? 'loop'} sx={{ verticalAlign: 'middle' }} />
    </Typography>
  )
}

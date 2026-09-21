import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useEffect, useState } from 'react'

type Decision = 'move' | 'delete'

export interface DeleteColumnDialogProps extends Omit<DialogProps, 'onClose'> {
  onClose: () => void
  columnId: string
}

export function DeleteColumnDialog({ columnId, onClose, ...props }: DeleteColumnDialogProps) {
  const { kanban, deleteColumn } = useKanban()
  const [decision, setDecision] = useState<Decision>('move')
  const [targetColumnId, setTargetColumnId] = useState<string>('')

  useEffect(() => {
    if (decision == 'move') {
      setTargetColumnId('')
    }
  }, [decision])

  const renderOption = (c: Headbreak.Column) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: c.color }}>
      <Micon icon={c.icon ?? 'loop'} />
      <Typography> {c.label}</Typography>
    </Stack>
  )

  return (
    <Dialog {...props}>
      <DialogTitle>Delete Column</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          This column has existing tasks. Should those tasks be moved or deleted as well?
        </Typography>
        <RadioGroup
          value={decision}
          onChange={(e) => setDecision(e.currentTarget.value as Decision)}
          row
        >
          <FormControlLabel value="delete" control={<Radio />} label="Delete tasks" />
          <FormControlLabel value="move" control={<Radio />} label="Move to another column" />
        </RadioGroup>
        <Collapse in={decision == 'move'}>
          <TextField
            placeholder="Target Column"
            select
            size="small"
            value={targetColumnId}
            onChange={(e) => setTargetColumnId(e.target.value)}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  const target = kanban?.find((c) => c.id === value)

                  if (!target) {
                    return <Typography color="textSecotendary">Selected Column</Typography>
                  }
                  return renderOption(target)
                }
              }
            }}
            sx={{ mt: 1 }}
            fullWidth
          >
            {kanban?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {renderOption(c)}
              </MenuItem>
            ))}
          </TextField>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Micon icon="delete" />}
          color="error"
          variant="contained"
          disabled={decision === 'move' && targetColumnId == ''}
          onClick={() => {
            if (decision == 'delete') {
              deleteColumn(columnId)
            } else {
              deleteColumn(columnId, targetColumnId)
            }

            onClose()
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

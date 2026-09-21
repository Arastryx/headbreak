import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography
} from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useEffect, useState } from 'react'
import { Decision, TaskDecision } from './TaskDecision'

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

  const otherColumns = kanban?.filter((c) => c.id != columnId) ?? []

  return (
    <Dialog onClose={onClose} {...props}>
      <DialogTitle>Delete Column</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          This column has existing tasks.{' '}
          {otherColumns.length >= 1
            ? 'Should those tasks be moved or deleted as well?'
            : 'If you delete this column, all associated tasks will be deleted as well'}
        </Typography>
        {otherColumns.length >= 1 && (
          <TaskDecision
            otherColumns={otherColumns}
            decision={decision}
            targetColumnId={targetColumnId}
            onChange={(d, id) => {
              setDecision(d)
              setTargetColumnId(id)
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Micon icon="delete" />}
          color="error"
          variant="contained"
          disabled={decision === 'move' && targetColumnId == '' && otherColumns.length > 0}
          onClick={() => {
            if (decision == 'delete' || otherColumns.length == 0) {
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

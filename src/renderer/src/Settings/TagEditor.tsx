import { Stack, TextField, Box, IconButton, Paper } from '@mui/material'
import { ColorPicker } from '@renderer/Common/Components/ColorPicker'
import { IconSelector } from '@renderer/Common/Components/IconSelector'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { Micon } from '@renderer/Common/Components/Micon'

export interface TagEditorProps {
  tag: Headbreak.Tag
}

export function TagEditor({ tag }: TagEditorProps) {
  const { editTag, deleteTag } = useKanban()

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              borderColor: tag.color ?? '#000',
              borderRadius: 5,
              borderWidth: 1,
              borderStyle: 'solid'
            }}
          >
            <Stack spacing={0.5} sx={{ px: 0.5, py: 0.5, alignItems: 'center' }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Tag Name"
                value={tag.label}
                autoFocus
                onChange={(e) => editTag(tag.id, { ...tag, label: e.currentTarget.value })}

                sx={{
                  width: tag.label == null || tag.label == '' ? 90 : tag.label.length * 5.5 + 38
                }}
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: 4,
                      bgcolor: 'rgb(255 255 255 / 50%)',
                      fontSize: 12,
                      height: '1.7em'
                    }
                  }
                }}
              />
            </Stack>
          </Paper>

          <Stack direction="row" useFlexGap sx={{ alignItems: 'center' }}>
            <Box sx={{ ml: 1, mr: 1 }}>
              <ColorPicker
                color={tag.color ?? '#000'}
                onChange={(c) => editTag(tag.id, { color: c })}
              />
            </Box>
            <IconSelector
              icon={tag.icon}
              color={tag.color}
              clearable
              onSelect={(icon) => editTag(tag.id, { icon })}
            />
            <IconButton color="error" onClick={() => deleteTag(tag.id)} sx={{ ml: 3 }}>
              <Micon icon="delete" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

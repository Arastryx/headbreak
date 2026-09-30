import { useKanban } from '../KanbanProvider/KanbanProvider'
import { Box, Button, Container, Grid, Icon, Stack, Typography } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { ColumnEditor } from './ColumnEditor'
import { Micon } from '@renderer/Common/Components/Micon'
import { TagEditor } from './TagEditor'

export interface SettingsProps {}

export function Settings({}: SettingsProps) {
  const { kanban, tags, createColumn, reorderColumn, createTag } = useKanban()

  return (
    <Container>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Columns
          </Typography>
          <DragDropProvider
            onDragOver={({ operation: e }) => {
              if (e.source?.id && e.target?.id && e.source.id != e.target.id) {
                reorderColumn(e.source.id as string, e.target.id as string)
              }
            }}
          >
            <Stack spacing={1}>
              {kanban
                ?.filter((c) => !c.markForDeletion)
                .map((c, index) => (
                  <ColumnEditor key={c.id} column={c} index={index} />
                ))}
              <Button onClick={createColumn}>
                <Micon icon="add" />
              </Button>
            </Stack>
          </DragDropProvider>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Tags
          </Typography>

          <Grid container spacing={2}>
            {tags
              ?.filter((c) => !c.markForDeletion)
              .map((c) => (
                <Grid>
                  <TagEditor key={c.id} tag={c} />
                </Grid>
              ))}
            <Grid>
              <Button onClick={createTag}>
                <Micon icon="add" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  )
}

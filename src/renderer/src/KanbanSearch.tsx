import { TextField, Stack, IconButton, Popover, Box } from '@mui/material'
import { useRef, useState } from 'react'
import { Micon } from './Common/Components/Micon'
import { TagChip } from './Common/Components/TagChip'
import { TagMultiSelect } from './Common/Components/TagMultiSelect'
import { TaskFilters } from './Kanban/filterTasks'

export interface KanbanSearchProps {
  filters: TaskFilters
  onChange: (filter: TaskFilters) => void
}

export function KanbanSearch({ filters, onChange }: KanbanSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <TextField
        placeholder="Search"
        size="small"
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.currentTarget.value })}
        slotProps={{
          input: {
            startAdornment: <Micon icon="search" color={'action'} />,
            endAdornment: (
              <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
                {filters.search && (
                  <IconButton size="small" onClick={() => onChange({ ...filters, search: '' })}>
                    <Micon icon="clear" />
                  </IconButton>
                )}
                {filters.tags?.map((t) => (
                  <TagChip
                    tag={t}
                    key={t}
                    size="small"
                    onDelete={() =>
                      onChange({
                        ...filters,
                        tags: filters.tags?.filter((current) => current != t)
                      })
                    }
                  />
                ))}
                <IconButton size="small" onClick={() => setShowFilters(true)} ref={filterButtonRef}>
                  <Micon icon="filter_alt" />
                </IconButton>
              </Stack>
            )
          }
        }}
        sx={{ flex: 1 }}
      />
      <Popover
        open={showFilters}
        onClose={() => setShowFilters(false)}
        anchorEl={filterButtonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{ vertical: -8, horizontal: 'right' }}
      >
        <Box sx={{ p: 1 }}>
          <TagMultiSelect
            value={filters.tags ?? []}
            onChange={(value) => onChange({ ...filters, tags: value })}
            sx={{ minWidth: 140, maxWidth: 300 }}
          />
        </Box>
      </Popover>
    </>
  )
}

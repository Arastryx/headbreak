export interface TaskFilters {
  search?: string
  tags?: string[]
}

export function fitsFilters(task: Headbreak.Task, filters?: TaskFilters) {
  if (filters?.search) {
    const terms = filters.search.split(' ').map((t) => t.toLowerCase())

    //If not every term is found in a given task
    if (
      !terms.every(
        (t) => task.title.toLowerCase().includes(t) || task.description?.toLowerCase().includes(t)
      )
    ) {
      return false
    }
  }

  if (filters?.tags) {
    if (!filters.tags.every((tag) => task.tags.includes(tag))) {
      return false
    }
  }

  return true
}

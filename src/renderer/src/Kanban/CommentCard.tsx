import { Card, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

export interface CommentCardProps {
  comment: Headbreak.Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card variant="outlined" sx={{ position: 'relative', my: 1 }}>
      <Typography sx={{ p: 1, pb: 1.5 }}>{comment.content}</Typography>

      <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, right: 2 }}>
        {dayjs.duration(dayjs(comment.createdAt).diff(dayjs()), 'milliseconds').humanize(true)}
      </Typography>
    </Card>
  )
}

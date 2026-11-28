import { Skeleton, Typography, TypographyProps } from '@mui/material'
import React from 'react'

export interface TaskNumberProps extends TypographyProps {
  number?: number
}

export function TaskNumber({ number, ...props }: TaskNumberProps) {
  return (
    <Typography
      component={'span'}
      {...props}
      sx={[{ fontWeight: 200, mr: 0.25 }, ...[props.sx ?? {}].flat()]}
    >
      #
      {number == null || number <= 0 ? (
        <Skeleton
          width={15}
          sx={{
            display: 'inline-block',
            ml: 0.25,
            verticalAlign: 'text-bottom',
            mb: -0.15
          }}
        />
      ) : (
        number
      )}
    </Typography>
  )
}

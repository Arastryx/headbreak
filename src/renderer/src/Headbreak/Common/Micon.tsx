import { Icon, IconProps } from '@mui/material'
import { MaterialIcon } from 'material-icons'
import React from 'react'

export interface MiconProps extends IconProps {
  icon: MaterialIcon
}

export function Micon({ icon, ...props }: MiconProps) {
  return <Icon {...props}>{icon}</Icon>
}

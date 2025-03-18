import { type PropsWithChildren, memo } from 'react'

import Typography from '@mui/material/Typography'

export type SubtitleProps = PropsWithChildren

export const Subtitle = memo((props: SubtitleProps) => {
  return (
    <Typography component="h3" variant="subtitle1" color="primary" gutterBottom>
      {props.children}
    </Typography>
  )
})

Subtitle.displayName = 'Subtitle'

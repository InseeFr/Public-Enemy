import { PropsWithChildren, memo } from 'react'

import Typography from '@mui/material/Typography'

export type TitleProps = PropsWithChildren

export const Title = memo((props: TitleProps) => {
  return (
    <Typography component="h2" variant="h5" color="primary" gutterBottom>
      {props.children}
    </Typography>
  )
})

Title.displayName = 'Title'

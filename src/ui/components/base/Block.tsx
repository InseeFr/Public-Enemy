import { type PropsWithChildren, memo } from 'react'

import { Paper } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

export type BlocProps = PropsWithChildren<{
  className?: string
}>

/**
 * Block component
 */
export const Block = memo((props: BlocProps) => {
  const { cx, classes } = useStyles()
  const { children, className } = props

  return <Paper className={cx(classes.block, className)}>{children}</Paper>
})

const useStyles = makeStyles()((theme) => ({
  block: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}))

Block.displayName = 'Block'

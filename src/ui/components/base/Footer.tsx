import { memo } from 'react'

import { AppBar } from '@mui/material'
import Typography from '@mui/material/Typography'
import { makeStyles } from 'tss-react/mui'

export const Footer = memo(() => {
  const { classes } = useStyles()
  return (
    <AppBar component="footer" position="fixed" className={classes.root}>
      <Typography variant="body2" align="center"></Typography>
    </AppBar>
  )
})

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    top: 'auto',
    bottom: '0',
    padding: '3px',
    zIndex: theme.zIndex.drawer + 1,
    height: '32px',
  },
}))

Footer.displayName = 'Footer'

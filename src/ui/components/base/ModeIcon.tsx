import { memo } from 'react'

import CallIcon from '@mui/icons-material/Call'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import WebIcon from '@mui/icons-material/Web'
import { Chip } from '@mui/material'
import { Mode } from 'core/application/model'
import { makeStyles } from 'tss-react/mui'

type ModeIconProps = {
  mode: Mode
}

export const ModeIcon = memo(({ mode }: ModeIconProps) => {
  const { classes } = useStyles()
  const getModeIcon = (mode: Mode): JSX.Element => {
    switch (mode.name) {
      case 'CAPI':
        return <SupervisedUserCircleIcon />
      case 'PAPI':
        return <PictureAsPdfIcon />
      case 'CAWI':
        return <WebIcon />
      case 'CATI':
        return <CallIcon />
      default:
        return <WebIcon />
    }
  }

  return (
    <Chip
      icon={getModeIcon(mode)}
      label={mode.name}
      className={classes.btnMode}
    />
  )
})

const useStyles = makeStyles()((theme) => ({
  imgMode: { backgroundColor: 'green' },
  btnMode: {
    cursor: 'pointer',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#CCCCCC',
    },
  },
}))

ModeIcon.displayName = 'ModeIcon'

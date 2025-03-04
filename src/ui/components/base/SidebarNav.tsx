import { memo } from 'react'

import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import { useIntl } from 'react-intl'
import { makeStyles } from 'tss-react/mui'
import { NavMenu } from 'ui/root/routes'

import { ListItemLink } from '.'

export type SidebarNavProps = {
  open: boolean
  toggleDrawer: () => void
}

export const SidebarNav = memo((props: SidebarNavProps) => {
  const drawerWidth = 270
  const { open } = props
  const intl = useIntl()
  const { classes, cx } = useStyles({ drawerWidth: drawerWidth })

  return (
    <Drawer
      className={cx(classes.root, { [classes.miniDrawer]: !open })}
      variant="permanent"
      open={open}
    >
      <Toolbar />
      <List component="nav">
        {NavMenu.map((item) => (
          <ListItemLink
            key={item.label}
            to={item.pathname}
            primary={intl.formatMessage({ id: item.label })}
            Icon={item.icon}
          />
        ))}
      </List>
    </Drawer>
  )
})

const useStyles = makeStyles<{ drawerWidth: number }>()(
  (theme, { drawerWidth }) => ({
    root: {
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
      },
    },
    miniDrawer: {
      '& .MuiDrawer-paper': {
        overflow: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(6),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      },
    },
  }),
)

SidebarNav.displayName = 'SidebarNav'

import { memo } from 'react'

import type { SvgIconComponent } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

export type ListItemLinkProps = {
  Icon: SvgIconComponent
  to: string
  primary: string
}

/**
 * Component used in global menu to display each route item
 */
export const ListItemLink = memo((props: ListItemLinkProps) => {
  const { to, primary, Icon } = props
  const location = useLocation()
  const { classes } = useStyles()

  return (
    <ListItem
      button
      component={Link}
      to={to}
      selected={to === location.pathname}
    >
      <ListItemIcon className={classes.itemIcon}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  )
})

const useStyles = makeStyles()(() => ({
  itemIcon: {
    paddingLeft: '5px',
  },
}))

ListItemLink.displayName = 'ListItemLink'

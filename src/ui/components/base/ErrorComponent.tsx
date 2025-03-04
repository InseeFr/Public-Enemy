import { memo } from 'react'

import Typography from '@mui/material/Typography'

import { Title } from '.'

export const ErrorComponent = memo(() => {
  return (
    <>
      <Title>Erreur</Title>
      <Typography component="p">Une erreur est survenue !!!</Typography>
    </>
  )
})

ErrorComponent.displayName = 'ErrorComponent'

import { Typography } from '@mui/material'
import React from 'react'

function PageTitle({ title }) {
  return (
    <Typography variant='h5' component='h5'>
        { title }
    </Typography>
  )
}

export default PageTitle
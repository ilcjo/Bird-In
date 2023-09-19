import * as React from 'react'
import { Grid, useTheme } from '@mui/material';
import { Header } from '../../components/Header';
import { IndexD } from '../../components/Dashboard/IndexD';

export const Dashboard = () => {

  const theme = useTheme()

  return (
    <React.Fragment>
      <Header />
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          padding: '30px',
          backgroundColor: theme.palette.secondary.light,
          minHeight: '100vh',
          marginBottom: '20px',
        }}
      >
        <IndexD />

      </Grid>

    </React.Fragment>
  )
}

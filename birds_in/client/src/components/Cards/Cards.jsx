import * as React from 'react'
import { Card, CardActions, CardMedia, IconButton, Typography } from '@mui/material'
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

export const Cards = ({ foto, name, index }) => {
  return (                                                                                                                
      <Card sx={{ maxWidth: 415, minWidth: 415, maxheigth: 399,  minheigth: 399  }}>

         <CardMedia
          component="img"
          height="194"
          image={foto}
          alt={name}
        />

        <CardActions disableSpacing>
          <Typography>
            {name}
          </Typography>
          <IconButton aria-label="add to favorites">
            <TurnedInNotIcon />
          </IconButton>
        </CardActions>

      </Card >
  
  )
}

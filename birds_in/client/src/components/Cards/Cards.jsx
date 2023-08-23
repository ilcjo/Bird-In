import { Card, CardActions, CardMedia, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import * as React from 'react'

export const Cards = ({ foto , name, index}) => {
  return (                                                                                                                
      <Card sx={{ maxWidth: 415, minWidth: 415, maxheigth: 399,  minheigth: 399  }}>

        <CardMedia
          component="img"
          height="194"
          image={foto}
          alt={name}
        />

        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
        </CardActions>

      </Card>
  
  )
}

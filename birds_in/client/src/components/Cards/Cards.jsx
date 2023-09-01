import * as React from 'react'
import { Card, CardActions, CardMedia, IconButton, Typography } from '@mui/material'
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import image from '../../assets/images/birdExample.jpg'

export const Cards = ({ foto, name, index }) => {

  const [isFavorited, setIsFavorited] = React.useState(false);

  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev);
  };
  return (

    <Card sx={{ maxWidth: 415, minWidth: 415, maxheigth: 399, minheigth: 399 }}>

      <CardMedia
        component="img"
        height="194"
        image={image}
        alt={name}
        key={index}
      />

      <CardActions disableSpacing>
        <Typography>
          {name}
        </Typography>
        <IconButton aria-label="toggle favorite" onClick={toggleFavorite}>
          {isFavorited ? (
            <BookmarkAddedIcon color='primary' />
          ) : (
            <BookmarkAddIcon color='primary' />
          )}
        </IconButton>
        {isFavorited && (
          <IconButton aria-label="remove favorite" onMouseEnter={toggleFavorite}>
            <BookmarkRemoveIcon color='error' />
          </IconButton>
        )}
      </CardActions>

    </Card >

  )
}

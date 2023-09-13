import * as React from 'react'
import { Card, CardActionArea, CardActions, CardMedia, IconButton, Typography } from '@mui/material'
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { CarruselGallery } from '../Galeries/CarruselGallery';
import { useTheme } from '@emotion/react';


export const Cards = ({ foto, name, index }) => {
  
  const theme = useTheme()
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);

  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev);
  };


  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  return (

    <Card sx={{
      maxWidth: 'auto',
      minWidth: 415,
      maxheigth: 'auto',
      minheigth: 399,
      position: 'relative',
      borderRadius: '15px'
      // background: 'linear-gradient(rgba(137, 138, 108, 0), rgba(0, 61, 21, 0.5))',
    }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="194"
          image={foto}
          alt={name}
          key={index}
          onClick={openGallery}
          sx={{ objectFit: 'cover', }}
        />
      </CardActionArea>
      <CardActions disableSpacing >
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

      <CarruselGallery isOpen={isGalleryOpen} images={[foto]} onClose={() => setIsGalleryOpen(false)} />
    </Card >

  )
}

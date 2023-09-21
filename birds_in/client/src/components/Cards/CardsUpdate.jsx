import * as React from 'react'
import { Button, Card, CardActionArea, CardActions, CardMedia, Typography } from '@mui/material'
import { useTheme } from '@emotion/react';


export const CardsUpdate = ({ foto, name, index, onClick }) => {

  const theme = useTheme()
  const [isCardVisible, setCardVisible] = React.useState(true);

  const handleCardClick = () => {
    // Oculta la tarjeta y muestra el formulario
    setCardVisible(false);
    onClick(); // Llama a la función onClick pasada como prop
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

          sx={{ objectFit: 'cover', }}
        />
      </CardActionArea>
      <CardActions disableSpacing >
        <Typography>
          {name}
        </Typography>
        <Button onClick={handleCardClick}>Editar</Button>
      </CardActions>

    </Card >

  )
}

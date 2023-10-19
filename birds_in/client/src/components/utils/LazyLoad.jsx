import * as React from 'react'
import { Grid } from '@mui/material';

export const LazyLoad = ({ imageUrl, children}) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    React.useEffect(() => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            setImageLoaded(true);
        };
    }, [imageUrl]);

    const backgroundStyle = {
        backgroundImage: imageLoaded ? `url(${imageUrl})` : 'none',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.40)',
        // ... otros estilos de fondo
      };
    return (
        <Grid
        item
        xs={false}
        sm={3}
        md={8.5}
        sx={backgroundStyle}
      >
        {children}
      </Grid>
    )
};

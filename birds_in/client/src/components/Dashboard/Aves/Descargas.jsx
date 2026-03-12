import * as React from 'react';
import { Tabs, Tab, Box, Typography, Button, styled } from '@mui/material';
import { useDispatch } from 'react-redux';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(65, 99, 69, 0.55)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '100%',
    '& .Mui-selected': {
        backgroundColor: theme.palette.custom.light,
        background: `
  linear-gradient(
    180deg,
    rgba(242, 246, 219, 0.38) 0%,
   
  )
`,
    },
}));
const StyledTab = styled(Tab)({
    minWidth: 'auto', // Ajusta el ancho mínimo de cada pestaña
    textTransform: 'none',
    color: '#ccd6cc',
    '&.Mui-selected .MuiTypography-root': {
        color: '#C1C700',
    },

});

export const Descargas = ({ handleDownload, handleFoto }) => {
    const dispatch = useDispatch();
    const [subTab, setSubTab] = React.useState(0);



    return (
        <React.Fragment>
            <Box sx={{
                width: '100%', maxWidth: '98%', margin: '0 auto', minWidth: '1200px', background: `
  linear-gradient(
    180deg,
   rgba(242, 246, 219, 0.14) 0%,
    rgba(65, 99, 69, 0.75) 50%,
    rgba(65, 99, 69, 0.42) 100%
  )
`,
                borderRadius: '15px'
            }}>
                <StyledTabs
                    value={subTab}
                    onChange={(e, newValue) => setSubTab(newValue)}
                    textColor='primary'
                    indicatorColor="primary"
                    aria-label="tabsInfoActualizar"
                >
                    <StyledTab label={<Typography variant='h4' >
                        Excel completo
                    </Typography>} />
                    <StyledTab label={<Typography variant='h4' >
                        Excel con Fotos
                    </Typography>} />
                </StyledTabs>

                <Box sx={{
                    mt: 3,
                    minHeight: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    {subTab === 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Typography variant="h6" color="primary.light">
                                Descarga toda la información del sistema.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleDownload}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                    mb: 4

                                }}
                            >
                                Descargar Excel Completo
                            </Button>
                        </Box>
                    )}

                    {subTab === 1 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Typography variant="h6" color="primary.light">
                                Descarga Excel con imágenes (requiere conexión).
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleFoto}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                    mb: 4

                                }}
                            >
                                Descargar Excel Fotos
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );
};
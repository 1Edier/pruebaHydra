import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Typography, Card, CardContent, Grid2, IconButton, Popover } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WaterIcon from '@mui/icons-material/Water';

const DonutChart = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState('');
  const [sensorData, setSensorData] = useState({ temperature: 0 });

  const config = {
    Temperatura: { ideal: 22, range: 5 },
    PH: { ideal: 7.6, range: 0.5 },
    'Nivel de agua': { ideal: 50, range: 5 },
  };

  const getColor = (value, type) => {
    const { ideal, range } = config[type];
    if (value === ideal) return '#4caf50'; // Ideal
    if (value >= ideal - range && value <= ideal + range) return '#d1d117'; // Dentro del rango
    return '#f44336'; // Fuera del rango
  };

  const textItems = ['Temperatura', 'PH', 'Nivel de agua'];
  const icons = {
    Temperatura: <ThermostatIcon />,
    PH: <WaterDropIcon />,
    'Nivel de agua': <WaterIcon />,
  };

  const handlePopoverOpen = (event, type) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(`Valor Ideal: ${config[type].ideal}`);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://107.20.34.84:3000/api/datos')
        .then((response) => {
          console.log('Datos recibidos:', response.data);
          const lastData = response.data[response.data.length - 1];
          setSensorData({ temperature: lastData.temperature });
        })
        .catch((error) => console.error('Error al obtener los datos del sensor:', error));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getNormalizedValue = (value, type) => {
    const { ideal, range } = config[type];
    const min = ideal - range;
    const max = ideal + range;
    return Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
  };

  return (
    <Box sx={{ textAlign: 'center', my: 3 }}>
      {/* Color Legend */}
      <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="textSecondary">Significado de colores</Typography>
        <Typography variant="body2" color="textSecondary">
          <span style={{ color: '#4caf50' }}>🟢</span> Ideal &nbsp;
          <span style={{ color: '#d1d117' }}>🟡</span> Aceptable &nbsp;
          <span style={{ color: '#f44336' }}>🔴</span> Riesgo
        </Typography>
      </Box>

      <Grid2 container spacing={12} justifyContent="center">
        {textItems.map((item, index) => (
          <Grid2 item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <IconButton
                    onMouseEnter={(event) => handlePopoverOpen(event, item)}
                    onMouseLeave={handlePopoverClose}
                    aria-label="show ideal value"
                  >
                    <InfoOutlinedIcon />
                  </IconButton>
                </Box>
                <Popover
                  id={`popover-${item}`}
                  sx={{ pointerEvents: 'none' }}
                  open={open && popoverContent === `Valor Ideal: ${config[item].ideal}`}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Box sx={{ p: 2, width: 200 }}>
                    <Typography variant="body2" color="textSecondary">
                      {popoverContent}
                    </Typography>
                  </Box>
                </Popover>

                {/* Donut chart */}
                <Box position="relative" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={item === 'Temperatura' ? getNormalizedValue(sensorData.temperature, item) : 100}
                    size={140}
                    thickness={5}
                    sx={{
                      color: getColor(item === 'Temperatura' ? sensorData.temperature : config[item].ideal, item),
                      '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
                    }}
                  />
                  <Box position="absolute" display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h5" color="textPrimary">
                      {item === 'Temperatura' ? (sensorData.temperature || 0).toFixed(1) : config[item].ideal}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                  {icons[item]}
                  <Typography variant="h6" align="center" color="textSecondary" sx={{ ml: 1 }}>
                    {item}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: getColor(item === 'Temperatura' ? sensorData.temperature : config[item].ideal, item),
                    fontWeight: 'bold',
                    transition: 'color 0.5s',
                  }}
                >
                  {item === 'Temperatura' && sensorData.temperature === config.Temperatura.ideal ? 'Ideal' : 
                    item === 'Temperatura' && sensorData.temperature > config.Temperatura.ideal ? 'Arriba del Ideal' :
                    item === 'Temperatura' && sensorData.temperature < config.Temperatura.ideal ? 'Debajo del Ideal' :
                    'Valor Ideal'}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default DonutChart;

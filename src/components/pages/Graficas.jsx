// App.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import PHChangeGraph from '../Graficas/Phgrafica';
import DeviationBoxPlot from '../Graficas/DeviationBoxPlot';
import CriticalValuesPie from '../Graficas/CriticalValuesPie';

function Graficas() {
  return (
    <Container >
      <Typography variant="h4" align="center" gutterBottom>
        Monitoreo Estadístico de Criadero de Peces
      </Typography>
      <PHChangeGraph />
      <DeviationBoxPlot />
      <CriticalValuesPie />
    </Container>
  );
}

export default Graficas;

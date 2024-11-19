import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

// Datos de ejemplo (relación entre temperatura y nivel de agua)
const scatterData = [
  { temperature: 20, waterLevel: 30 },
  { temperature: 22, waterLevel: 35 },
  { temperature: 24, waterLevel: 40 },
  { temperature: 26, waterLevel: 50 },
  { temperature: 28, waterLevel: 55 },
];

function TemperatureWaterLevelGraph() {
  return (
    <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Relación entre Temperatura y Nivel de Agua
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="temperature" name="Temperatura" />
          <YAxis dataKey="waterLevel" name="Nivel de Agua" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Datos" data={scatterData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default TemperatureWaterLevelGraph;

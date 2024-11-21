import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

// Datos de ejemplo (frecuencia de alertas de pH)
const alertData = [
  { alertType: 'Alto pH', count: 5 },
  { alertType: 'Bajo pH', count: 3 },
  { alertType: 'Alerta Normal', count: 12 },
];

function AlertFrequencyGraph() {
  return (
    <Paper sx={{marginTop:'20px', padding: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Frecuencia de Alertas de pH Fuera de Rango
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={alertData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="alertType" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default AlertFrequencyGraph;

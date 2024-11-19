import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Paper } from '@mui/material';

const TemperatureChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Hacer la solicitud a la API
    axios.get('http://107.20.34.84:3000/api/datos')
      .then((response) => {
        const fetchedData = Object.keys(response.data).map(key => ({
          id: key,
          temperature: response.data[key].temperature
        }));
        setData(fetchedData);
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>Temperature Data</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default TemperatureChart;

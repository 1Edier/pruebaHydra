import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const AddRecomendation = () => {
  const [formData, setFormData] = useState({
    id_especie: '',
    frecuencia_alimentacion: '',
    cantidad_alimento: '',
    temperatura: '',
    ph: '',
  });
  const navigate = useNavigate(); 
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedIdEspecie = localStorage.getItem('IdEspecie');
    if (storedIdEspecie) {
      setFormData((prevData) => ({ ...prevData, id_especie: storedIdEspecie }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/recomendaciones', formData);
      setSuccess(true);
      setError(null);
      setFormData({
        id_especie: formData.id_especie, // Mantener el id_especie desde localStorage
        frecuencia_alimentacion: '',
        cantidad_alimento: '',
        temperatura: '',
        ph: '',
      });
      console.log('Response:', response.data);
      // Navegar a la página de perfiles tras el éxito
      navigate('/Home');
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.message || 'Error al agregar la recomendación');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Agregar Recomendación
      </Typography>
      <Box component="form" onSubmit={handleSubmit}  sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                    },
                    '&:hover fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'black', // Cambiar color del texto a negro
                  },
                  '& .MuiInputLabel-root': {
                    color: '#7a7c7e', // Cambiar color del label a negro
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                  },
                  mt: 3
                }}>
        <TextField
          fullWidth
          label="ID Especie"
          name="id_especie"
          value={formData.id_especie}
          onChange={handleChange}
          margin="normal"
          required
          disabled // Deshabilitado para que no pueda ser editado por el usuario
          
        />
        <TextField
          fullWidth
          label="Frecuencia de Alimentación"
          name="frecuencia_alimentacion"
          value={formData.frecuencia_alimentacion}
          onChange={handleChange}
          margin="normal"
          required
          
        />
        <TextField
          fullWidth
          label="Cantidad de Alimento"
          name="cantidad_alimento"
          value={formData.cantidad_alimento}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Temperatura (°C)"
          name="temperatura"
          value={formData.temperatura}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="pH"
          name="ph"
          value={formData.ph}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Agregar Recomendación
        </Button>
        {success && <Alert severity="success" sx={{ mt: 2 }}>¡Recomendación agregada con éxito!</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
};

export default AddRecomendation;

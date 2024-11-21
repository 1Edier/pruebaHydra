import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Alert, Radio, RadioGroup, FormControlLabel } from '@mui/material';
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
  const [systemRecommendations, setSystemRecommendations] = useState(null); // Recomendaciones del sistema
  const [useSystemRecommendations, setUseSystemRecommendations] = useState(true); // Control para usar las recomendaciones del sistema
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedIdEspecie = localStorage.getItem('IdEspecie');
    if (storedIdEspecie) {
      setFormData((prevData) => ({ ...prevData, id_especie: storedIdEspecie }));
      fetchRecommendations(storedIdEspecie);
    }
  }, []);

  // Fetch recommendations from the backend
  const fetchRecommendations = async (idEspecie) => {
    try {
      const response = await axios.get(`http://localhost:4000/recomendaciones/getrecomendationid/${idEspecie}`);
      if (response.data) {
        setSystemRecommendations(response.data);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('No se pudieron cargar las recomendaciones del sistema.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = useSystemRecommendations
        ? { ...systemRecommendations, id_especie: formData.id_especie }
        : formData;

      const response = await axios.post('http://localhost:4000/recomendaciones/createrecomedation', dataToSubmit);
      setSuccess(true);
      setError(null);
      setFormData({
        id_especie: formData.id_especie,
        frecuencia_alimentacion: '',
        cantidad_alimento: '',
        temperatura: '',
        ph: '',
      });
      console.log('Response:', response.data);
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

      <Box>
        <Typography variant="h6" gutterBottom>
          Recomendaciones Calculadas del Sistema
        </Typography>
        {systemRecommendations ? (
          <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '5px', background: '#f9f9f9' }}>
            <Typography>Frecuencia de Alimentación: {systemRecommendations.frecuencia_alimentacion}</Typography>
            <Typography>Cantidad de Alimento: {systemRecommendations.cantidad_alimento}</Typography>
            <Typography>Temperatura: {systemRecommendations.temperatura}</Typography>
            <Typography>pH: {systemRecommendations.ph}</Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No hay recomendaciones disponibles.
          </Typography>
        )}
      </Box>

      <RadioGroup
        row
        value={useSystemRecommendations}
        onChange={(e) => setUseSystemRecommendations(e.target.value === 'true')}
      >
        <FormControlLabel value={true} control={<Radio />} label="Usar Recomendaciones del Sistema" />
        <FormControlLabel value={false} control={<Radio />} label="Ingresar Datos Manualmente" />
      </RadioGroup>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#7a7c7e' },
            '&:hover fieldset': { borderColor: '#7a7c7e' },
            '&.Mui-focused fieldset': { borderColor: '#7a7c7e' },
          },
          '& .MuiInputBase-input': { color: 'black' },
          '& .MuiInputLabel-root': { color: '#7a7c7e' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#7a7c7e' },
          mt: 3,
        }}
      >
        <TextField
          fullWidth
          label="Frecuencia de Alimentación"
          name="frecuencia_alimentacion"
          value={useSystemRecommendations ? systemRecommendations?.frecuencia_alimentacion || '' : formData.frecuencia_alimentacion}
          onChange={handleChange}
          margin="normal"
          disabled={useSystemRecommendations}
          required
        />
        <TextField
          fullWidth
          label="Cantidad de Alimento"
          name="cantidad_alimento"
          value={useSystemRecommendations ? systemRecommendations?.cantidad_alimento || '' : formData.cantidad_alimento}
          onChange={handleChange}
          margin="normal"
          disabled={useSystemRecommendations}
          required
        />
        <TextField
          fullWidth
          label="Temperatura (°C)"
          name="temperatura"
          value={useSystemRecommendations ? systemRecommendations?.temperatura || '' : formData.temperatura}
          onChange={handleChange}
          margin="normal"
          disabled={useSystemRecommendations}
          required
        />
        <TextField
          fullWidth
          label="pH"
          name="ph"
          value={useSystemRecommendations ? systemRecommendations?.ph || '' : formData.ph}
          onChange={handleChange}
          margin="normal"
          disabled={useSystemRecommendations}
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

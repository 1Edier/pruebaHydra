import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/pez1-removebg-preview.png';
import DeleteIcon from '@mui/icons-material/Delete';

const FishProfiles = () => {
  const [fishData, setFishData] = useState([]);

  // Fetch all species data from the backend
  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const response = await fetch('http://localhost:4000/especies');
        const data = await response.json();
        setFishData(data);
      } catch (error) {
        console.error('Error fetching fish data:', error);
        toast.error('Error al cargar los perfiles de peces.', { position: 'top-right' });
      }
    };

    fetchFishData();
  }, []);

  const handleDeleteFish = async (id_especie) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este perfil de pez y sus recomendaciones?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/especies/${id_especie}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const newFishData = fishData.filter((fish) => fish.id_especie !== id_especie);
        setFishData(newFishData);
        toast.success('Perfil de pez y sus recomendaciones eliminados exitosamente', {
          position: 'top-right',
        });
      } else if (response.status === 404) {
        toast.error('El perfil de pez no fue encontrado.', { position: 'top-right' });
      } else if (response.status === 403 || response.status === 422) {
        // Manejar el caso donde el pez está seleccionado por un usuario
        const errorData = await response.json();
        toast.info(
          errorData.message || 'La especie no puede eliminarse porque está seleccionada por un usuario.',
          { position: 'top-right' }
        );
      } else {
        toast.error('La especie no puede eliminarse porque está seleccionada por un usuario.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error deleting fish:', error);
      toast.error('Error al eliminar el perfil de pez.', { position: 'top-right' });
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography color="secondary" variant="h6" align="center" gutterBottom>
        Perfiles de Peces
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {fishData.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No hay perfiles de peces disponibles.
          </Typography>
        ) : (
          fishData.map((fish) => (
            <Card
              key={fish.id_especie}
              sx={{
                width: '30%',
                marginTop: '2rem',
                marginBottom: 2,
                backgroundColor: fish.status === 'activo' ? '#4caf50' : 'white',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                borderRadius: '8px',
                boxShadow: 5,
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardMedia
                component="img"
                height="100"
                image={Logo}
                alt={`Imagen de ${fish.nombre_comun}`}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {fish.nombre_comun}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Edad: {fish.edad} meses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tamaño: {fish.tamaño}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Peso: {fish.peso}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Habitat: {fish.habitat}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estatus: {fish.status === 'activo' ? 'Activo' : 'Inactivo'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => handleDeleteFish(fish.id_especie)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <ToastContainer />
    </Container>
  );
};

export default FishProfiles;

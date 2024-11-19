import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para redirección

  // Actualiza los valores del formulario
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  // Maneja el envío del formulario
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = state;

    // Validación inicial
    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y el ID del usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId); // Aquí guardamos el ID del usuario

        // Verificar si es la primera vez que el usuario inicia sesión
        const isFirstLogin = localStorage.getItem("isFirstLogin");
        if (!isFirstLogin) {
          // Si es la primera vez, configurar la bandera
          localStorage.setItem("isFirstLogin", "false");
          navigate("/Registro"); // Redirigir a Registro
        } else {
          navigate("/Home"); // Redirigir a Home
        }
      } else {
        setError(data.message || "Inicio de sesión fallido. Intenta de nuevo.");
      }
    } catch (error) {
      setError("Ocurrió un error: " + error.message);
    }

    // Limpiar el estado del formulario
    setState({
      email: "",
      password: "",
    });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Iniciar sesión</h1>
        <input
          placeholder="Correo"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={state.password}
          onChange={handleChange}
        />
        <button>Iniciar sesión</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignInForm;

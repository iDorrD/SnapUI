import { toast } from "react-hot-toast";

const PUBLIC_API = "https://cristianlk25.iesmontenaranco.com:8000/api";
const LOCAL_API = "http://localhost:8000/api";

// Puedes cambiar entre la API pública y la local comentando/descomentando las siguientes líneas:
const DEV = false;
const API = DEV ? LOCAL_API : PUBLIC_API;

export const comprobarConexionAPI = async () => {
  const API_URL = DEV ? LOCAL_API : PUBLIC_API;

  try {
    const response = await fetch(`${API_URL}/componentes`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    return true;
  } catch (error) {
    console.error("Error de conexión con la API:", error);
    return false;
  }
};

export const getComponentesActivos = async () => {
  try {
    const response = await fetch(`${API}/componentes`);
    const data = await response.json();

    const activos = data.data.filter((comp) => comp.estado === "aprobado");

    return activos;
  } catch (error) {
    console.error("Error al obtener componentes activos:", error);
    return [];
  }
};

export const getComponentes = async () => {
  try {
    const response = await fetch(`${API}/componentes`);
    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Error al obtener componentes:", error);
    return [];
  }
};

export const getComponentesByUsuario = async (slug) => {
  const res = await fetch(`${API}/componentes/usuario/${slug}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "No se pudieron cargar los componentes.");
  return data;
};

// Login
export const loginUsuario = async ({ email, password }) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Login error");
  toast.success("Login successful!");

  return data;
};

export const registrarUsuario = async ({ name, email, password }) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = data.errors
      ? JSON.stringify(data.errors)
      : data.message || "Registration failed";
    throw new Error(error);
  }
  toast.success("Your account has been created!");

  return data;
};

export const getUsuario = async (slug) => {
  const res = await fetch(`${API}/profile/${slug}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "User not found");

  return data;
};

export const updateUsuario = async (formData) => {
  const res = await fetch(`${API}/user/profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed");
  toast.success("Profile updated successfully!");
  return data.user;
};

export const updateAvatar = async (formData) => {
  const res = await fetch(`${API}/user/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Avatar update failed");
  return data.user;
};

export const getCantidadUsuarios = async () => {
  try {
    const response = await fetch(`${API}/cantidadUsuarios`);
    const data = await response.json();

    return data.cantidad;
  } catch (error) {
    console.error("Error al obtener usuarios total:", error);
    return 0;
  }
};

// Gestor de componentes (Admin)
export const actualizarComponente = async (id, datos) => {
  const res = await fetch(`${API}/componentes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(datos),
  });

  const data = await res.json();

  if (!res.ok) toast.error(data.message || "Error updating component");
  return data;
};

// Gestor de reportes (Admin)
// !TODO: Implementar la función de reportes

// Gestor de usuarios (Admin)
export const getUsuarios = async () => {
  const res = await fetch(`${API}/usuarios`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.message || "No se pudieron obtener los usuarios");

  return data;
};

// Notificaciones
export const getNotificaciones = async () => {
  const res = await fetch(`${API}/notifications`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("No se pudieron cargar las notificaciones");

  return await res.json();
};

export const toggleNotificacionVista = async (id) => {
  const res = await fetch(`${API}/notifications/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("No se pudo actualizar la notificación");

  return await res.json();
};

// Seguir a un usuario
export const followUsuario = async (id) => {
  const res = await fetch(`${API}/follow/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("No se pudo seguir al usuario");
};

// Dejar de seguir a un usuario
export const unfollowUsuario = async (id) => {
  const res = await fetch(`${API}/unfollow/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("No se pudo dejar de seguir");
};

// Saber si lo estoy siguiendo
export const isSiguiendoUsuario = async (id) => {
  const res = await fetch(`${API}/is-following/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Error al comprobar seguimiento");

  const data = await res.json();
  return data.following;
};

// Crear componente
export const crearComponente = async (datos) => {
  const res = await fetch(`${API}/componentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw new Error("Error al crear el componente");

  return await res.json();
};

// Comentarios
export const getComentarios = async (id) => {
  const res = await fetch(`${API}/componentes/${id}/comentarios`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar los comentarios");
  return await res.json();
};

export const publicarComentario = async (id, contenido) => {
  const res = await fetch(`${API}/componentes/${id}/comentarios`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contenido }),
  });

  toast.success("Comment posted successfully!");

  if (!res.ok) throw new Error("No se pudo enviar el comentario");
  return await res.json();
};

// Reportes
export const enviarReporte = async ({ componente_id, motivo }) => {
  const res = await fetch(`${API}/reportes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ componente_id, motivo }),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.message || "No se pudo enviar el reporte");
    throw new Error(data.message || "Error al enviar el reporte");
  }

  toast.success("Report sent successfully!");
  return data;
};

export const getReportes = async () => {
  const res = await fetch(`${API}/reportes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Error al cargar reportes");

  return data;
};

// ? Esto borra el componente, relacionado con el reporte
export const eliminarComponente = async (id) => {
  const res = await fetch(`${API}/componentes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar componente");

  return data;
};

// Comprobar slug del usuario
export const verificarSlug = async (slug) => {
  const res = await fetch(`${API}/check-slug/${slug}`);
  const data = await res.json();
  return data.exists;
};

// Favoritos
export const toggleFavorito = async (componenteId) => {
  const res = await fetch(`${API}/componentes/${componenteId}/favorito`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("No se pudo cambiar el favorito");
  return await res.json();
};

export const isFavorito = async (componenteId) => {
  const res = await fetch(`${API}/componentes/${componenteId}/is-favorito`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Error al comprobar favorito");
  const data = await res.json();
  return data.favorito;
};

export const isReportado = async (componenteId) => {
  const res = await fetch(`${API}/componentes/${componenteId}/is-reportado`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Error al comprobar reporte");
  const data = await res.json();
  return data.reportado; // true o false
};

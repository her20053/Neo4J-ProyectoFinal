import { useState, useEffect } from 'react';
import '../Styles/ApplicationNavbarStyle.css';

export default function ApplicationNavbar() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/usuarios/buscar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        correo_electronico: 'andres.hernandez@email.com',
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuario(data);
                } else {
                    console.error('Error al obtener el usuario');
                }
            } catch (error) {
                console.error('Error en la solicitud fetch:', error);
            }
        };

        fetchUsuario();
    }, []);

    return (
        <div>
            {usuario ? (
                <div>
                    <h1>{usuario.nombre}</h1>
                    <p>{usuario.apellido}</p>
                    <p>{usuario.biografía}</p>
                    {/* Renderizar el resto de la información del usuario */}
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}

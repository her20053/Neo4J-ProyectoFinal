import React, { useEffect, useState } from 'react';
import { Avatar, Text, Divider, Paper, Button } from '@mantine/core';

export default function NuevaSolicitudComponent({ correo_usuario }) {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/usuarios/common-friends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_electronico: correo_usuario }),
        })
            .then((response) => response.json())
            .then((data) => setDatos(data))
            .catch((error) => console.log(error));
    }, [correo_usuario]);

    const enviarSolicitudAmistad = (correo_emisor, correo_receptor) => {
        fetch('http://localhost:5000/api/usuarios/enviar-solicitud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_emisor, correo_receptor }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                window.location.reload();
                // Aquí puedes realizar alguna acción adicional después de enviar la solicitud
            })
            .catch((error) => console.log(error));
    };

    return (
        <div>
            {datos.map((item) => (
                <div key={item.usuario.correo_electronico}>
                    <Paper shadow="xl" radius="md" p="xl" className="paper_amigos_recomendados">
                        <div className="area_amigos_recomendados_usuario">
                            <Avatar
                                key={item.usuario.correo_electronico}
                                src={"https://avatars.dicebear.com/api/bottts/" + `${item.usuario.nombre} ${item.usuario.apellido}` + ".svg"}
                                radius="xl"
                            />
                            <Text fw={500}>{`${item.usuario.nombre} ${item.usuario.apellido}`}</Text>
                            <Text c="teal.4">{item.usuario.correo_electronico}</Text>
                        </div>
                        <Divider my="sm" variant="dotted" />
                        <div className="area_amigos_recomendados_amigos">
                            <Text c="dimmed">Amigos en común</Text>
                            <Avatar.Group spacing="sm">
                                {item.amigos_comunes.map((amigo) => (
                                    <Avatar
                                        key={amigo}
                                        src={`https://avatars.dicebear.com/api/bottts/${amigo}.svg`}
                                        radius="xl"
                                    />
                                ))}
                            </Avatar.Group>
                        </div>
                        <Divider my="sm" variant="dotted" />
                        <Button
                            color="green"
                            onClick={() =>
                                enviarSolicitudAmistad(
                                    item.usuario.correo_electronico,
                                    correo_usuario
                                )
                            }
                        >
                            Enviar solicitud
                        </Button>
                    </Paper>
                </div>
            ))}
        </div>
    );
}

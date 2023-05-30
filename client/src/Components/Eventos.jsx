import React, { useState, useEffect } from "react";
import { Card, Image, Text, Badge, Button, Group, Chip } from '@mantine/core';

export default function EventosComponent({ correoElectronico }) {

    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/usuarios/eventos/asistencia')
            .then(response => response.json())
            .then(data => {
                const eventosAgrupados = data.reduce((acc, asistencia) => {
                    const { evento } = asistencia;
                    const idEvento = evento.nombre; // o cualquier identificador único

                    if (!acc[idEvento]) {
                        acc[idEvento] = {
                            ...evento,
                            fecha_inicio: evento.fecha_inicio.split('T')[0],
                            fecha_fin: evento.fecha_fin.split('T')[0],
                            asistentes: [{ nombre: `${asistencia.usuario.nombre} ${asistencia.usuario.apellido}`, correo: asistencia.usuario.correo_electronico }],
                        };
                    } else {
                        acc[idEvento].asistentes.push({ nombre: `${asistencia.usuario.nombre} ${asistencia.usuario.apellido}`, correo: asistencia.usuario.correo_electronico });
                    }

                    return acc;
                }, {});

                setEventos(Object.values(eventosAgrupados));
            })
            .catch(error => console.error('Hubo un error en la petición: ', error));
    }, []);

    const handleClick = (asiste, eventoId) => {
        const endpoint = asiste ?
            'http://localhost:5000/api/usuarios/eventos/asistencia/eliminar' :
            'http://localhost:5000/api/usuarios/eventos/asistencia/crear';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: correoElectronico,
                evento_id: eventoId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <main className="fb-section feed">
            <Text ta="center" fz="xl" fw={700}>Eventos</Text>
            <hr />
            {eventos.map((evento, index) => (
                <div key={index}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group position="apart" mt="md" mb="xs">
                            <Text weight={500}>{evento.nombre}</Text>
                            <Badge color="green" variant="light">
                                {evento.fecha_inicio}
                            </Badge>
                            <Badge color="pink" variant="light">
                                {evento.fecha_fin}
                            </Badge>
                        </Group>
                        <Text size="sm" color="dimmed">
                            {evento.descripcion}
                        </Text>
                        <Group position="apart" mt="md" mb="xs">
                            <p>Asistentes: {evento.asistentes.map(asistente => `${asistente.nombre}`).join(', ')}</p>
                        </Group>
                        <Group position="apart" mt="md" mb="xs">
                            <Badge radius="sm" color="yellow">Ubicacion del evento: {evento.ubicacion}</Badge>
                        </Group>
                        <Chip
                            variant="light"
                            checked={evento.asistentes.map(({ correo }) => correo).includes(correoElectronico)}
                            onClick={() => handleClick(evento.asistentes.map(({ correo }) => correo).includes(correoElectronico), evento.id)}
                        >
                            Asistire
                        </Chip>
                    </Card>
                    <hr />
                </div>
            ))}
        </main>
    );
}

import React, { useState, useEffect } from "react";
import { Card, Image, Text, Badge, Button, Group, Chip } from '@mantine/core';

export default function GruposComponent({ correoElectronico }) {
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/obtener_grupos_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: correoElectronico
            }),
        })
            .then(response => response.json())
            .then(data => setGrupos(data))
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [correoElectronico]);

    return (
        <main className="fb-section feed">
            <Text ta="center" fz="xl" fw={700}>Grupos</Text>
            <hr />
            {grupos.map(grupo => (
                <Card key={grupo.id}>
                    <Text>{grupo.nombre}</Text>
                    <Text>{grupo.descripcion}</Text>
                    <Badge color={grupo.privacidad ? 'green' : 'red'}>{grupo.privacidad ? 'Privado' : 'Público'}</Badge>
                </Card>
            ))}
        </main>
    )
}

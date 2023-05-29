import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import { useState } from 'react';

import { ActionIcon } from '@mantine/core';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { IconSquareRoundedXFilled } from '@tabler/icons-react';


export default function SolicitudExtendidaAppComponent({ info_solicitud, correo_usuario }) {

    const agregarAmistad = async () => {
        const data = {
            correo_emisor: info_solicitud.correo_electronico,
            correo_receptor: correo_usuario
        };

        try {
            const response = await fetch('http://localhost:5000/api/usuarios/agregar-amigos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.reload(); // Recargar la página
            } else {
                console.error('Error al agregar amigos');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    const eliminarAmistad = async () => {
        const data = {
            correo_emisor: info_solicitud.correo_electronico,
            correo_receptor: correo_usuario
        };

        try {
            const response = await fetch('http://localhost:5000/api/usuarios/eliminar-solicitud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.reload(); // Recargar la página
            } else {
                console.error('Error al eliminar la amistad');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    return (
        <UnstyledButton className='UnstyledButton_Solicitud' >

            <ActionIcon className='UnstyledButton_Solicitud_Parte' color="lime" variant="light" size="xl" onClick={agregarAmistad}>
                <IconCircleCheckFilled size="2.125rem" />
            </ActionIcon>

            <ActionIcon className='UnstyledButton_Solicitud_Parte' color="red" variant="light" size="xl" onClick={eliminarAmistad}>
                <IconSquareRoundedXFilled size="2.125rem" />
            </ActionIcon>

            <Group className='UnstyledButton_Solicitud_Parte'>
                <Avatar size={40}>
                    <img className="profile-image" src={"https://avatars.dicebear.com/api/bottts/" + info_solicitud.nombre + " " + info_solicitud.apellido + ".svg"} alt="profile image" />
                </Avatar>
                <div>
                    <Text>{info_solicitud.nombre + " " + info_solicitud.apellido}</Text>
                    <Text size="xs" color="dimmed">{info_solicitud.correo_electronico}</Text>
                    <Text size="xs" color="dimmed">{info_solicitud.biografía}</Text>
                </div>
            </Group>
        </UnstyledButton>
    );
}

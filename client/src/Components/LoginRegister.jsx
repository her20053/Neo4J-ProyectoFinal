import { Center, Group, Button, Text, Paper, TextInput } from '@mantine/core';
import { useState } from 'react';

export default function LoginRegisterComponent({ setCorreoElectronicoParam }) {

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [profesion, setProfesion] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [habilidades, setHabilidades] = useState('');
    const [intereses, setIntereses] = useState('');
    const [biografia, setBiografia] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('1990-03-03');

    const registrarUsuario = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/usuarios/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profesion: profesion,
                    nombre: nombre,
                    apellido: apellido,
                    correo_electronico: correoElectronico,
                    fecha_nacimiento: fechaNacimiento,
                    ubicacion: "Guatemala",
                    habilidades: habilidades,
                    intereses: intereses,
                    biografia: biografia,
                }),
            });

            const data = await response.json();

            if (data.mensaje) {
                // alert(data.mensaje);
                setCorreoElectronicoParam(correoElectronico);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const loggearUsuario = async () => {
        setCorreoElectronicoParam(correoElectronico);
    }

    return (
        <Center maw={1280} h={720} mx="auto">
            <Group position="center">
                <Paper shadow="xs" p="md">
                    <TextInput
                        label="Nombre"
                        variant="filled"
                        radius="md"
                        value={nombre} onChange={(event) => setNombre(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Apellido"
                        variant="filled"
                        radius="md"
                        value={apellido} onChange={(event) => setApellido(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Profesion"
                        variant="filled"
                        radius="md"
                        value={profesion} onChange={(event) => setProfesion(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Correo electronico"
                        variant="filled"
                        radius="md"
                        value={correoElectronico} onChange={(event) => setCorreoElectronico(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Habilidades"
                        variant="filled"
                        radius="md"
                        value={habilidades} onChange={(event) => setHabilidades(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Intereses"
                        variant="filled"
                        radius="md"
                        value={intereses} onChange={(event) => setIntereses(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Biografia"
                        variant="filled"
                        radius="md"
                        value={biografia} onChange={(event) => setBiografia(event.currentTarget.value)}
                    />
                    <Button onClick={registrarUsuario}>
                        Registrar
                    </Button>

                </Paper>
                <Paper shadow="xs" p="md">
                    <TextInput
                        label="Correo electronico"
                        variant="filled"
                        radius="md"
                        value={correoElectronico} onChange={(event) => setCorreoElectronico(event.currentTarget.value)}
                    />
                    <Button onClick={loggearUsuario}>
                        Loggear
                    </Button>
                </Paper>
            </Group>
        </Center>

    )
}
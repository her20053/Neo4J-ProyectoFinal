import { useState, useEffect } from 'react';
import '../Styles/ApplicationSidebarStyle.css';

import { IconCalendar, IconMapPin } from '@tabler/icons-react';

import { Text } from '@mantine/core';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Card, Image, Badge, Button, Group, ScrollArea } from '@mantine/core';

export default function ApplicationSidebar() {

    const [amigos, setAmigos] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [eventos, setEventos] = useState(null);
    const [solicitudes, setSolicitudes] = useState(null);

    const [eventosModal, eventosModalControls] = useDisclosure(false);
    const [solicitudesModal, solicitudesModalControls] = useDisclosure(false);
    const [amigosModal, amigosModalControls] = useDisclosure(false);

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

    useEffect(() => {
        const fetchEventos = async () => {
            if (usuario) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/eventos/buscar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            correo_electronico: usuario.correo_electronico,
                        }),
                    });

                    if (response.ok) {
                        let data = await response.json();

                        // Corregir fechas si es necesario
                        data = data.map(evento => {
                            // Verificar si la fecha_fin contiene una "T"
                            if (evento.fecha_fin.includes("T")) {
                                // Remover la parte después de la "T"
                                evento.fecha_fin = evento.fecha_fin.split("T")[0];
                            }
                            // Verificar si la fecha_inicio contiene una "T"
                            if (evento.fecha_inicio.includes("T")) {
                                // Remover la parte después de la "T"
                                evento.fecha_inicio = evento.fecha_inicio.split("T")[0];
                            }
                            return evento;
                        });

                        setEventos(data);
                    } else {
                        console.error('Error al obtener los eventos');
                    }
                } catch (error) {
                    console.error('Error en la solicitud fetch:', error);
                }
            }
        };

        fetchEventos();
    }, [usuario]);

    useEffect(() => {
        const fetchSolicitudesAmistad = async () => {
            if (usuario) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/usuarios/solicitudes-amistad', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            correo_electronico: usuario.correo_electronico,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setSolicitudes(data);
                    } else {
                        console.error('Error al obtener las solicitudes de amistad');
                    }
                } catch (error) {
                    console.error('Error en la solicitud fetch:', error);
                }
            }
        };

        fetchSolicitudesAmistad();
    }, [usuario]);

    useEffect(() => {
        const fetchAmigos = async () => {
            if (usuario) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/usuarios/amigos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            correo_electronico: usuario.correo_electronico,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setAmigos(data);
                    } else {
                        console.error('Error al obtener los amigos');
                    }
                } catch (error) {
                    console.error('Error en la solicitud fetch:', error);
                }
            }
        };

        fetchAmigos();
    }, [usuario]);

    return (
        <ScrollArea type="never" offsetScrollbars>
            {eventos ? (
                <div>
                    <div className='ApplicationSidebar_Eventos_TusEventos_Area'>
                        <Text className='ApplicationSidebar_Eventos_TusEventos_Texto' fw={500}>Eventos</Text>
                        <Text className='ApplicationSidebar_Eventos_TusEventos_Texto' c="blue" onClick={eventosModalControls.open}>Mostrar eventos</Text>
                    </div>

                    {/* Mostrar solo la primera Card */}
                    {eventos.slice(-1).map((evento) => (
                        <Card
                            padding="lg"
                            radius="md"
                            key={evento.id}
                            className='ApplicationSidebar_Eventos_TusEventos_Card'>
                            <Group position="apart" mt="md" mb="xs">
                                <Text weight={500}>{evento.nombre}</Text>
                                <Badge className='ApplicationSidebar_Eventos_TusEventos_Card_Badge' color="green" variant="light">
                                    <IconCalendar className='eventos_badge_icon' size={15} />
                                    <Text> {evento.fecha_inicio}</Text>
                                </Badge>
                                <Badge className='ApplicationSidebar_Eventos_TusEventos_Card_Badge' color="blue" variant="light">
                                    <IconMapPin className='eventos_badge_icon' size={15} />
                                    <Text> {evento.ubicacion}</Text>
                                </Badge>
                            </Group>

                            <Text size="sm" color="dimmed">
                                {evento.descripcion}
                            </Text>
                        </Card>
                    ))}


                    {/* Modal con todas las Cards */}
                    <Modal
                        opened={eventosModal}
                        onClose={eventosModalControls.close}
                        withCloseButton={false}
                        centered
                        size="55%"
                        overlayProps={{
                            opacity: 0.55,
                            blur: 3,
                        }}
                        transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
                    >
                        {eventos.map((evento) => (
                            <Card
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                                key={evento.id}
                                className='ApplicationSidebar_Eventos_TusEventos_Card'>
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

                                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                                    {evento.ubicacion}
                                </Button>
                                <Button variant="light" color="red" fullWidth mt="md" radius="md">
                                    Cancelar
                                </Button>
                            </Card>
                        ))}
                    </Modal>
                </div>
            ) : (
                <p>Cargando eventos...</p>
            )}

            {solicitudes ? (
                <div>

                    <div className='ApplicationSidebar_Eventos_TusEventos_Area'>
                        <Text className='ApplicationSidebar_Eventos_TusEventos_Texto Solicitud_Amistad' fw={500}>Solicitudes</Text>
                        <Text className='ApplicationSidebar_Eventos_TusEventos_Texto Solicitud_Amistad' c="blue" onClick={solicitudesModalControls.open}>Mostrar solicitudes</Text>
                    </div>

                    {/* Mostrar solo la primera Card */}
                    {solicitudes.slice(-1).map((solicitud) => (
                        <Card padding="lg" radius="md" key={solicitud.id}>

                            <Group position="apart" mt="md" mb="xs">
                                <Text weight={500}>{solicitud.nombre + " " + solicitud.apellido}</Text>
                            </Group>

                            <div className='ApplicationSidebar_Solicitudes_Botones'>
                                <Button variant="light" color="blue" mt="md" radius="md">
                                    Aceptar
                                </Button>
                                <Button variant="light" color="red" mt="md" radius="md">
                                    Rechazar
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Modal con todas las Cards */}
                    <Modal
                        opened={solicitudesModal}
                        onClose={solicitudesModalControls.close}
                        withCloseButton={false}
                        centered
                        size="55%"
                        overlayProps={{
                            opacity: 0.55,
                            blur: 3,
                        }}
                        transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
                    >
                        {solicitudes.map((solicitud) => (
                            <Card shadow="sm" padding="lg" radius="md" withBorder key={solicitud.id} className='ApplicationSidebar_Eventos_TusEventos_Card'>

                                <Group position="apart" mt="md" mb="xs">
                                    <Text weight={500}>{solicitud.nombre + " " + solicitud.apellido}</Text>
                                </Group>

                                <Text size="sm" color="dimmed">
                                    {solicitud.biografía}
                                </Text>

                                <div className='ApplicationSidebar_Solicitudes_Botones'>
                                    <Button variant="light" color="blue" mt="md" radius="md">
                                        Aceptar
                                    </Button>
                                    <Button variant="light" color="red" mt="md" radius="md">
                                        Rechazar
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </Modal>

                </div>
            ) : (
                <p>Cargando solicitudes de amistad...</p>
            )}


            {amigos ? (
                <div>
                    <div className='ApplicationSidebar_Eventos_TusEventos_Area'>
                        <Text className='ApplicationSidebar_Eventos_TusEventos_Texto Solicitud_Amistad' fw={500}>Amigos</Text>
                        <Text className='ApplicationSidebar_Eventos_TusEventos_Texto Solicitud_Amistad' c="blue" onClick={amigosModalControls.open}>Mostrar amistades</Text>
                    </div>

                    {/* Mostrar solo la primera Card */}
                    {amigos.slice(0, 1).map((amigo) => (
                        <Card shadow="sm" padding="lg" radius="md" withBorder key={amigo.id}>
                            <Group position="apart" mt="md" mb="xs">
                                <Text weight={500}>{amigo.nombre + " " + amigo.apellido}</Text>
                            </Group>
                            <Text size="sm" color="dimmed">
                                {amigo.descripcion}
                            </Text>

                            {/* Renderizar el resto de la información de cada amigo */}

                            <Button variant="light" color="blue" mt="md" radius="md">
                                Enviar mensaje
                            </Button>
                        </Card>
                    ))}

                    {/* Modal con todas las Cards */}
                    <Modal
                        opened={amigosModal}
                        onClose={amigosModalControls.close}
                        withCloseButton={false}
                        centered
                        size="55%"
                        overlayProps={{
                            opacity: 0.55,
                            blur: 3,
                        }}
                        transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
                    >
                        {amigos.map((amigo) => (
                            <Card shadow="sm" padding="lg" radius="md" withBorder key={amigo.id}>
                                <Group position="apart" mt="md" mb="xs">
                                    <Text weight={500}>{amigo.nombre + " " + amigo.apellido}</Text>
                                </Group>
                                <Text size="sm" color="dimmed">
                                    {amigo.descripcion}
                                </Text>

                                {/* Renderizar el resto de la información de cada amigo */}

                                <Button variant="light" color="blue" mt="md" radius="md">
                                    Enviar mensaje
                                </Button>
                            </Card>
                        ))}
                    </Modal>
                </div>
            ) : (
                <p>Cargando amigos...</p>
            )}
        </ScrollArea>
    );
}



import React, { useState, useEffect } from 'react';

import AmigoAppComponent from './AsideComponents/Amigo';
import SolicitudAppComponent from './AsideComponents/Solicitud';
import SolicitudExtendidaAppComponent from './AsideComponents/SolicitudExpandida';
import NuevaSolicitudComponent from "./AsideComponents/NuevaSolicitud"

import { useDisclosure } from '@mantine/hooks';
import { ScrollArea } from '@mantine/core';
import { Modal } from '@mantine/core';

import { Text } from '@mantine/core';

export default function AsideAppComponent({ correoElectronico }) {
    const [usuario, setUsuario] = useState(null);
    const [amigos, setAmigos] = useState(null);
    const [solicitudes, setSolicitudes] = useState(null);

    const [solicitudesModal, solicitudesModalControls] = useDisclosure(false);

    const [nuevaSolicitudModal, nuevaSolicitudModalConstrols] = useDisclosure(false);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(
                    'http://127.0.0.1:5000/api/usuarios/buscar',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            correo_electronico: correoElectronico,
                        }),
                    }
                );

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
    }, [correoElectronico]);

    useEffect(() => {
        const fetchAmigos = async () => {
            if (usuario) {
                try {
                    const response = await fetch(
                        'http://127.0.0.1:5000/api/usuarios/amigos',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                correo_electronico: usuario.correo_electronico,
                            }),
                        }
                    );

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

    useEffect(() => {
        const fetchSolicitudesAmistad = async () => {
            if (usuario) {
                try {
                    const response = await fetch(
                        'http://127.0.0.1:5000/api/usuarios/solicitudes-amistad',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                correo_electronico: usuario.correo_electronico,
                            }),
                        }
                    );

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

    return (
        <aside className="fb-section info">
            <div className="fixed-panel info-wrapper">
                <section className="info__toolbar">
                    <div>
                        {usuario && (
                            <Text style={{ marginRight: "10px" }}
                                c="blue">{usuario.nombre +
                                    ' ' +
                                    usuario.apellido}</Text>
                        )}
                        {usuario && (
                            <Text style={{ marginRight: "10px" }}
                                c="dimmed">{usuario.correo_electronico}</Text>
                        )}
                    </div>
                    {usuario && (
                        <img
                            className="profile-image"
                            src={
                                'https://avatars.dicebear.com/api/bottts/' +
                                usuario.nombre +
                                ' ' +
                                usuario.apellido +
                                '.svg'
                            }
                            alt="profile_pic"
                        />
                    )}
                </section>


                <section className="info__stories card">
                    <div className="info__stories__title">
                        <strong>Solicitudes</strong>
                        <a
                            onClick={solicitudesModalControls.open}
                            className="info__stories__title__all-button"
                        >
                            Todas
                        </a>
                    </div>
                    <div className="info__stories__bubbles__wrapper">
                        <div className="info__stories__bubbles">
                            <div className="bubble bubble--new-history">
                                <i className="fa fa-plus" onClick={nuevaSolicitudModalConstrols.open}>
                                </i>
                            </div>
                            {solicitudes &&
                                solicitudes.map((solicitud) => (
                                    <SolicitudAppComponent
                                        key={solicitud.id}
                                        nombre={solicitud.nombre + ' ' + solicitud.apellido}
                                    />
                                ))}
                        </div>
                    </div>

                    {solicitudes ? (
                        <div>
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
                                    <SolicitudExtendidaAppComponent
                                        key={solicitud.id}
                                        info_solicitud={solicitud}
                                        correo_usuario={correoElectronico}
                                    />
                                ))}
                            </Modal>
                        </div>
                    ) : (
                        <p>Cargando solicitudes de amistad...</p>
                    )}
                </section>

                <Modal
                    opened={nuevaSolicitudModal}
                    onClose={nuevaSolicitudModalConstrols.close}
                    withCloseButton={false}
                    centered
                    size="55%"
                    overlayProps={{
                        opacity: 0.55,
                        blur: 3,
                    }}
                    transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
                >
                    <NuevaSolicitudComponent correo_usuario={correoElectronico} />
                </Modal>

                <section className="info__contacts">
                    <div className="info__contacts__title">
                        <strong>Amigos</strong>
                        <a className="info__contacts__title__icon">
                            <i className="fa fa-search info__contacts__icon"></i>
                        </a>
                    </div>
                    <div className="info__contacts__list">
                        <ScrollArea h={300} scrollbarSize={1} style={{ marginTop: '20px' }}>
                            {amigos &&
                                amigos.map((amigo) => (
                                    <AmigoAppComponent
                                        key={amigo.id}
                                        nombre={amigo.nombre + ' ' + amigo.apellido}
                                    />
                                ))}
                        </ScrollArea>
                    </div>
                </section>
            </div>
        </aside>
    );
}

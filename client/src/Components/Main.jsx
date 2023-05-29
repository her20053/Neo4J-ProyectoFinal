import React, { useState, useEffect } from "react";
import { TextInput } from '@mantine/core';

import { IconSend, IconMessageCircle, IconHeart } from '@tabler/icons-react';

import { Button } from '@mantine/core';

export default function MainAppComponent({ correoElectronico }) {
    const [publicaciones, setPublicaciones] = useState([]);
    const [usuario, setUsuario] = useState(null);

    const [nuevaPublicacion, setnuevaPublicacion] = useState('');

    const [nuevoComentario, setnuevoComentario] = useState('');

    useEffect(() => {
        console.log(publicaciones);
    }, [publicaciones])

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/usuarios/buscar",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
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
                    console.error("Error al obtener el usuario");
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchUsuario();
    }, [correoElectronico]);

    useEffect(() => {
        const fetchPublicaciones = async () => {
            const respuestaAmigos = await fetch(
                "http://localhost:5000/api/usuarios/publicaciones_amigos",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ correo_electronico: correoElectronico }),
                }
            );

            const respuestaPropias = await fetch(
                "http://localhost:5000/api/usuarios/publicaciones_propias",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ correo_electronico: correoElectronico }),
                }
            );

            const dataAmigos = await respuestaAmigos.json();
            const dataPropias = await respuestaPropias.json();

            const publicacionesData = [...dataAmigos, ...dataPropias];

            for (const publicacion of publicacionesData) {
                const comentarios = await fetchComentarios(publicacion.p.id);
                publicacion.comentarios = comentarios;
            }

            setPublicaciones(publicacionesData);
        };

        fetchPublicaciones();
    }, [correoElectronico]);

    const fetchComentarios = async (publicacionId) => {
        const response = await fetch(
            "http://localhost:5000/api/comentarios/buscar",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicacion_id: publicacionId }),
            }
        );

        if (response.ok) {
            const comentarios = await response.json();
            return comentarios || [];
        } else {
            console.error("Error al obtener los comentarios");
            return [];
        }
    };

    const handleCrearPublicacion = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/publicaciones/crear",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        correo_electronico: correoElectronico,
                        contenido: nuevaPublicacion,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Publicación creada:", data);
                window.location.reload(); // Recargar la página
            } else {
                console.error("Error al crear la publicación");
            }
        } catch (error) {
            console.error("Error en la solicitud fetch:", error);
        }
    };

    const handleCrearComentario = async (publicacionId) => {
        console.log(publicacionId);
        try {
            const response = await fetch(
                "http://localhost:5000/api/comentarios/crear",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        correo_electronico: correoElectronico,
                        contenido: nuevoComentario,
                        publicacion_id: publicacionId,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Comentario creado:", data);
                window.location.reload(); // Recargar la página
            } else {
                console.error("Error al crear el comentario");
            }
        } catch (error) {
            console.error("Error en la solicitud fetch:", error);
        }
    };

    const handleMeGusta = async (publicacionId) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/publicaciones/me-gusta",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ publicacion_id: publicacionId }),
                }
            );

            if (response.ok) {
                console.log("Me gusta incrementado");
                window.location.reload(); // Recargar la página
            } else {
                console.error("Error al incrementar me gusta");
            }
        } catch (error) {
            console.error("Error en la solicitud fetch:", error);
        }
    };

    return (
        <main className="fb-section feed">
            <div className="feed__post-creation card card--strait">
                {usuario && (
                    <img
                        className="profile-image feed__post-creation__pic"
                        src={
                            "https://avatars.dicebear.com/api/bottts/" +
                            usuario.nombre +
                            " " +
                            usuario.apellido +
                            ".svg"
                        }
                        alt="profile-image"
                    />
                )}

                {usuario && (
                    <div className="feed__post-creation__form profile-image">
                        <span className="feed__post-creation__form__placeholder" >
                            <TextInput className="text_input_nueva_publicacion" placeholder={"Que estas pensando " + usuario.nombre + " " + usuario.apellido + "?"}
                                variant="unstyled" value={nuevaPublicacion} onChange={(event) => setnuevaPublicacion(event.currentTarget.value)} />

                        </span>
                        <Button leftIcon={<IconSend size="1rem" />} variant="subtle" color="green" onClick={handleCrearPublicacion}>
                        </Button>
                    </div>
                )}
            </div>
            <article className="feed__posts">
                {publicaciones.map((publicacion, index) => (
                    <section key={publicacion.p.id} className="feed-post card">
                        {/* Aquí va el header con la información del usuario */}
                        <header className="feed-post__header">
                            <div className="feed-post__header__info">
                                <img
                                    className="profile-image"
                                    src={
                                        "https://avatars.dicebear.com/api/bottts/" +
                                        ((publicacion.amigo?.nombre &&
                                            publicacion.amigo?.apellido)
                                            ? publicacion.amigo.nombre + " " + publicacion.amigo.apellido
                                            : publicacion.u?.nombre + " " + publicacion.u?.apellido) +
                                        ".svg"
                                    }
                                    alt="profile_pic"
                                />
                                <div className="user-info">
                                    <strong className="user-info__name">
                                        {publicacion.amigo?.correo_electronico ||
                                            publicacion.u?.correo_electronico}
                                    </strong>
                                    <div className="user-info__post-date">
                                        {publicacion.p.fecha_creacion}
                                    </div>
                                </div>
                            </div>
                            <a className="feed-post__header__options-button" style={{ display: "flex", flexDirection: "row" }}>
                                <TextInput
                                    placeholder="Comenta algo"
                                    variant="filled"
                                    value={nuevoComentario} onChange={(event) => setnuevoComentario(event.currentTarget.value)}
                                />
                                <Button leftIcon={<IconMessageCircle size="1rem" />} variant="subtle" color="blue" onClick={() => handleCrearComentario(publicacion.p.id)}>
                                </Button>


                                <Button
                                    leftIcon={<IconHeart size="1rem" />}
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleMeGusta(publicacion.p.id)}
                                >
                                    {publicacion.p.me_gusta}
                                </Button>

                            </a>
                        </header>
                        {/* Aquí va el body con el contenido de la publicación */}
                        <div className="feed-post__body">
                            <div className="feed-post__body__description">
                                {publicacion.p.contenido}
                            </div>
                        </div>
                        {/* Aquí va el footer con las acciones */}
                        <footer className="feed-post__footer">
                            {/* <a className="post-action active">
                                <i className="post-action__icon fa fa-thumbs-up"></i>
                                {publicacion.p.me_gusta}
                            </a> */}
                            {/* Aquí van las otras acciones */}
                            <div className="comments-section">
                                {publicacion.comentarios && (



                                    <div className="comments-section__comments">
                                        {publicacion.comentarios.map((comentario) => (
                                            <section key={comentario.id} className="feed-post card">
                                                {/* Aquí va el header con la información del usuario */}
                                                <header className="feed-post__header">
                                                    <div className="feed-post__header__info">
                                                        <img
                                                            className="profile-image"
                                                            src={
                                                                "https://avatars.dicebear.com/api/bottts/" +
                                                                comentario.usuario.nombre + " " + comentario.usuario.apellido +
                                                                ".svg"
                                                            }
                                                            alt="profile_pic"
                                                        />
                                                        <div className="user-info">
                                                            <strong className="user-info__name">
                                                                {comentario.usuario.correo_electronico}
                                                            </strong>
                                                            <div className="user-info__post-date">
                                                                {comentario.fecha_creacion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </header>
                                                {/* Aquí va el body con el contenido de la publicación */}
                                                <div className="feed-post__body">
                                                    <div className="feed-post__body__description">
                                                        {comentario.contenido}
                                                    </div>
                                                </div>
                                                {/* Aquí va el footer con las acciones */}
                                                <footer className="feed-post__footer">
                                                    {/* <a className="post-action active">
                                                <i className="post-action__icon fa fa-thumbs-up"></i>
                                                {publicacion.p.me_gusta}
                                            </a> */}
                                                </footer>
                                            </section>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </footer>
                    </section>
                ))}
            </article>
        </main>
    );
}

import React, { useState } from "react";
import HeaderAppComponent from "./Header";
import MainAppComponent from "./Main";
import AsideAppComponent from "./Aside";
import EventosComponent from "./Eventos";
import GruposComponent from "./Grupos";

export default function WrapperAppComponent() {
    const [correoElectronico, setCorreoElectronico] = useState("andres.iniesta@email.com");
    const [activeMenuItem, setActiveMenuItem] = useState("POSTS");

    return (
        <div className="wrapper">
            <HeaderAppComponent correoElectronico={correoElectronico} onMenuItemClick={setActiveMenuItem} />
            {
                activeMenuItem == "POSTS"
                    ?
                    <MainAppComponent correoElectronico={correoElectronico} />
                    :
                    activeMenuItem == "EVENTS"
                        ?
                        <EventosComponent correoElectronico={correoElectronico} />
                        :
                        <><GruposComponent correoElectronico={correoElectronico} /></>
            }
            <AsideAppComponent correoElectronico={correoElectronico} />
        </div>
    );
}
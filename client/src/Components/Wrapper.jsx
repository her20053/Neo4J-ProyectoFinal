import React, { useState } from "react";
import HeaderAppComponent from "./Header";
import MainAppComponent from "./Main";
import AsideAppComponent from "./Aside";

export default function WrapperAppComponent() {
    const [correoElectronico, setCorreoElectronico] = useState("andres.iniesta@email.com");

    return (
        <div className="wrapper">
            <HeaderAppComponent correoElectronico={correoElectronico} />
            <MainAppComponent correoElectronico={correoElectronico} />
            <AsideAppComponent correoElectronico={correoElectronico} />
        </div>
    );
}
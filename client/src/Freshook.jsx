import './assets/css/fontawesome/css/all.min.css'
import './assets/css/components.css'
import './assets/css/variables.css'
import './assets/css/styles.css'

import WrapperAppComponent from './Components/Wrapper'

import LoginRegisterComponent from './Components/LoginRegister'

import React, { useState, useEffect } from 'react';


export default function FreshookAppComponent() {

    const [email, setEmail] = useState('');

    return (
        <div>
            {email !== ''
                ?
                <WrapperAppComponent correoElectronico={email} />
                :
                <LoginRegisterComponent setCorreoElectronicoParam={setEmail} />
            }
        </div>
    )
}
import React, {useState} from 'react';
import Layout from '../components/layout/Layout'
import { css } from '@emotion/core'
import Router from 'next/router'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import firebase from '../firebase'



const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
}

const CrearCuenta = () => {
    
    const [error, guardarError] = useState(false);
    const {valores, errores,handleSubmit,handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

    const {nombre, email, password} = valores;

    async function crearCuenta(){

        try {
            await firebase.registrar(nombre,email,password);
            Router.push('/');
        } catch (error) {
            console.error('There was an error creating the user',error);
            guardarError(error.message);
        }
        
    }

    return (
    <div>
        <Layout>
            <>
                <h1 
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >Sign Up</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="nombre">Name:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Your Name"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre && <Error>{errores.nombre}</Error>}
                    <Campo>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Your email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}
                    <Campo>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}

                    {error && <Error>{error}</Error>}

                    <InputSubmit 
                        type="submit"
                        value="Create Account"
                    />

                </Formulario>
            </>
        </Layout>
    </div>
    )
}

export default CrearCuenta

import React, {useState} from 'react';
import Layout from '../components/layout/Layout'
import { css } from '@emotion/core'
import Router from 'next/router'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';
import firebase from '../firebase'

const STATE_INICIAL = {
    email: '',
    password: ''
}

const Login = () => {
    
    const [error, guardarError] = useState(false);
    const {valores, errores,handleSubmit,handleChange, handleBlur } = 
            useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

    const {email, password} = valores;

    async function iniciarSesion(){

        try {
            await firebase.login(email,password);
            Router.push('/');           
        } catch (error) {
            console.error('There was an error with the login',error);
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
                >Sign In</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
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
                        value="Login"
                    />

                </Formulario>
            </>
        </Layout>
    </div>
    )
}

export default Login

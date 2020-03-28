import React, {useState, useContext} from 'react';
import Layout from '../components/layout/Layout'
import { css } from '@emotion/core'
import Router, {useRouter} from 'next/router'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import Fileuploader from 'react-firebase-file-uploader'
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import {FirebaseContext} from '../firebase'
import Error404 from '../components/layout/404';



const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    // imagen: '',
    url: '',
    descripcion: ''
}



const NuevoProducto = () => {
    
    const [nombreimagen, guardarNombre] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [ progreso, guardarProgreso ] = useState(0);
    const [urlimagen, guardarUrlImagen] = useState('');

    const [error, guardarError] = useState(false);
    const {valores, errores,handleSubmit,handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const {nombre, empresa, imagen, url, descripcion} = valores;

    const router = useRouter();

    //context con las operaciones de firebase
    const { usuario, firebase }= useContext(FirebaseContext);



    async function crearProducto(){

        try {
            if(!usuario){
                return router.push('/login');
            }

            const producto = {
                nombre,
                empresa,
                url,
                urlimagen,
                descripcion,
                votos: 0,
                comentarios: [],
                creado: Date.now(),
                creador: {
                    id: usuario.uid,
                    nombre: usuario.displayName
                },
                haVotado: []
            }

            firebase.db.collection('productos').add(producto);
            return router.push('/');

        } catch (error) {
            console.error('There was an error creating the user',error);
            guardarError(error.message);
        }
        
    }

     const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleProgress = progreso => guardarProgreso({ progreso });

    const handleUploadError = error => {
        guardarSubiendo(error);
        console.error(error);
    };

    const handleUploadSuccess = nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombre(nombre)
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                guardarUrlImagen(url);
            } );
    };


    return (
    <div>
        <Layout>
        {usuario ? 
            (<>
                
                <h1 
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >New Product</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <fieldset>
                        <legend>General Information</legend>
                        <Campo>
                            <label htmlFor="nombre">Name:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Product Name"
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.nombre && <Error>{errores.nombre}</Error>}
                        <Campo>
                            <label htmlFor="empresa">Company:</label>
                            <input
                                type="text"
                                id="empresa"
                                name="empresa"
                                placeholder="Company"
                                value={empresa}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.empresa && <Error>{errores.empresa}</Error>}

                        <Campo>
                            <label htmlFor="imagen">Image:</label>
                            <Fileuploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                value={imagen}
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}

                            />
                        </Campo>
                        {errores.imagen && <Error>{errores.imagen}</Error>}

                        <Campo>
                            <label htmlFor="url">URL:</label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                placeholder="Product's URL"
                                value={url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.url && <Error>{errores.url}</Error>}

                    </fieldset>
                    <fieldset>
                        <legend>About your product</legend>
                        <Campo>
                            <label htmlFor="descripcion">Description:</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.descripcion && <Error>{errores.descripcion}</Error>}
                    </fieldset>
                        {error && <Error>{error}</Error>}

                        <InputSubmit 
                            type="submit"
                            value="Create Product"
                        />
                </Formulario>
            </>) : <Error404/>}
        </Layout>
    </div>
    )
}

export default NuevoProducto

import React, {useEffect, useContext, useState} from 'react';
import {useRouter} from 'next/router'
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';



const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: white;
    text-transform: uppercase;
    display: inline-block;
    text-align: center;
`;


const Producto = () => {

    // router para obtener el id actual
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConstltarDB] = useState(true);

    const {firebase, usuario} = useContext(FirebaseContext);


    const router = useRouter();
    const {query: {id}} = router;

    useEffect(()=>{
        if(id && consultarDB){
            const obtenerProducto = async ()=>{
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
               
                if(producto.exists){
                    guardarProducto(producto.data());
                    guardarConstltarDB(false);
                }
                else{
                    guardarError(true);
                    guardarConstltarDB(false);
                }
                
            }
            obtenerProducto();
        }
    },[id])

    if(Object.keys(producto).length===0 && !error) return 'loading....'

    const {  comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos , creador,haVotado} = producto;

    const votarProducto = () => {
        if(!usuario)
            router.push('/login')
        //obtener y sumar votos, poner en DB y actualizar el State
        const nuevoTotal = votos +1;

        //Verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return;

        const nuevoHaVotado = [...haVotado, usuario.uid];

        firebase.db.collection('productos').doc(id).update({votos: nuevoTotal, haVotado: nuevoHaVotado});

        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        guardarConstltarDB(true);
        
    }

    // funciones para guardar comentario
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    //Verifica si el creador del comentario es el mismo del producto
    const esCreador = id => {
        if(creador.id === id){
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();
        if(!usuario)
            router.push('/login')
        //info extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //Tomar copia del comentario y agregarlos al arrego
        const nuevosComentarios = [...comentarios, comentario];
        //Update DB
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        //Update state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConstltarDB(true);
    }

    const puedeBorrar = () => {
        if(!usuario) return false;
        if(creador.id === usuario.uid)
            return true;
        return false;    
    }

    const eliminarProducto = async () => {
        if(!usuario) router.push('/login');
        if(creador.id !== usuario.uid)
            router.push('/')
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
            
        }
    }

    return ( 
        <Layout>
            <>
                {error ? <Error404 /> : (
                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}>{nombre}</h1>
                    <ContenedorProducto>
                        <div>
                            <p>Published { formatDistanceToNow( new Date(creado) )} ago </p>
                            <p>Published by {creador.nombre} from {empresa}</p>
                            <img src={urlimagen} />
                            <p>{descripcion}</p>
                            
                            { usuario && (
                                <>
                                <h2>Comment -> </h2>
                                <form
                                    onSubmit={agregarComentario}
                                >
                                    <Campo>
                                        <input 
                                            type="text"
                                            name="mensaje"
                                            onChange={comentarioChange}
                                        />
                                    </Campo>
                                    <InputSubmit 
                                        type="submit"
                                        value="Add comment"
                                    />
                                </form>
                                </>
                            )}

                            <h2 css={css` margin: 2rem 0`}>Comments</h2>
                            {comentarios.length === 0 ? 'No comments yet' : (
                                <ul>
                                    {comentarios.map((comentario,i)=> (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>posted by: 
                                                <strong>{comentario.usuarioNombre}</strong>
                                            </p>
                                            { esCreador(comentario.usuarioId) && <CreadorProducto>Owner</CreadorProducto>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <aside>
                            <Boton 
                                target="_blank"
                                bgColor="true"
                                href={url}
                                >Visit URL</Boton>
                                
                                <div css={css`
                                    margin-top: 5rem;`}>
                                    <p css={css`text-align: center`}>{votos} votes</p>
                                    {usuario && <Boton
                                            onClick={votarProducto}
                                            >Vote</Boton>}
                                    
                                </div>
                        </aside>
                    </ContenedorProducto>
                    {puedeBorrar() && 
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>
                    }
                </div>
                )}
            </>
        </Layout>
     );
}
 
export default Producto;
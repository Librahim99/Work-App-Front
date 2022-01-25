import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getPosts, setFilters } from '../../actions/formEmpleador';
import { profileUser } from '../../actions/profileActions';
import OrdenadorDistancia from '../../helpers/distanciaPuntos';
import './Filtros.css'

export default function Filtros({}){

    const dispatch = useDispatch();


    const [filtro, setFiltro] = React.useState({
        Prioridad: '',
        maximo: 10,
    })

    
    const usuario = useSelector(state => state.profile.ownProfile); 
    const storePosts = useSelector(state => state.posts.allPosts); 
    

    // console.log("usuario filtros",usuario)
    React.useEffect(()=>{
        dispatch(getPosts()); 
    },[1])

 
    React.useEffect(()=>{
        async function setear(){
            if (usuario.usr_location){
            const ordenado = await OrdenadorDistancia(Filtrado(storePosts, filtro),usuario, filtro.maximo); 
            // console.log("ordenado", ordenado)
            dispatch(setFilters(ordenado.map(elemento => {return elemento.post})))
        }
        else {dispatch(setFilters(Filtrado(storePosts, filtro)))}
        }
        setear();
    },[filtro, storePosts])

    return(
        <div className='filtros_main'>
            <div>
                Prioridad: 
                <select onChange={(event)=>setFiltro({...filtro, Prioridad: event.target.value})}>
                    <option value=''>Todos</option>
                    <option value='Urgente'>Urgente</option>
                    <option value='Poco Urgente'>Poco Urgente</option>
                    <option value='Sin Urgencia'>Sin Urgencia</option>
                </select>
            </div>
            <div>
                Distancia: 
                <input type='range' min='2' max='60' value = {filtro.maximo} onChange={event=>setFiltro({...filtro, maximo: event.target.value})}/>
                <span>{filtro.maximo} km</span>
            </div>
        </div>
    )
}

function Filtrado(datos,filtros){
    if(filtros.Prioridad){datos = datos.filter((post)=> { if(post.post_priority) return post.post_priority === filtros.Prioridad})}
    return datos;
}
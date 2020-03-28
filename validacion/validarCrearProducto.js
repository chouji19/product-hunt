export default function validarCrearCuenta(valores) {

    let errores = {};

    // Validar el nombre del usuario
    if(!valores.nombre) {
        errores.nombre = "Name is required";
    }

    // validar empresa
    if(!valores.empresa) {
        errores.empresa = "Company is required"
    }
    
    // validar la url
    if(!valores.url) {
        errores.url = 'URL is required';
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "Wrong URL Format"
    }

    // validar descripción.
    if(!valores.descripcion) {
        errores.descripcion = "Description is required"
    }


    return errores;
}
export default function validarIniciarSesion(valores){

    let errores = {};


    if(!valores.email){
        errores.email = "email is required";
    }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = "Email is not valid"
    }

    if(!valores.password){
        errores.password = "email is required";
    }else if (valores.password.length<6){
        errores.password = "Password must have a minimum of 6 characters"
    }

    return errores;
}
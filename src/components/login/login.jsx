import './login.scss';
import React, {useState} from 'react';
import { useNavigate  } from "react-router-dom";

function Login() {
    const [showLoginError, setShowLoginError] = useState(false);
    const [loginForm, setLoginForm] = useState({
        user:'',
        password:''
    });

    const Navigate = useNavigate();

    const handleForm = (e) => {
        e.preventDefault();
        setShowLoginError(false);
        const name = e.target.name;
        const value = e.target.value;

        setLoginForm({
            ...loginForm,
            [name]: value
        });
    }

    const saveLogin = (e) => {
        e.preventDefault();
        if (loginForm.user === 'admin' && loginForm.password === 'fulbito123') {
            sessionStorage.setItem('isLoggedIn', true);
            Navigate("/next-team");
        } else {
            setShowLoginError(true);
        }
    }

    return (
        <>
        <div className='login-container'>
        <form className="login">
            <label>USUARIO</label>
            <input type='text' className="form-control" name="user" onChange={handleForm}/>
            <label>CONTRASEÑA</label>
            <input type='password' className="form-control" name="password" onChange={handleForm}/>
            <button className='btn btn-primary' onClick={saveLogin}>INGRESAR</button>
            {showLoginError &&
                <span className="alert alert-danger mt-2" style={{ display: 'block'}} role="alert">Error en usuario o contraseña</span>
            }
        </form>
        </div>
        </>
    )
}

export default Login
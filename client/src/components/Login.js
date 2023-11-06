import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login(){
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("")
    const navigate = useNavigate();

    function updateForm(value){
        return setForm((prev) => {
            return{...prev, ...value};
        });
    }
    async function onSubmit(e){
        e.preventDefault();
        const loginRequest = {...form};
        const res = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginRequest),
        });
        const nerror = await res.json();
        var check = nerror.token;
        if (check === "Improper credentials"){
            setError(check);
        } else {
            sessionStorage.setItem('token', JSON.stringify(nerror));
            navigate('/main');
            window.location.reload(false);
        }
    }
    async function register(e){
        e.preventDefault();
        const registerRequest = {...form};
        const res = await fetch("/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerRequest),
        });
        const nerror = await res.json();
        if ( nerror.token === "Username Taken"){
            setError(nerror.token);
        } else {
            sessionStorage.setItem('token', JSON.stringify(nerror));
            navigate('/main');
            window.location.reload(false);
        }
    }
    function Error(){
        return(
            <p>{error}</p>
        )
    }

    return (
        <div>
            <h1>Capacity Analyzer</h1>
            <div class="login-page">
                <div class="form">
                    <h2>Log In</h2>
                    <form class="register-form">
                        <input type="text" placeholder="First name"/>
                        <input type="text" placeholder="Last name"/>
                        <input type="text" placeholder="Email Address"/>
                        <input type="password" placeholder="Password"/>
                        <button>create</button>
                        <p class="message">Already registered? <a href="#">Sign In</a></p>
                        </form>
                        <form class="login-form">
                        <input type="text" placeholder="username"/>
                        <input type="password" placeholder="password"/>
                        <button>login</button>
                        <p class="message">Not registered? <a href="#">Create an account</a></p>
                    </form>
                </div>
                </div>
            <Error />
        </div>
    )
}

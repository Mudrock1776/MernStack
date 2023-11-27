import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

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

    const [reg, setReg] = useState("");

    function toggleLogin() {
        setReg("");
    }

    function toggleRegister() {
        setReg("a");
    }

    function formType() {

        if (reg == "") {
            var output = (
                <div>
                    <form class="login-form">
                        <h2>Log In</h2>
                        <input type="text" placeholder="Email" value={form.username} onChange={(e) => updateForm({username: e.target.value})}/>
                        <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateForm({password: e.target.value})}/>
                        <button onClick={(e) => {onSubmit(e);}}>login</button>
                        <p class="message">Not registered? <a href="#" onClick={() => toggleRegister()}>Create an account</a></p>
                    </form>
                </div>
            )
        } else {
            var output = (
                <div>
                    <form class="register-form">
                        <h2>Sign Up</h2>
                        <input type="text" placeholder="Email" value={form.username} onChange={(e) => updateForm({username: e.target.value})}/>
                        <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateForm({password: e.target.value})}/>
                        <button onClick={(e) => {register(e);}}>create</button>
                        <p class="message">Already registered? <a href="#" onClick={() => toggleLogin()}>Log In</a></p>
                    </form>
                </div>
            )
        }

        return output
    }

    return (
        <div>
            <div class = "login-page">
                <h1>Capacity Analysis</h1>
                <div class = "form">
                    {formType()}
                </div>
            </div>
            <Error />
        </div>
    )
}

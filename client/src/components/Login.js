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

    return (
        <div>
            <form>
                <label>UserName</label><input type="text" value={form.username} onChange={(e) => updateForm({username: e.target.value})} /><br />
                <label>password</label><input type="text" value={form.password} onChange={(e) => updateForm({password: e.target.value})} /><br />
                <button onClick={(e) => {onSubmit(e);}}>Login</button><button onClick={(e) => {register(e);}}>register</button>
            </form>
            <Error />
        </div>
    )
}

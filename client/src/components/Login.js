import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import "../styles.css";

export default function Login(){
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const validateEmail = (e) => {
      const email = e.target.value;
      updateForm({email: e.target.value});
  
      if (validator.isEmail(email)) {
        setMessage("");

      } else {
        setMessage("Please, enter valid Email!");
      }
    };



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
        } else if ( nerror.token === "Email"){
            setError(nerror.token);
        } else if ( nerror.token === "All fields are required"){
            setError(nerror.token);
        } else if ( nerror.token === "Invalid Email"){
            setError(nerror.token);
        } else {
            sessionStorage.setItem('token', JSON.stringify(nerror));
            navigate('/main');
            window.location.reload(false);
        }
    }
    function Error(){
        return(
            <span
                style={{
                fontWeight: "bold",
                color: "red"
                }}
            >
                <p>{error}</p>
            </span>
        )
    }

    const [reg, setReg] = useState("");

    function toggleLogin() {
        setReg("");
        updateForm({email: ""});
        updateForm({username: ""});
        updateForm({password: ""});
    }

    function toggleRegister() {
        setReg("a");
        updateForm({email: ""});
        updateForm({username: ""});
        updateForm({password: ""});
    }

    function formType() {

        if (reg == "") {
            var output = (
                <div>
                    <form class="login-form">
                        <h2>Log In</h2>
                        <input type="text" placeholder="Username" value={form.username} onChange={(e) => updateForm({username: e.target.value})}/>
                        <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateForm({password: e.target.value})}/>
                        <button onClick={(e) => {onSubmit(e);}}>Login</button>
                        <p class="message">Not registered? <a href="#" onClick={() => toggleRegister()}>Create an account</a></p>
                    </form>
                </div>
            )
        } else {
            var output = (
                <div>
                    <form class="register-form">
                        <h2>Sign Up</h2>
                        {/* <input type="text" placeholder="Email" value={form.username} onChange={(e) => updateForm({username: e.target.value})}/> */}
                        <span
                            style={{
                            fontWeight: "bold",
                            color: "red"
                            }}
                        >
                            {message}
                        </span>
                        <input type="text" placeholder="Email" value={form.email} onChange={(e) => validateEmail(e)}/>
                        <input type="text" placeholder="Username" value={form.username} onChange={(e) => updateForm({username: e.target.value})}/>
                        <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateForm({password: e.target.value})}/>
                        <button onClick={(e) => {register(e);}}>Create</button>
                        <p class="message">Already registered? <a href="#" onClick={() => toggleLogin(e)}>Log In</a></p>
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
                    <Error />
                </div>
            </div>
        </div>
    )
}

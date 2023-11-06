import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}
export default function Create(){
    const user = getToken();
    const [form, setForm] = useState({
        user: user,
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
    });
    const navigate = useNavigate();
    function updateForm(value){
        return setForm((prev) => {
            return { ...prev, ...value};
        });
    }

    async function onSubmit(e){
        e.preventDefault();

        const newContact = { ...form};

        await fetch("/contact/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newContact),
        });

        setForm({
            user: user,
            firstname: "",
            lastname: "",
            email: "",
            phonenumber: "",
        });
        navigate("/main");
    }

    return(
        <div>
            <h3>Create new Contact</h3>
            <form onSubmit={onSubmit}>
                <label>firstname</label><input type="text" value={form.firstname} onChange={(e) => updateForm({ firstname: e.target.value})}/><br/>
                <label>lastname</label><input type="text" value={form.lastname} onChange={(e) => updateForm({ lastname: e.target.value})}/><br/>
                <label>email</label><input type="text" value={form.email} onChange={(e) => updateForm({ email: e.target.value})}/><br/>
                <label>phonenumber</label><input type="text" value={form.phonenumber} onChange={(e) => updateForm({ phonenumber: e.target.value})}/><br/>
                <input type="submit" value="create contact" />
            </form>
        </div>
    );
}
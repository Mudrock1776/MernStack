import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

export default function Edit(){
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
    });
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            const res = await fetch(`/contact/${params.id.toString()}`);

            if (!res.ok) {
                const message = `An error has occured: ${res.statusText}`;
                window.alert(message);
                return;
            }

            const record = await res.json();
            if(!record) {
                window.alert(`record with id ${id} not found`);
                return;
            }

            setForm(record);
        }
        fetchData();
        return;
    }, [params.id]);

    function updateForm(value){
        return setForm((prev) => {
            return {...prev, ...value};
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const editContact = {
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            phonenumber: form.phonenumber,
        };

        await fetch(`/contact/update/${params.id}`, {
            method: "POST",
            body: JSON.stringify(editContact),
            headers: {
                'Content-Type': 'application/json'
            },
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
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

const Contact = (props) => (
    <div>
        <p>Name: {props.contact.firstname} {props.contact.lastname}</p>
        <p>Email: {props.contact.email}</p>
        <p>phonenumber: {props.contact.phonenumber}</p>
        <Link to={`/edit/${props.contact._id}`}>Edit</Link>
        <button onClick={() => {props.deleteRecord(props.contact._id);}}>Delete</button>
    </div>
);

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}

export default function Main() {
    const [records, setRecords] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
        async function getRecords() {
            const user = getToken();
            const res = await fetch(`/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: user,
                }),
            });
            if (!res.ok) {
                const msg = `An error occurred: ${res.statusText}`;
                window.alert(msg);
                return;
            }
            const records = await res.json();
            setRecords(records);
        }
        getRecords();
        return;
    }, [records.length]);

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    async function deleteRecord(ID) {
        console.log(ID);
        const res = await fetch('/contact/delete', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: ID
            }),
        });
        const newRecords = await res.json();
        console.log(newRecords);
        setRecords(newRecords);
        list();
    }

    function list() {
        const Filter = searchInput;
        if (Filter.length > 0){
            return records.map((record) => {
                if (record.firstname.match(Filter)){
                    return(
                    <Contact contact = {record} deleteRecord= {() => deleteRecord(record._id)}/>
                    );
                }
            });
        } else {
            return records.map((record) => {
                return(
                    <Contact contact = {record} deleteRecord= {() => deleteRecord(record._id)} />
                );
            });
        }
    }

    return (
        <div>
            <input type="text" placeholder="Search Here" onChange={handleChange} value={searchInput} />
            <h3>contacts</h3>
            <div>{list()}</div>
        </div>
    );
}
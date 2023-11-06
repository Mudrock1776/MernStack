import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return(
        <div>
            <table>
                <tr>
                    <td><NavLink to="/main">Home</NavLink></td>
                    <td><NavLink to="/create">Create Contact</NavLink></td>
                    <td><NavLink to="/logout">logout</NavLink></td>
                </tr>
            </table>
        </div>
    );
}
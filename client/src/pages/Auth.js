import "../assets/CSS/Auth.css";
import Login from "./Login";
import Register from "./Register";
import {useState} from 'react';

export const Auth=()=>{
    let [login,setlogin]=useState(true);
    console.log(login);

    function logForm(){
        console.log("hi from logForm");
        setlogin(true);
    } 

    function regForm(){
        setlogin(false);
    }

    return (
        <div className="auth-page">
            <div className="auth-toggle">
                <button className={login ? "auth-tab active" : "auth-tab"} onClick={logForm}>Login</button>
                <button className={!login ? "auth-tab active" : "auth-tab"} onClick={regForm}>Register</button>
            </div>
            <div className="auth-panel">
                {login? <Login/>:<Register/>}
            </div>
        </div>
    )
}
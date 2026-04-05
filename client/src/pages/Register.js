import "../assets/CSS/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Register=()=>{
    const navigate = useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [pass, setPass]=useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    async function sendRegInfo(){
        if (status === "loading") return;
        setStatus("loading");
        setMessage("Please wait, processing...");
        setTimeout(async () => {
            try{
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                if (name) {
                    await updateProfile(userCredential.user, { displayName: name });
                }
                setStatus("success");
                setMessage("Registration successful! Redirecting...");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }catch(err){
                console.log(err);
                if (err?.code === "auth/email-already-in-use") {
                    setStatus("error");
                    setMessage("You are already registered. Please log in.");
                    return;
                }
                setStatus("error");
                setMessage("Registration failed. Please try again.");
            }
        }, 2000);
    }

    return (
        <div className="auth-card">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Join your local response network in minutes.</p>
            <div className="auth-form">
                <label>Name</label>
                <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e)=>{setName(e.target.value);}}
                />
                <label>Email</label>
                <input 
                    type="text" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value);}}
                />
                <label>Password</label>
                <input 
                    type="password" 
                    placeholder="Give a password"
                    value={pass}
                    onChange={(e)=>{setPass(e.target.value);}}        
                />
                {message && (
                    <div className={`auth-message ${status}`} role="status">
                        {message}
                    </div>
                )}
                <button className="auth-submit" onClick={sendRegInfo} disabled={status === "loading"}>
                    {status === "loading" ? "Please wait..." : "Register"}
                </button>
            </div>
        </div>
    )
}

export default Register;
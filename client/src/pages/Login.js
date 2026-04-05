import "../assets/CSS/Login.css";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { changeRole} from "../store/roleSlice";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login=()=>{
    const apiBase = process.env.REACT_APP_API_URL || (
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://helpconnect-dms.onrender.com'
    );
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    async function sendLogInfo(e){
       e.preventDefault();
       if (status === "loading") return;
       setStatus("loading");
       setMessage("Please wait, processing...");
       setTimeout(async () => {
           try{
               const userCredential = await signInWithEmailAndPassword(auth, email, password);
               const firebaseUser = userCredential.user;
                const user = {
                    UserID: firebaseUser.uid,
                    Name: firebaseUser.displayName || "",
                    Email: firebaseUser.email || "",
                    UserType: ["affected"],
                };
                dispatch(setUser({ user, token: firebaseUser.accessToken }));
                dispatch(changeRole({ role: user.UserType, loggedIn: true, isAdmin: false }));
                setStatus("success");
                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
           }catch(error){
            console.log(error);
            setStatus("error");
            setMessage("Login failed. Please check your credentials.");
           }
       }, 2000);
    }

    async function signInWithGoogle(){
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const response = await fetch(`${apiBase}/auth/firebase-sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || ""
                })
            });
            const data = await response.json();
            if (response.status === 200) {
                dispatch(setUser({ user: data.user, token: data.token }));
                const role = {
                    role: data.user.UserType,
                    loggedIn: true,
                    isAdmin: data.user.UserType.includes("admin")
                };
                dispatch(changeRole(role));
                navigate("/");
            } else {
                alert(data.error || "Google sign-in failed");
            }
        } catch (error) {
            console.log(error);
            alert("Google sign-in failed. Please try again.");
        }
    }

    return (
        <div className="auth-card">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Log in to stay updated with local incidents.</p>
            <form className="auth-form" onSubmit={sendLogInfo}>
                <label htmlFor="loginEmail">Email</label>
                <input 
                    id="loginEmail" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value);}}
                />
                <label htmlFor="loginPass">Password</label>
                <input 
                    id="loginPass" 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value);}}    
                />
                {message && (
                    <div className={`auth-message ${status}`} role="status">
                        {message}
                    </div>
                )}
                <button type="submit" className="auth-submit" disabled={status === "loading"}>
                    {status === "loading" ? "Please wait..." : "Log In"}
                </button>
                <div className="auth-divider">
                    <span>or</span>
                </div>
                <button type="button" className="auth-google" onClick={signInWithGoogle} disabled={status === "loading"}>
                    Continue with Google
                </button>
            </form>
        </div>
    )
}

export default Login;
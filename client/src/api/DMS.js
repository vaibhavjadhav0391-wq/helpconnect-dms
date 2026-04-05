// need to install axios. 
//npm install axios
// please check if the baseurl is the correct one here 

import axios from "axios";

const DMS= axios.create({
    baseURL: process.env.REACT_APP_API_URL || (
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://helpconnect-dms.onrender.com'
    ),
    headers:{
        "Content-Type":"application/json"
    }
    
}); 

export default DMS; 
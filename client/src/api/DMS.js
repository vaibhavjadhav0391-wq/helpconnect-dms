// need to install axios. 
//npm install axios
// please check if the baseurl is the correct one here 

import axios from "axios";

const DMS= axios.create({
    baseurl:"process.env.REACT_APP_API_URL",
    headers:{
        "Content-Type":"application/json"
    }
    
}); 

export default DMS; 
import axios from "axios"
const URL=import.meta.env.VITE_BACKEND_URL
export const loginApi = async (payload)=>{
    try{
       const response = await axios.post(`${URL}/api/v1/login`,payload);
       return response;
    }
    catch(err){
       console.log(err);
       return err;
    }

}

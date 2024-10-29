import axios from "axios"
export const registerApi = async (payload)=>{
    const URL=import.meta.env.VITE_BACKEND_URL
    console.log(URL)
    try{
       const response = await axios.post(`${URL}/api/v1/sign-in`,payload);
       return response;
    }
    catch(err){
       console.log(err);
       return err;
    }

}
import axios from "axios"

export const getUserProfileApi = async(userId,token)=>{
    try{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/profile`,{"userId":userId},{headers})
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}
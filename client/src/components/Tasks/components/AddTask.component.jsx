import React, { useEffect, useState } from 'react'
import "./style.css"
import { addTaskApi } from '../API/api';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { getUserProfileApi } from '../../Navbar/Api/api';
export default function AddTask({setAddTask,recallFunction,getUserProfile}) {
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [payload,setPayload] = useState(null);
  const [loader,setLoader] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');


  const addTask = useQuery({
    queryKey: ["addTask",payload],
    queryFn: () => addTaskApi(payload,token,userId),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: payload!=null && userId!==null && token!==null,
    onSuccess:(response)=>{
        let message = '';
        if(response.status===200){
            message=response?.data?.message;
            toast.success(message);
            setAddTask(false);
            recallFunction.refetch();
            getUserProfile.refetch();
        }
        else{
            message=response?.response?.data?.message;
            toast.error(message);
        }

    },
    onError:(err)=>{
        toast.error(err);
    }
    });

    
    useEffect(()=>{
        setLoader(addTask?.isFetching)
    },[addTask?.isFetching])

  const handleSubmit=()=>{
    const payload = {"title":title,"desc":description};
    setPayload(payload);
  }
  return (
    <>
        <div className='add_task_container'></div>
        <div className='add_task_inner_container'>
            <div className='input_text_area_container'>
                <div className='input_text_area_inner_container'>
                    <h3>Add Task </h3>
                    <div className='inside_container'>
                        <span className='insider_title'>Title </span>
                        <input className='input_task_style' type="text"value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder='Title'></input>
                    </div>
                    <div className='insider_container'>
                        <span className='insider_title'>Description </span>
                        <textarea type="text" 
                        rows={10}
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        className='text_area_style'
                        placeholder='Description'></textarea>
                    </div>
                </div>

                {loader && <div style={{display:'flex',justifyContent:'center'}}><ClipLoader/></div>}
                {!loader && <div className='button_container'>
                    
                    <button className='save_btn' type="button" style={{cursor:'pointer',opacity:(title==='' || description==='')?0.7:1,}}
                     onClick={handleSubmit} disabled={title==='' || description===''}>Save</button>
                    <button className='close_btn'style={{cursor:'pointer',
                     
                    }} onClick={()=>{setAddTask(false)}}>Cancel</button>
                </div>}

            </div>
        </div>
    </>
  )
}

import moment from 'moment'
import React from 'react'

export default function ViewTask({setViewDetails,task}) {
  const {title,desc,createdAt} = task
  return (
    <>
        <div className='add_task_container'></div>
        <div className='add_task_inner_container'>
            <div className='input_text_area_container'>
                <div className='input_text_area_inner_container'>
                    <h3>Task Details </h3>
                    <div className='inside_col_container'>
                        <span className='insider_title'>Title: </span>
                        <span className='insider_view_title' style={{color:'black'}}>{title}</span>
                    </div>
                    <div className='insider_col_container'>
                        <span className='insider_title'>Description: </span>
                        <span className='insider_view_title'>{desc} </span>
                    </div>
                    <span className='insider_title'>Created at: {moment(createdAt).format('DD/MM/YYYY, HH:MM:SS')} </span>
                </div>
                <div className='button_container'
                     onClick={()=>{setViewDetails(false)}}>
                    <button className='save_btn'style={{cursor:'pointer'}} >Close</button>
                </div>

            </div>
        </div>
    </>
  )
}

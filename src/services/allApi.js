import { commonApi } from "./commonApi"
import { serverUrl } from "./serverUrl"


export const addTodoApi = async(reqBody)=>{
    return await commonApi("POST",`${serverUrl}/add-todo`,reqBody)
}

export const getTodoApi = async()=>{
    return await commonApi("GET",`${serverUrl}/view-todo`)
}

export const toggleTodoStatusApi = async (id) => {
    return await commonApi("PUT", `${serverUrl}/toggle-status/${id}`, {});
  };

export const deleteTodoApi = async (id) =>{
    return await commonApi("DELETE",`${serverUrl}/delete-todo/${id}`)
}
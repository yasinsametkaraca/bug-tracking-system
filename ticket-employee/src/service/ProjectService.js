import axios from "axios";

const apiPath = "http://192.168.2.17:5000/";

export default {
    getProject(){
        return axios.get(apiPath + 'api/Project/ProjectSummary')
    },
    updateProject(string){
        return axios.put(apiPath + 'api/Project/UpdateProject', string)
    },
    addProject(string){
        return axios.post(apiPath + 'api/Project/AddProject', string)
    },
    getCustomerRequest(){
        return axios.get(apiPath + 'api/CustomerRequest/CustomerRequestSummary')
    },
    deleteProject(id){
        return axios.delete(apiPath + 'api/Project/DeleteProject?id=' + id)
    },
    getListWithId(id){
        return axios.get(apiPath + 'api/Project/GetById?projectId=' + id)
    }
}

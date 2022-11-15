import axios from "axios";

const apiPath = "http://192.168.2.17:5000/";

export default {
    getUserList(){
        return axios.get(apiPath + 'api/User/UserSummary')
    },
    getUserListById(id){
        return axios.get(apiPath + 'api/User/GetById?userId=' + id)
    },
    addUser(user){
        return axios.post(apiPath + 'api/User/AddUser', user)
    },
    updateUser(user){
        return axios.put(apiPath + 'api/User/UpdateUser', user)
    },
    deleteUser(id){
        return axios.delete(apiPath + 'api/User/DeleteUser?id=' + id)
    }
}

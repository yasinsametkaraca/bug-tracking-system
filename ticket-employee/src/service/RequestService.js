import axios from "axios";
const apiPath = "http://192.168.2.17:5000/";
export default {
    getRequest(){
        return axios.get(apiPath + 'api/UserRequest/UserRequestSummary')
    },

}

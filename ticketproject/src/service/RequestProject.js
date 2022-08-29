import axios from "axios";
const apiPath ="http://192.168.2.17:5000/"


export default {

    getProjectSummary() {
        return axios.get(apiPath + 'api/Project/ProjectSummary')
    }
}
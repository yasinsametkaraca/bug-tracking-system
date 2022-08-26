import axios from "axios";


const apiPath ="http://192.168.2.17:5000/"


export default {


    getErrorListById(id){
        return axios.get(apiPath+'api/CustomerRequest/GetByCustomerById?customerId='+id)
    },
    getErrorById(id){
        return axios.get(apiPath+'api/CustomerRequest/GetById?requestId='+id)
    },
    customerLogin(request){
        return axios.post(apiPath + 'api/Customer/Login',request)
    },
    addRequest(request){
        return axios.post(apiPath +'api/CustomerRequest/AddRequest', request)
    },
    deleteRequest(id){
        return axios.delete(apiPath +'api/CustomerRequest/DeleteCustomerRequest?id='+id)
    },
    updateRequest(request){
        return axios.put(apiPath +'api/CustomerRequest/UpdateRequest',request)

    }

}
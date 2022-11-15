import axios from "axios";

const apiPath = "http://192.168.2.17:5000/";

export default {
    getCustomer(){
        return axios.get(apiPath + 'api/Customer/CustomerSummary')
    },
    getCustomerById(id){
        return axios.get(apiPath + 'api/Customer/GetById?customerId=' + id)
    },
    addCustomer(customer){
        return axios.post(apiPath + 'api/Customer/AddCustomer', customer)
    },
    updateCustomer(customer){
        return axios.put(apiPath + 'api/Customer/UpdateCustomer', customer)
    },
    deleteCustomer(id){
        return axios.delete(apiPath + 'api/Customer/DeleteCustomer?id='+id)
    }
}

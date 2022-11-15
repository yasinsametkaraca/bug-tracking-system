<template>
  <PvDialog class="dialog" :header="processType === 1 ? 'Müşteri Ekle' : 'Müşteri Güncelle'"
            :value="customerList" @update:visible="closeDialog(false)" :visible="true"
            :breakpoints="{'1980px': '30vw','960px':'60vw'}" :modal="true">
    <form>
      <div>
        <span class="p-float-label">
            <InputText id="name" type="text" v-model="customerList.name" />
            <label for="CustomerName">Müşteri Adı</label>
        </span>
        <span class="p-float-label">
            <InputText id="email" type="text" v-model="customerList.email" />
            <label for="CustomerEmail">Email</label>
        </span>
        <span class="p-float-label">
            <InputText id="phone" type="text" v-model="customerList.phone" />
            <label for="CustomerPhone">Telefon</label>
        </span>
        <span class="button" >
        <PvButton :label="processType===1 ? 'Ekle' : 'Güncelle'" class="p-button-success" @click="saveCustomer"/>
          </span>
      </div>
    </form>
  </PvDialog>
</template>

<script>
import {ref, onMounted} from "vue";
import CustomerService from "@/service/CustomerService";
import {useToast} from "primevue/usetoast";

export default {
  props: {
    processType: {
      required: true,
    },
    customerId: {
      required: true,
      type: Number
    },
    closeDialog: {}
  },
  setup(props){

    const customerList = ref({});
    const toast = useToast();

    ////////getCustomerListById///////////////////////////////////////////////////////////////
    const getCustomerListId = () =>{
      CustomerService.getCustomerById(props.customerId)
          .then((res) =>{
            if (res.data.success){
              customerList.value = res.data.payload
            }else
              toast.add({severity:'error', summary: 'Error', detail:res.data.information, life: 3000});
          })
    }

    ///////saveCustomer///////////////////////////////////////////////////////////////////////
    const saveCustomer = () =>{
      if(props.processType === 1){
        CustomerService.addCustomer(customerList.value)
            .then((res)=>{
              if(res.data.success){
                props.closeDialog(true)
              }
            })
      }else if (props.processType === 2){
        CustomerService.updateCustomer(customerList.value)
            .then((res)=>{
              if(res.data.success){
                props.closeDialog(true)
              }
            })
      }
    }

    onMounted(async ()=>{
      if(props.processType === 2) await getCustomerListId()
    })
    return{
      saveCustomer,

      customerList,
    }
  }
}
</script>

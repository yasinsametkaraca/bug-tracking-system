<template>
  <div>
    <div class="card">
      <DataTable :value="customerList" context-menu v-model:contextMenuSelection="selectedCustomer"
                 selectionMode="single" :scrollable="true" scrollHeight="400px"
                 @rowContextmenu="onRowContextMenu" v-model:filters="filters">
        <template #header>
          <div class="header-request ">
          <span>
            <h2 class="m-0">Firmalar Listesi</h2>
          </span>
            <span class="p-input-icon-left">
            <i class="pi pi-search"/>
            <InputText v-model="filters['global'].value" placeholder="Ara"/>
          </span>
          </div>
        </template>
        <PvColumn field="name" header="Firma İsmi" style="min-width:200px">
          <template #body="{data}">
            {{data.name}}
          </template>
          <template #filter>
            <InputText type="text" v-model="filters['definition'].value"/>
          </template>
        </PvColumn>
        <PvColumn field="CustomerEmail" header="Email" style="min-width:200px">
          <template #body="{data}">
            {{data.email}}
          </template>
        </PvColumn>
        <PvColumn field="CustomerPhone" header="Telefon" style="min-width:200px">
          <template #body="{data}">
            {{data.phone}}
          </template>
        </PvColumn>
        <template #empty>
          Kullanıcı bulunamadı.
        </template>
      </DataTable>
      <customer-comp v-if="customerDialog" :customerId="selectedCustomer.id" :processType="processType"
                     :closeDialog="closeDialog"/>
      <ContextMenu :model="menuModel" ref="cm"/>
    </div>
  </div>
</template>
<script>

import axios from "axios";
import {ref, onMounted} from "vue";
import CustomerComp from "@/components/Customers/CustomerComp";
import CustomerService from "@/service/CustomerService";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import {FilterMatchMode} from "primevue/api";

export default {
  components: {CustomerComp},
  setup(){
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const customerList = ref(null);
    const cm = ref();
    const toast = useToast();
    const processType = ref(1);
    const confirm = useConfirm();
    const selectedCustomer = ref(null);
    const customerDialog = ref(false);
    const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});

    const menuModel = ref([
      {label:'Ekle', icon:'pi pi-fw pi-search', command: () => openDialog(1)},
      {label:'Güncelle', icon:'pi pi-fw pi-circle', command: () => openDialog(2)},
      {label:'Sil', icon:'pi pi-fw pi-times', command: () => deleteCostomer()}
    ])

    const openDialog = (type) =>{
      processType.value = type;
      customerDialog.value = true;
    }
    const closeDialog = (refresh) =>{
      customerDialog.value = false;
      if(refresh){
        getCustomerList()
      }
    }
    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    }

    ////////getCutomerList////////////////////////////////////////////////////////////////
    const getCustomerList = () =>{
      CustomerService.getCustomer()
          .then((res) =>{
            if (res.data.success){
              customerList.value = res.data.payload
            }else
              toast.add({severity:'error', summary: 'Error', detail:res.data.information, life: 3000});

          }).catch((err) => {
        console.log("error")
        console.log(err);
      })}

    //////////deleteCustomer/////////////////////////////////////////////////////////////
    const deleteCostomer = () =>{
      confirm.require({
        message: 'Firmayı silmek istediğinizden emin misiniz?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          CustomerService.deleteCustomer(selectedCustomer.value.id)
              .then((response)=>{
                if(response.data.success){
                  getCustomerList()
                  toast.add({severity:'success', summary:'Başarılı', detail:'Firma silindi', life: 3000});
                }

              })
        },
      });
    }

    onMounted(() =>{
      getCustomerList();
    })
    return{
      customerList, selectedCustomer, menuModel, cm, customerDialog, processType, filters,

      openDialog, closeDialog, onRowContextMenu
    }
  }
}
</script>

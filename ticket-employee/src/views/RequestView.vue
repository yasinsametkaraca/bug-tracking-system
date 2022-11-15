<template>
  <div>
    <Toast>
      <DataTable class="p-datatable-request p-datatable-hoverable-rows " :value="requestList" context-menu
                 v-model:selection="selectedRequest" selectionMode="single" @rowContextmenu="onRowContextMenu"
                 responsiveLayout="scroll" :rows="10" :rowHover="true" v-model:expandedRows="expandedRows"
                 v-model:filters="filters">
        <template #header>
          <div class="header-request ">
          <span>
            <h2 class="m-0">İstekler Listesi</h2>
          </span>
            <span class="p-input-icon-left">
            <i class="pi pi-search"/>
            <InputText v-model="filters['global'].value" placeholder="Ara"/>
          </span>
          </div>
        </template>
        <PvColumn :expander="true" headerStyle="width: 3rem"/>
        <PvColumn  field="definition" header="Proje İsmi" sortable style="min-width: 12rem">
          <template #body="{data}">
            {{data.definition}}
          </template>
          <template #filter>
            <InputText type="text" v-model="filters['definition'].value" class="p-column-filter"/>
          </template>
        </PvColumn>
        <PvColumn field="errorTitle" header="Hata İsmi" sortable style="min-width: 12rem">
          <template #body="{data}">
            {{data.errorTitle}}
          </template>
          <template #filter>
            <InputText type="text" v-model="filters['errorTitle'].value" class="p-column-filter"/>
          </template>
        </PvColumn>
        <PvColumn field="name" header="Müşteri" sortable style="min-width: 12rem">
          <template #body="{data}">
            {{data.name}}
          </template>
          <template #filter>
            <InputText type="text" v-model="filters['name'].value" class="p-column-filter"/>
          </template>
        </PvColumn>
        <PvColumn field="createDate" datatype="date" header="Oluşturulma Tarihi" sortable style="min-width: 12rem">
          <template #body="{data}">
            {{editDate(data.createDate)}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </PvColumn>
        <PvColumn field="userNameSurname" header="Kullanıcı" sortable style="min-width: 12rem">
          <template #body="{data}">
            {{data.userNameSurname}}
          </template>
          <template #filter>
            <InputText type="text" v-model="filters['userNameSurname'].value" class="p-column-filter"/>
          </template>
        </PvColumn>
        <PvColumn field="status" header="Durumu" sortable style="min-width: 12rem">
          <template #body="{data}">
            {{editStatus(data.status)}}
          </template>
          <template #filter>
            <InputText type="text" v-model="filters['status'].value" class="p-column-filter"/>
          </template>
        </PvColumn>
        <template #expansion="slot">
          <div style="">
            <h4 style="margin: 0px; padding:0px">{{slot.data.moduleDefinition}}</h4>
            <p style="display: inline-block; word-break: break-word;"> {{slot.data.errorDescription}}</p>
          </div>
        </template>
        <template #empty>
          Hata bulunamadı.
        </template>
      </DataTable>
      <UpdateRequestComp v-if="dialogList[1]" :requestId="selectedRequest.Id" :closeDialog="closeDialog"/>
      <UpdateUserRequestComp v-if="dialogList[2]" :requestId="selectedRequest.Id" :closeDialog="closeDialog"/>
      <ContextMenu :model="menuModel" ref="cm"></ContextMenu>
    </Toast>
  </div>
</template>

<script>
import axios from "axios";
import {ref, onMounted} from "vue";
import UpdateRequestComp from "@/components/Requests/UpdateRequestComp";
import UpdateUserRequestComp from "@/components/Requests/UpdateUserRequestComp";
import { useToast } from 'primevue/usetoast';
import RequestService from "@/service/RequestService";
import {FilterMatchMode} from "primevue/api";
export default {
  components: {UpdateUserRequestComp, UpdateRequestComp},
  setup(){
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const menuModel = ref([
      {label:'Düzelt', icon:'pi pi-fw pi-spinner', command: () => openDialog(1)},
      {label:'Kullanıcı Ata', icon:'pi pi-fw pi-user', command: () => openDialog(2)}
    ]);
    const toast = useToast();
    const cm = ref();
    const dialogList = ref([])
    const expandedRows = ref([])
    const selectedRequest = ref(null);
    const requestList = ref(null);
    const requestDialog = ref(false);
    const projectList = ref(null);
    const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});

    const getStatus = ([
      {name: 'waiting', Id:0},
      {name: 'working', Id:1},
      {name: 'upgrading', Id:2},
      {name: 'runningest', Id:3},
      {name: 'finishing', Id:4}
    ])

    const openDialog = (index) =>{
      dialogList.value[index] = true;
    }
    const closeDialog = (index) => {
      dialogList.value[index] = false;
      getRequestList();
    }
    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    }

    ///////editStatus/////////////////////////////////////////////////////////////////////////////
    const editStatus = (pvstatus) =>{
      const errorStatus = getStatus.filter((error) => error.Id == pvstatus);
      const errStatus = errorStatus && errorStatus.length>0 ? errorStatus[0].name : 'Undefined';
      return errStatus;
    }

    ////////editDate////////////////////////////////////////////////////////////////////////////////
    const editDate = (value) =>{
      return new Date(value).toLocaleDateString('en-US',{
        day: "2-digit",
        month: "2-digit",
        year: "numeric",}
      )}

    /////////////getRequestList/////////////////////////////////////////////////////////////////////
    const getRequestList = async () =>{
      RequestService.getRequest()
          .then((res)=>{
            if(res.data.success){
              requestList.value = res.data.payload
            }else
              toast.add({severity:'error', summary: 'Error', detail:res.data.information, life: 3000});
          }).catch((err) => {
        console.log("error", err);
      })}

    onMounted(() =>{
      getRequestList()
    })
    return{
      requestList, menuModel, requestDialog, cm,dialogList, selectedRequest,expandedRows, projectList, filters,

      openDialog, closeDialog, onRowContextMenu, editDate, editStatus
    }
  }
}
</script>
<style>
.header-request{
  display:flex;
  justify-content: space-between;

}
</style>

<template>
  <div>
    <Toast>
      <div class="shadow-2">
        <PvDataTable
                     v-model:filters="filters1"
                     :scrollable="true"
                     scrollHeight="550px"
                     scrollDirection="Both"
                     class="p-datatable-hoverable-rows p-datatable-request "
                     :value="errorList"
                     context-menu v-model:context-menu-selection="selectedError"
                     @rowContextmenu="onRowContextMenu"
                     responsiveLayout="scroll"
                     v-model:expandedRows="expandedRows">
          <template #header>
            <div class="flex justify-content-between">
              <span>
                <h4>Hata Listesi</h4>
              </span>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters1['global'].value" placeholder="Ara" />
              </span>
            </div>
          </template>
          <PvColumn :expander="true" headerStyle="max-width: 3rem" style="max-width:3rem" />
          <PvColumn field="errorTitle" header="Hata Adı" :sortable="true" style="width: 14rem" />
          <PvColumn field="errorDescription" header="Hata Açıklaması" :sortable="true" style=" overflow:hidden; white-space:nowrap; text-overflow:ellipsis; display:inline-block; width: 30px" />
          <PvColumn field="createDate" dataType="date" header="Oluşturma Tarih"  :sortable="true" style="width: 14rem">
            <template #body="{data}">
              {{formatDate(data.createDate)}}
            </template>
          </PvColumn>
          <PvColumn field="status" header="Hata Durumu"  :sortable="true" style="min-width: 14rem" >
            <template #body="slotProps">
              {{getStatusDefinition(slotProps.data.status)}}
            </template>
          </PvColumn>
          <template #expansion="slot">
            <div style="">
              <!--<PvDataTable :value="slot" responsiveLayout="scroll">
                <PvColumn  field="errorDescription" header="Hata Açıklaması" style="min-width: 100rem" ></PvColumn>
              </PvDataTable>-->
                <h6 >Hata Açıklaması</h6>
                <p style="display: inline-block; word-break: break-word;"> {{slot.data.errorDescription}}</p>
            </div>
          </template>
          <template #empty>
            Hata Bulunamadı.
          </template>
        </PvDataTable>
      </div>
      <AddError v-if="errorDialog" :closeDialog="closeDialog" :errorId="selectedError.id" :processType="processType"/>
      <ContextMenu :model="menuModel" ref="cm" />
    </Toast>
  </div>
</template>

<script>
import axios from "axios";
import {onMounted, ref} from "vue";
import AddError from "@/components/AddError";
import { FilterMatchMode } from 'primevue/api';
import RequestCustomerService from "@/service/RequestCustomerService";
import {StatusTypeList} from "@/list";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

export default {
  components: {AddError},
  setup(){
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const filters1 = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
    const confirm = useConfirm();
    const toast= useToast();
    const cm = ref();
    const processType = ref(1)
    const errorDialog = ref(false);
    const errorList = ref(null);
    const selectedError = ref(null);
    const expandedRows = ref([]);

    const getStatusDefinition =(errorStatus)=> {
      const errorDefArr =  StatusTypeList.filter((s) => s.Id == errorStatus);
      const errorDef = errorDefArr && errorDefArr.length > 0 ? errorDefArr[0].definition : "Undefined";
      return errorDef;
    }

    const formatDate = (value) => {
      return new Date(value).toLocaleDateString('en-US',{
        day: "2-digit",
        month: "2-digit",
        year: "numeric",}
      )};

    const menuModel = ref([
      {label:'Ekle', icon:'pi pi-fw pi-search', command: () => openDialog(1)},
      {label:'Güncelle', icon:'pi pi-fw pi-circle', command: () => openDialog(2)},
      {label:'Sil', icon:'pi pi-fw pi-times', command: () => deleteRequest()},
    ]);
///////////////delete error////////////////////////////////////////////////////////////////////////////////////////
    const deleteRequest= () =>{
      confirm.require({
        message: 'Kullanıcıyı silmek istediğinizden emin misiniz?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          RequestCustomerService.deleteRequest(selectedError.value.id)
              .then((response)=>{
                if(response.data.success){
                  getCustomerErrors()
                  toast.add({severity:'success', summary:'Başarılı', detail:'Kullanıcı silindi', life: 3000});
                }
              })
        },
      });
    }
    const onRowExpand = (event) => {
      toast.add({severity: 'info', summary: 'Hata Açıklaması Açıldı', detail: event.data.name, life: 3000});
    };
    const onRowCollapse = (event) => {
      toast.add({severity: 'success', summary: 'Hata Açıklaması Kapandı', detail: event.data.name, life: 3000});
    };

    const openDialog = (type) => {
      processType.value = type;
      errorDialog.value = true;
    }

    const closeDialog = (refresh) => {
      errorDialog.value = false;
      if(refresh){
        console.log("refresh",refresh)
        getCustomerErrors()
      }
    }

    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    }

    const getCustomerErrors = () => {



      const customerId=localStorage.getItem('user-info')
      console.log("customer",customerId);
      RequestCustomerService.getErrorListById(customerId)
          .then((respond)=> {
            console.log("response",respond)
            if (respond.data.success) {
              errorList.value = respond.data.payload
            }else
              toast.add({severity: 'error', summary: 'Error', detail: respond.data.information, life: 3000});
          }).catch((err) => {
              console.log("error",err);
          })}

    onMounted(async () => {
      await getCustomerErrors()
    })

    return{
      errorList, selectedError, menuModel,errorDialog, closeDialog, openDialog, cm, onRowContextMenu,
      processType,filters1,formatDate,expandedRows,onRowExpand,onRowCollapse,getStatusDefinition
    }
  }
}

/* axios.get('data/data.json')
         .then((res) => {
           errorList.value = res.data.data;
           console.log("errorList.value",errorList.value)

         }).catch((err) => {
       console.log("error")
       console.log(err);
     })*/
/*    onMounted(()=>{
      let user=localStorage.getItem('user-info')
      if(user){
        router.push({name:'customer'})
      }

    })*/
</script>

<style lang="scss" scoped>
::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>

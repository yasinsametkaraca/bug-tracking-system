<template>
  <div>
    <DataTable class="p-datatable-hoverable-rows p-datatable-scrollable" :value="userList" context-menu
               v-model:context-menu-selection="selectedUser" @rowContextmenu="onRowContextMenu"
               responsiveLayout="scroll" v-model:filters="filters">
      <template #header>
        <div class="header-request ">
          <span>
            <h2 class="m-0">Kullanıcılar Listesi</h2>
          </span>
          <span class="p-input-icon-left">
            <i class="pi pi-search"/>
            <InputText v-model="filters['global'].value" placeholder="Ara"/>
          </span>
        </div>
      </template>
      <PvColumn field="userNameSurname" header="İsim">
        <template #filter>
          <InputText type="text" v-model="filters['definition'].value"/>
        </template>
      </PvColumn>
      <PvColumn field="userPhone" header="Telefon"/>
      <PvColumn field="userEmail" header="Email"/>
    </DataTable>
    <UsersComp v-if="userDialog" :userId="selectedUser.id" :processType="processType" :closeDialog="closeDialog"/>
    <ContextMenu :model="menuModel" ref="cm"/>
  </div>
</template>

<script>
import axios from "axios";
import {onMounted, ref} from "vue";
import UsersComp from "@/components/Users/UsersComp";
import UserService from "@/service/UserService";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm"
import {FilterMatchMode} from "primevue/api";

export default {
  components: {UsersComp},
  setup(){
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const cm = ref();
    const confirm = useConfirm();
    const toast = useToast()
    const processType=ref(1)
    const userDialog = ref(false);
    const userList = ref(null);
    const selectedUser = ref(null);
    const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
    const menuModel = ref([
      {label:'Ekle', icon:'pi pi-fw pi-search', command: () => openDialog(1)},
      {label:'Güncelle', icon:'pi pi-fw pi-user-edit', command: () => openDialog(2)},
      {label:'sil', icon:'pi pi-fw pi-times', command: () => deleteUsers()},
    ]);

    const openDialog = (type) => {
      processType.value=type
      userDialog.value = true;
    }
    const openDeleteDialog = () =>{
      userDialog.value = true;
    }
    const closeDialog = (refresh) => {
      userDialog.value = false;
      if (refresh){
        getUserList2();
      }
    }
    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    }

    ///////////getUserList///////////////////////////////////////////////////////////////////////////
    const getUserList2 = () => {
      UserService.getUserList()
          .then((res) =>{
            if(res.data.success){
              userList.value = res.data.payload
              console.log("userList.value",userList.value)
            }else
              toast.add({severity:'error', summary: 'Error', detail:res.data.information, life: 3000});

          }).catch((err) => {
        console.log("error")
        console.log(err);
      })}

    ///////deleteUser///////////////////////////////////////////////////////////////////
    const deleteUsers=()=>{
      confirm.require({
        message: 'Kullanıcıyı silmek istediğinizden emin misiniz?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          UserService.deleteUser(selectedUser.value.id)
              .then((response)=>{
                if(response.data.success){
                  getUserList2()
                  toast.add({severity:'success', summary:'Başarılı', detail:'Kullanıcı silindi', life: 3000});
                }
              })
        },
      });
    }

    onMounted(() => {
      getUserList2()
    })
    return{
      userList, selectedUser, menuModel, userDialog, cm, processType, filters,

      closeDialog, openDialog, onRowContextMenu, openDeleteDialog
    }
  }

}
</script>

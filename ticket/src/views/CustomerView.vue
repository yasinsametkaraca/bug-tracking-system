<template>

  <div>
    <Toast>
      <PvDataTable class="p-datatable-hoverable-rows" :value="errorList" context-menu v-model:context-menu-selection="selectedError" @rowContextmenu="onRowContextMenu" responsiveLayout="scroll">
        <PvColumn field="description" header="Hata Açıklaması"/>
        <PvColumn field="createDate" header="Oluşturma Tarih"/>
        <PvColumn field="updateDate" header="Güncelleme Tarihi"/>
        <PvColumn field="status" header="Hata Durumu"/>
      </PvDataTable>
      <AddError v-if="errorDialog" :closeDialog="closeDialog" :errorId="selectedError.Id" :processType="processType"/>
      <ContextMenu :model="menuModel" ref="cm" />
    </Toast>
  </div>
</template>

<script>

import axios from "axios";
import {onMounted, ref} from "vue";
import AddError from "@/components/AddError";

export default {
  components: {AddError},
  setup(){
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const cm = ref();

    const processType = ref(1)
    const errorDialog = ref(false);
    const errorList = ref(null);
    const selectedError = ref(null);
    const menuModel = ref([
      {label:'Ekle', icon:'pi pi-fw pi-search', command: () => openDialog(1)},
      {label:'Güncelle', icon:'pi pi-fw pi-circle', command: () => openDialog(2)},
      {label:'sil', icon:'pi pi-fw pi-times', command: () => openDialog(selectedError)},
    ]);

    const openDialog = (type) => {
      processType.value = type;
      errorDialog.value = true;
    }
    const closeDialog = () => {
      errorDialog.value = false;
    }
    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    }

    const getErrors = () => {
      axios.get('data/data.json')
          .then((res) => {
            errorList.value = res.data.data;
            console.log("errorList.value",errorList.value)

          }).catch((err) => {
        console.log("error")
        console.log(err);
      })
    }
    onMounted(() => {
      getErrors()
    })
/*    onMounted(()=>{
      let user=localStorage.getItem('user-info')
      if(user){
        router.push({name:'customer'})
      }

    })*/
    /*onMounted(()=>{
      let user=localStorage.getItem('user-info')
      if(!user){
        router.push({name:'login'})
      }

    })*/

    return{
      errorList, selectedError, menuModel,errorDialog, closeDialog, openDialog, cm, onRowContextMenu,
      processType,
    }
  }
}
</script>
<style >

</style>
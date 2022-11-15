<template>
  <PvDialog class="dialog" :header="processType === 1 ? 'Proje Ekle' : 'Proje Güncelle'"
            :value="projectList" @update:visible="closeDialog(false)" :visible="true"
            :breakpoints="{'1980px': '30vw','960px':'60vw'}" :modal="true">
    <form>
      <div>
        <span class="p-float-label">
            <InputText id="parentDefinition" type="text" v-model="projectList.parentDefinition" />
            <label for="ProjectName">Proje Adı</label>
        </span>
        <span class="p-float-label">
            <InputText id="definition" type="text" v-model="projectList.definition" />
            <label for="ModulName">Modül Adı</label>
        </span>
        <span class="button" >
        <PvButton :label="processType===1 ? 'Ekle' : 'Güncelle'" class="p-button-success" @click="saveProject"/>
          </span>
      </div>
    </form>
  </PvDialog>
</template>
<script>
import {ref, onMounted} from "vue";
import ProjectService from "@/service/ProjectService";
import {useToast} from "primevue/usetoast";

export default {
  props: {
    processType: {
      required: true,
    },
    active: {
      required: true,
      type: Number
    },
    closeDialog: {}
  },
  setup(props){
    const projectList = ref({});
    const toast = useToast();

    ///////getProjectListWithId/////////////////////////////////////////////////////////////////
    const getProjectListWithId = () =>{
      ProjectService.getListWithId(props.active)
          .then((res)=>{
            if (res.data.success){
              projectList.value = res.data.payload
            }else
              toast.add({severity:'error', summary: 'Error', detail:res.data.information, life: 3000});
          })
    }

    //////savveProject//////////////////////////////////////////////////////////////////////////
    const saveProject = () =>{
      if (props.processType === 1){
        ProjectService.addProject(projectList.value)
            .then((res)=>{
              if (res.data.success){
                props.closeDialog(true);
              }
            })
      }else if(props.processType === 2){
        ProjectService.updateProject(projectList.value)
            .then((res)=>{
              if (res.data.success){
                props.closeDialog(true);
              }
            })
      }
    }

    onMounted(async ()=>{
      if(props.processType === 2) await getProjectListWithId()
    })

    return{
      projectList,

      saveProject
    }
  }
}
</script>

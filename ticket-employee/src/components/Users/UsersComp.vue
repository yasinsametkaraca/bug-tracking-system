<template>
  <PvDialog class="dialog" :header="processType === 1 ? 'Kullanıcı Ekle' : 'Kullanıcı Güncelle'"
            @update:visible="closeDialog(false)" :visible="true"
            :breakpoints="{'1980px': '30vw','960px':'60vw'}" :modal="true">
    <form>
      <div >
        <div class="p-float-label">
          <InputText id="userNameSurname" type="text" v-model="userList.userNameSurname" />
          <label for="userNameSurname">Kullanıcı Adı</label>
        </div>
        <div class="p-float-label" >
            <InputText id="userPhone" type="number" v-model="userList.userPhone" />
            <label for="userPhone">Kullanıcı Numarası</label>
        </div>
        <div class="p-float-label">
            <InputText id="userEmail" type="text" v-model="userList.userEmail" />
            <label for="userEmail">Kullanıcı Mail</label>
        </div>
        <div class="p-float-label">
            <InputText id="role" type="text" v-model="userList.role" />
            <label for="role">Kullanıcı rolü</label>
        </div>
        <div class="p-float-label w-full" v-if="processType === 1">
          <PvDropdown style="width:100%; " v-model="selectedProject" :options="projectList"
                      optionLabel="parentDefinition" optionValue="parentId" placeholder="Proje seçin"/>
        </div>
        <div v-if="processType === 1" class="p-float-label">
            <PvPassword id="password" v-model="userList.userPassword" placeholder="Şifre" class="p-invalid" />
          </div>
        <span v-if="processType === 1" class="p-float-label">
            <PvPassword id="password" v-model="userList.Password" placeholder="Şifre Tekrar" class="p-invalid" />
          </span>
        <div class="button" >
        <PvButton :label="processType===1 ? 'Ekle' : 'Güncelle'" class="p-button-success" @click="saveUser" ></PvButton>
          </div>
      </div>
    </form>
  </PvDialog>
</template>

<script>
import {onMounted, ref} from "vue";
import UserService from "@/service/UserService";
import {useToast} from "primevue/usetoast";
import ProjectService from "@/service/ProjectService";

export default {
  components: {},
  props: {
    processType: {
      required: true,
    },
    userId: {
      required: true,
      type: Number
    },
    closeDialog: {}
  },
  setup(props){
    const userList = ref({Role:'',});
    const toast = useToast();
    const projectList = ref(null);
    const selectedProject = ref();

    ////////////////gerUserById/////////////////////////////////////////////////////////////////
    const getUsersById = () => {
      UserService.getUserListById(props.userId)
          .then((res) =>{
            if(res.data.success){
              userList.value = res.data.payload;
            }else
              toast.add({severity:'error', summary: 'Error', detail:res.data.information, life: 3000});
          })
    }

    ///////////////saveUser//////////////////////////////////////////////////////////////////
    const saveUser = () =>{
      if(props.processType === 1){
        UserService.addUser(userList.value)
            .then((res)=>{
              if(res.data.success){
                props.closeDialog(true)
              }
            })
      }else if(props.processType === 2){
        UserService.updateUser(userList.value)
            .then((res)=>{
              if(res.data.success){
                props.closeDialog(true)
              }
            })
      }
    }

    ///////getProjectList///////////////////////////////////////////////////////////
    const getProjectList = () =>{
      ProjectService.getProject()
          .then((res)=>{
            if (res.data.success){
              projectList.value = res.data.payload
            }
          })
    }

    onMounted(async () =>{
      if(props.processType === 2) await getUsersById();
      else if(props.processType === 1) await getProjectList();

    })

    return{
      userList, projectList, selectedProject,

      saveUser
    }
  }

}

</script>

<style>
.p-float-label{
  margin-bottom: 20px;

}
form{
  display: flex;
  justify-content: center;
  align-content: center;
}

.button{
  display: flex;
  justify-content: end;
}
</style>

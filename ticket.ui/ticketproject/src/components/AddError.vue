<template>
  <PvDialog class="dialog" :header="processType===1 ? 'Hata Ekle': 'Hata Güncelle'" @update:visible="closeDialog(false)"
            :visible="true" :breakpoints="{'1980px': '40vw','960px':'75vw'}" :modal="true">
    <div class="form-demo ">
      <div class="flex justify-content-center">

        <form style="width: 80%;" @submit.prevent="addorupdateError(!v$.$invalid)" class="p-fluid">
          <div class="field flex justify-content-start">
          <div class="mr-4 w-full " >
            <div class="p-float-label  ">
              <PvDropdown class="w-full" :class="{'p-invalid':v$.projectId.$invalid && submitted}" id="projectId"
                          v-model="v$.projectId.$model" :options="projectlist" optionLabel="name" optionValue="Id"/>
              <label for="projectId" :class="{'p-error':v$.projectId.$invalid && projectId}">Proje Id*</label>
            </div>
            <small v-if="(v$.projectId.$invalid && submitted) || v$.projectId.$pending.$response"
                   class="p-error">{{"Proje Id Boş Bırakılamaz"}}</small>
          </div>
          <div class="w-full">
            <div class="p-float-label ">
              <PvDropdown class="w-full" :class="{'p-invalid':v$.moduleId.$invalid && submitted}" id="moduleId"
                          v-model="v$.moduleId.$model" :options="modulelist" optionLabel="name" optionValue="Id"/>
              <label for="moduleId" :class="{'p-error':v$.moduleId.$invalid && moduleId}">Modül Id*</label>
            </div>
            <small v-if="(v$.moduleId.$invalid && submitted) || v$.moduleId.$pending.$response"
                   class="p-error">{{"Modül Id Boş Bırakılamaz"}}</small>
          </div>
          </div>

          <div class="field mt-4">
            <div class="p-float-label ">
              <InputText id="errorTitle" v-model="v$.errorTitle.$model"
                         :class="{'p-invalid':v$.errorTitle.$invalid && submitted}"/>
              <label for="errorTitle" :class="{'p-error':v$.errorTitle.$invalid && errorTitle}">Hata Adı*</label>
            </div>
            <small v-if="(v$.errorTitle.$invalid && submitted) || v$.errorTitle.$pending.$response"
                   class="p-error">{{"Hata Başlığı Boş Bırakılamaz"}}</small>
          </div>


          <div class="field mt-4">
            <div class="p-float-label ">
              <PvTextarea id="errorDescription" v-model="v$.errorDescription.$model"
                          :class="{'p-invalid':v$.errorDescription.$invalid && submitted}"/>
              <label for="errorDescription"
                     :class="{'p-error':v$.errorDescription.$invalid && errorDescription}">Hata Tanımı*</label>
            </div>
            <small v-if="(v$.errorDescription.$invalid && submitted) || v$.errorDescription.$pending.$response"
                   class="p-error">{{ "Hata Tanımı Boş Bırakılamaz" }}</small>
          </div>


          <PvButton :label="processType===1 ? 'Ekle': 'Güncelle'" type="submit" class="mt-2"/>
        </form>

      </div>
    </div>
  </PvDialog>
</template>

<script>
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {onMounted, ref} from "vue";
import {projectId} from "@/list";
import {moduleId} from "@/list";
import RequestCustomerService from "@/service/RequestCustomerService";
import {useToast} from "primevue/usetoast";

export default {
  components: {},
  props: {
    processType: {
      required: true,
      type: Number
    },
    errorId: {
      required: true,
      type: Number
    },
    closeDialog: {required: true}
  },

  setup(props) {

    const errorList = ref({
      errorTitle: '',
      errorDescription: '',
      projectId: '',
      moduleId: '',
    })
    const rules = {
      errorTitle: {required},
      errorDescription: {required},
      projectId: {required},
      moduleId: {required},
    };
    const submitted = ref(false);
    const v$ = useVuelidate(rules, errorList);
    const toast = useToast()
/////////////////////////////add error//////////////////////////////////////////////////////////////////
    const addorupdateError = (isFormValid) => {
      submitted.value = true;
      if (!isFormValid) {
        return;
      }
      console.log(localStorage.getItem('user-info'))
      let errorInfo = {
        "ProjectId": errorList.value.projectId,
        "ModuleId": errorList.value.moduleId,
        "ErrorDescription": errorList.value.errorDescription,
        "ErrorTitle": errorList.value.errorTitle,
        "CustomerId": localStorage.getItem('user-info')
      }
      console.log("errorİnfo",errorInfo)
      if (props.processType === 1) {
        RequestCustomerService.addRequest(errorInfo)
            .then((response)=>{
              if(response.data.success){
                props.closeDialog(true)
                toast.add({severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı eklendi', life: 3000});
              }
            })
      } else if(props.processType===2) {
        RequestCustomerService.updateRequest(errorList.value)
            .then((response)=>{
              if(response.data.success){
                props.closeDialog(true)
                toast.add({severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı güncellendi', life: 3000});
              }
            })
      }
    }
/////////////////////////////////////update Error////////////////////////////////////////////////////////
    const getErrorById = () => {
      RequestCustomerService.getErrorById(props.errorId)
          .then((response) => {
            if (response.data.success) {
              errorList.value = response.data.payload
            }
          })
    }
    onMounted(async () => {
      console.log(errorList.value)
      if (props.processType === 1)
        return;
      await getErrorById()
    })
    const projectlist = ref(projectId);
    const modulelist = ref(moduleId);

    return {
      errorList,projectlist,v$,submitted,modulelist,addorupdateError
    }
  }
}

</script>
<style lang="scss" scoped>
.form-demo {
  .card {
    min-width: 450px;

    form {
      margin-top: 2rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }
  }

  @media screen and (max-width: 960px) {
    .card {
      width: 80%;
    }
  }
}

</style>

<template>
  <PvDialog class="dialog" :header="processType===1 ? 'Hata Ekle': 'Hata Güncelle'" @update:visible="closeDialog" :visible="true" :breakpoints="{'1980px': '40vw','960px':'75vw'}" :modal="true">

    <div class="form-demo ">
      <div class="flex justify-content-center">

        <form @submit.prevent="addError(!v$.$invalid)" class="p-fluid">
          <div class="field mt-4">
            <div class="p-float-label ">
              <InputText  id="errorTitle" v-model="v$.errorTitle.$model" :class="{'p-invalid':v$.errorTitle.$invalid && submitted}" />
              <label for="errorTitle" :class="{'p-error':v$.errorTitle.$invalid && errorTitle}">errorTitle*</label>
            </div>
            <small v-if="(v$.errorTitle.$invalid && submitted) || v$.errorTitle.$pending.$response" class="p-error">{{v$.errorTitle.required.$message.replace('Value', 'errorTitle')}}</small>
          </div>

          <div class="field mt-4">
            <div class="p-float-label ">
              <PvDropdown class="w-full" :class="{'p-invalid':v$.selectedProjectId.$invalid && submitted}" id="selectedProjectId"  v-model="v$.selectedProjectId.$model" :options="projectlist" optionLabel="name" optionValue="Id" />
              <label for="selectedProjectId" :class="{'p-error':v$.selectedProjectId.$invalid && selectedProjectId}">selectedProjectId*</label>
            </div>
            <small v-if="(v$.selectedProjectId.$invalid && submitted) || v$.selectedProjectId.$pending.$response" class="p-error">{{v$.selectedProjectId.required.$message.replace('Value', 'selectedProjectId')}}</small>
          </div>
          <div class="field mt-4">
            <div class="p-float-label ">
              <PvDropdown class="w-full" :class="{'p-invalid':v$.selectedModuleId.$invalid && submitted}" id="selectedModuleId"  v-model="v$.selectedModuleId.$model" :options="moduleId" optionLabel="name" optionValue="Id"/>
              <label for="selectedModuleId" :class="{'p-error':v$.selectedModuleId.$invalid && selectedModuleId}">selectedModuleId*</label>
            </div>
            <small v-if="(v$.selectedModuleId.$invalid && submitted) || v$.selectedModuleId.$pending.$response" class="p-error">{{v$.selectedModuleId.required.$message.replace('Value', 'selectedModuleId')}}</small>
          </div>
          <div class="field mt-4">
            <div class="p-float-label ">
              <PvTextarea id="description" v-model="v$.description.$model" :class="{'p-invalid':v$.description.$invalid && submitted}" />
              <label for="description" :class="{'p-error':v$.description.$invalid && description}">description*</label>
            </div>
            <small v-if="(v$.description.$invalid && submitted) || v$.description.$pending.$response" class="p-error">{{v$.description.required.$message.replace('Value', 'description')}}</small>
          </div>


          <PvButton :label="processType===1 ? 'Ekle': 'Güncelle'" type="submit"  class="mt-2" />
        </form>

      </div>
    </div>
  </PvDialog>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import {onMounted,  ref} from "vue";
import axios from "axios";
import {projectId} from "@/list";

export default{
  components: {},
  props: {
    processType:{
      required:true,
      type:Number
    },
    errorId:{
      required: true,
      type:Number
    },
    closeDialog:{}
  },

  setup(props) {

    const errorList = ref({
      errorTitle: '',
      description: '',
      selectedProjectId: '',
      selectedModuleId: '',

    })
    const rules = {
      errorTitle: {required},
      description: {required},
      selectedProjectId: {required},
      selectedModuleId: {required},
    };
    const submitted = ref(false);
    const v$ = useVuelidate(rules, errorList);

    const addError = (isFormValid) => {
      submitted.value = true;
      if (!isFormValid) {
        return;
      }
      let errorInfo = []
      console.log(errorList.value)
      errorInfo.push({
        "projectId": errorList.value.selectedProjectId,
        "moduleId": errorList.value.selectedModuleId
      })
      console.log(errorInfo)
    }

    let err = [];
    const getErrorById = () => {
      axios.get('data/data.json', props.errorId)
          .then((ress) => {
            err = ress.data.data;
            err.forEach(y => {
              if (y.Id === props.errorId) {
                return errorList.value = y;
              }
            })
          })
    }

    onMounted(async () => {
      if (props.processType === 1)
        return;
      await getErrorById()
    })
    const projectlist = ref(projectId);


    const moduleId = ref([
      {name: 'Modül1', Id: 1},
      {name: 'Modül2', Id: 2},
      {name: 'Modül3', Id: 3},
      {name: 'Modül4', Id: 4},
      {name: 'Modül5', Id: 5}]);

    return {
      errorList, addError, moduleId, projectlist, v$, submitted,
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

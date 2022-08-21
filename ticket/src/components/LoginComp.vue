<template>
  <div class="form-demo container">
    <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '30vw' }" position="top">
      <div class="flex align-items-center flex-column pt-6 px-3">
        <i class="pi pi-check-circle" :style="{fontSize: '5rem', color: 'var(--green-500)' }"></i>
        <h5>Registration Successful!</h5>
        <p :style="{lineHeight: 1.5, textIndent: '1rem'}">
          Your account is registered under name <b>{{state.name}}</b> ; Please check <b>{{state.email}}</b> for activation instructions.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-content-center">
          <Button label="OK" @click="toggleDialog" class="p-button-text" />
        </div>
      </template>
    </Dialog>
    <div class="flex justify-content-center">
      <div class="card">
        <h5 class="text-center">Giriş Yap</h5>
          <form @submit.prevent="login(!v$.$invalid)" class="p-fluid">
            <div class="field">
              <div class="p-float-label">
                <InputText id="name" v-model="v$.nameSurname.$model" :class="{'p-invalid':v$.nameSurname.$invalid && submitted}"  />
                <label for="name" :class="{'p-error':v$.nameSurname.$invalid && submitted}">Username*</label>
              </div>
              <small v-if="(v$.nameSurname.$invalid && submitted) || v$.nameSurname.$pending.$response" class="p-error">{{v$.nameSurname.required.$message.replace('Value', 'Name')}}</small>
            </div>

            <div class="field">
              <div class="p-float-label">
                <PvPassword  id="password" v-model="v$.password.$model" :class="{'p-invalid':v$.password.$invalid && submitted}" toggleMask>
                  <template #header>
                    <h6>Pick a password</h6>
                  </template>
                  <template #footer="sp">
                    {{sp.level}}
                    <Divider />
                    <p class="mt-2">Suggestions</p>
                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                      <li>At least one lowercase</li>
                      <li>At least one uppercase</li>
                      <li>At least one numeric</li>
                      <li>Minimum 8 characters</li>
                    </ul>
                  </template>
                </PvPassword>
                <label for="password" :class="{'p-error':v$.password.$invalid && submitted}">Password*</label>
              </div>
              <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{v$.password.required.$message.replace('Value', 'Password')}}</small>
            </div>
            <PvButton type="submit" label="Submit" class="mt-2"  />
          </form>
        </div>
      </div>
  </div>
</template>

<script>


import router from "@/router";
import axios from "axios";
import {ref,onMounted,reactive} from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
export default {
  name:'LoginComp2',
  setup(){
    const state = reactive({
      nameSurname :'',
      password:''
    })
    const rules = {
      nameSurname: { required },
      password: { required },
    };

    const submitted = ref(false);
    const v$ = useVuelidate(rules, state);
    const showMessage = ref(false);
    const login =  (isFormValid) => {

      submitted.value = true;

      if (!isFormValid) {
        return;
      }

      let result = axios.get(`http://localhost:3000/user?nameSurname=${state.nameSurname}&password=${state.password}`)
      console.log("result",result)
      result.then((payload)=>{
        if(payload.status==200 && payload.data.length>0){
          localStorage.setItem('user-info',JSON.stringify(payload.data[0]))
          router.push({name:'HomeView'})
        }
      })

      console.warn(result)

    }

    onMounted(()=>{
      let user=localStorage.getItem('user-info')
      if(user){
        router.push({name:'HomeView'})
      }
    })
    const handleSubmit = (isFormValid) => {
      submitted.value = true;

      if (!isFormValid) {
        return;
      }

      toggleDialog();
    }
    const toggleDialog = () => {
      showMessage.value = !showMessage.value;

      if(!showMessage.value) {
        resetForm();
      }
    }
    const resetForm = () => {
      state.nameSurname = '';
      state.password = '';
      state.accept = null;
      submitted.value = false;
    }
    return{
      login,v$,state,submitted,handleSubmit,showMessage,toggleDialog
    }
  }

}
</script >



<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
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
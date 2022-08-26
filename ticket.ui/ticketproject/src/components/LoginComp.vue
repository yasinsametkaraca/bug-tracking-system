<template>
  <div class="form-demo container">
    <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '30vw' }" position="top">
      <div class="flex align-items-center flex-column pt-6 px-3">
        <i class="pi pi-check-circle" :style="{fontSize: '5rem', color: 'var(--green-500)' }"></i>
        <h5>Successful!</h5>
      </div>
      <template #footer>
        <div class="flex justify-content-center">
          <Button label="OK" @click="toggleDialog" class="p-button-text"/>
        </div>
      </template>
    </Dialog>
    <div class="flex justify-content-center m-2 ">
      <div class="card shadow-6 transition-duration-100 ">
        <div class="flex justify-content-center mb-6 mt-5">
          <img src="https://www.turkuvazinovasyon.com/img/onlylogo.svg">
        </div>
        <h5 class="text-center ">Giriş Yap</h5>
        <form @submit.prevent="login(!v$.$invalid)" class="p-fluid ">
          <div class="field">
            <div class="p-float-label m-2">
              <InputText id="name" v-model="v$.UserEmail.$model"
                         :class="{'p-invalid':v$.UserEmail.$invalid && submitted}"/>
              <label for="name" :class="{'p-error':v$.UserEmail.$invalid && submitted}">UserEmail*</label>
            </div>
            <small v-if="(v$.UserEmail.$invalid && submitted) || v$.UserEmail.$pending.$response"
                   class="p-error">{{"Email Boş Bırakılamaz"}}</small>
          </div>

          <div class="field">
            <div class="p-float-label m-2">
              <PvPassword id="UserPassword" v-model="v$.UserPassword.$model"
                          :class="{'p-invalid':v$.UserPassword.$invalid && submitted}" toggleMask>
                <template #header>
                  <h6>Parolanızı Giriniz</h6>
                </template>
                <template #footer="sp">
                  {{ sp.level }}
                  <Divider/>
                  <p class="mt-2">Önerilen</p>
                  <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                    <li>En az bir küçük harf</li>
                    <li>En az bir büyük harf</li>
                    <li>En az bir rakam</li>
                    <li>Minimum 8 karakter</li>
                  </ul>
                </template>
              </PvPassword>
              <label for="UserPassword" :class="{'p-error':v$.UserPassword.$invalid && submitted}">Password*</label>
            </div>
            <small v-if="(v$.UserPassword.$invalid && submitted) || v$.UserPassword.$pending.$response"
                   class="p-error">{{"Parola Boş Bırakılamaz"}}</small>
          </div>
          <div class="m-2 mb-5">
            <PvButton type="submit" label="Submit"/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>


import router from "@/router";
/*import axios from "axios";*/
import {ref, onMounted, reactive} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import RequestCustomerService from "@/service/RequestCustomerService";
import {useToast} from "primevue/usetoast";

export default {
  name: 'LoginComp2',
  setup() {
    const state = reactive({
      UserEmail: '',
      UserPassword: ''
    })
    const rules = {
      UserEmail: {required},
      UserPassword: {required},
    };
    const toast = useToast()
   // const customerList = ref(null);
    const submitted = ref(false);
    const v$ = useVuelidate(rules, state);
    const showMessage = ref(false);

    const login = (isFormValid) => {

      submitted.value = true;

      if (!isFormValid) {
        return;
      }

      /*let result = axios.get(`http://localhost:3000/user?UserEmail=${state.UserEmail}&password=${state.password}`)
      console.log("result",result)
      result.then((payload)=>{
        if(payload.status==200 && payload.data.length>0){
          localStorage.setItem('user-info',JSON.stringify(payload.data[0]))
          router.push({name:'HomeView'})
        }
      })

      console.warn(result)*/
      /*RequestCustomerService.customerLogin()
          .then((res) => {
            if (res.data.success) {
              customerList.value = res.data.payload
              console.log(customerList.value)
              let loginCheck = customerList.value.filter(f => f.UserEmail === state.UserEmail && f.UserPassword === state.password);
              if (loginCheck.length > 0) {
                localStorage.setItem('user-info', JSON.stringify(loginCheck[0].id))
                router.push({name: 'HomeView'})
              } else
                toast.add({severity: 'error', summary: 'Error', detail: "Giriş Yapılamadı", life: 3000});

            }
          }).catch((err) => {
        console.log("error")
        console.log(err);
      })*/
      let customerLoginInfo= {"UserEmail":state.UserEmail,"UserPassword":state.UserPassword};

      console.log(customerLoginInfo)
      RequestCustomerService.customerLogin(customerLoginInfo)
          .then(response=>{
        if(response.data.success){
          localStorage.setItem('user-info', JSON.stringify(response.data.payload.customerId))
          router.push({name: 'HomeView'})
        }else{
          toast.add({severity: 'error', summary: 'Error', detail: response.data.information, life: 3000});
        }
      }).catch((er)=>{
        console.log("error",er)
      })


    }
    onMounted(() => {
      let user = localStorage.getItem('user-info')
      if (user) {
        router.push({name: 'HomeView'})
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
      if (!showMessage.value) {
        resetForm();
      }
    }
    const resetForm = () => {
      state.UserEmail = '';
      state.UserPassword = '';
      state.accept = null;
      submitted.value = false;
    }
    return {
      login, v$, state, submitted, handleSubmit, showMessage, toggleDialog
    }
  }

}
</script>


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
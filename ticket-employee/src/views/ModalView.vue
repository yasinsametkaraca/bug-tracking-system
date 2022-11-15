<template>
  <div class="p-dialog-mask p-component-overlay p-component-overlay-enter">
    <div class="p-dialog p-component" role="dialog" aria-placeholder="Replace">
      <div class="p-dialog-header">
        <div class="p-dialog-title">Replace</div>
      </div>
      <div class="p-input-group">
        <div class="p-dialog-content">
          <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText id="message1" v-model="message1" type="text"/>
          </span>
          </div>
        </div>
        <div class="p-dialog-content">
          <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText id="inputtext2" v-model="message2" type="text"/>
          </span>
          </div>
        </div>
      </div>
      <div class="p-dialog-footer">
        <div class="fc-button-group">
          <PvButton icon="pi pi-info" @click="replace">Replace</PvButton>
          <PvButton icon="pi pi-info" @click="replaceAll">Replace All</PvButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: 'ModalView',
  setup(){
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const message1 = ref(null);
    const message2 = ref(null);
    const jsonList = ref(null);
    const stringList = ref(null);
    const getJsonToList = () =>{
      axios.get('assets/data/ObjectForSearch.json')
          .then((res) => {
            jsonList.value = res.data
            stringList.value = JSON.stringify(jsonList.value)
            console.log(jsonList.value)
            console.log(stringList.value)
          }).catch((err)=>{
        console.log(err)
      })
    }
    const replace = () => {

      stringList.value = stringList.value.replace(message1.value,message2.value)
      console.log(stringList.value);
    }

    const replaceAll = () => {
      stringList.value = stringList.value.replaceAll(message1.value,message2.value)
      console.log(stringList.value);
    }

    onMounted(
        getJsonToList
    )
    return{
      jsonList, stringList, replace, replaceAll, message1, message2
    }
  }

}
</script>
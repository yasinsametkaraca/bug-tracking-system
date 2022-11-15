<template>
  <PvDialog class="dialog" header="Hata Güncelle"
            @update:visible="closeDialog(1)" :visible="true"
            :breakpoints="{'1980px': '20vw','960px':'50vw'}" :modal="true">
    <form>
      <div>
        <PvDropdown v-model="selectedStatus" :options="status" optionLabel="name" optionValue="Id"
                    :placeholder="requestList.Status">
        </PvDropdown>
        <span class="button">
          <PvButton label="Güncelle" class="p-button-success" @click="updateRequest"/>
        </span>
      </div>
    </form>
  </PvDialog>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  components: {},
  props: {
    requestId: {
      required: true,
      type: Number
    },
    closeDialog: {
      type:Function
    }
  },
  setup(props){
    const requestList = ref({});

    ////////getRequestById/////////////////////////////////////////////////////////////////////////////
    const getRequestById = ()=>{
      let requests = []
      axios.get('assets/data/request.json', props.requestId)
          .then((res) => {
            requests = res.data.request
            requests.forEach(x=>{
              if(x.Id === props.requestId){
                return requestList.value = x;
              }
            })
          })
      console.log('requestList',requestList.value)
    }
    const selectedStatus = ref(null);
    const status = ref ([
      {name: 'waiting', Id:0},
      {name: 'working', Id:1},
      {name: 'upgrading', Id:2},
      {name: 'runningest', Id:3},
      {name: 'finishing', Id:4}
    ])
    onMounted(async ()=>{
      await getRequestById()
    })
    return{
      requestList, selectedStatus, status
    }
  }
}
</script>

<style scoped>
.p-dropdown{
  margin-bottom: 14px;
}

</style>

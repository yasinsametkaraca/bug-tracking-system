<template>
  <PvDialog class="dialog" header="Kullanıcı Ata"
            @update:visible="closeDialog(2)" :visible="true"
            :breakpoints="{'1980px': '20vw','960px':'50vw'}" :modal="true">
    <form>
      <div>
        <PvDropdown v-model="selectedStatus" :options="users" optionLabel="name" optionValue="Id"
                    :placeholder="requestUserList.User === null ? 'Kullanıcı seçiniz' : 'requestUserList.User'">
        </PvDropdown>
        <span class="button">
          <PvButton label="Kaydet" class="p-button-success" @click="updateUserRequest"/>
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
    usersId: {
      required: true,
      type: Number
    },
    closeDialog: {
      type: Function
    }
  },
  setup(props){
    const requestUserList = ref({});
    const getRequestUserById = ()=>{
      let requests = []
      axios.get('assets/data/users.json', props.usersId)
          .then((res) => {
            requests = res.data.users
            requests.forEach(x=>{
              if(x.Id === requests.Id){
                return requestUserList.value = x;
              }
            })
          })
    }
    const selectedStatus = ref(null);
    const users = ref ([
      {name: 'User1', Id:0},
      {name: 'User2', Id:1},
      {name: 'User3', Id:2},
      {name: 'User4', Id:3},
      {name: 'User5', Id:4}
    ])

    onMounted(async ()=>{
      await getRequestUserById()
    })
    return{
      requestUserList, selectedStatus, users
    }
  }
}
</script>
<style scoped>
.p-dropdown{
  margin-bottom: 14px;
}
</style>

<template>
  <div>
    <PvDropdown v-model="selectedStatus" :options="status" optionLabel="name" optionValue="Id">
    </PvDropdown>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  setup(){
    const selectedStatus = ref(null);
    const status = ref ([
      {name: 'waiting', Id:0},
      {name: 'working', Id:1},
      {name: 'upgrading', Id:2},
      {name: 'runningest', Id:3},
      {name: 'finishing', Id:4}
    ])

    return{
      status, selectedStatus
    }
  }
}
</script>

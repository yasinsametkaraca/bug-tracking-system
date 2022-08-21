<template>
  <div>
    <router-view/>
    <tab-view-comp/>
  </div>


</template>

<script>
// @ is an alias to /src
import TabViewComp from "@/components/TapViewComp";

export default {
  name: 'HomeView',
  components: {
    TabViewComp

  },
  setup() {

  }
}

</script>

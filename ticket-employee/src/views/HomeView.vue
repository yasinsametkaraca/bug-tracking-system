<template>
  <div>
    <router-view/>
   <tab-view-comp/>

  </div>
</template>
<script>
import TabViewComp from "@/components/TabViewComp";
export default {
  name:"HomeView",
  components: {TabViewComp}
}
</script>
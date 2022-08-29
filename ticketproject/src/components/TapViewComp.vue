<template>
  <PvConfirmDialog/>
  <PvToast/>
    <div class="flex justify-content-between mt-1">
      <div @click="home">
        <img  src="https://www.turkuvazinovasyon.com/img/onlylogo.svg">
      </div>
      <div class="h-3rem border-bottom-1 border-gray-300 shadow-1">
          <div class="flex justify-content-end">
            <pv-button @click="logout" icon="pi pi-sign-out" class="p-button-rounded p-button-secondary p-button-text p-1 mr-4" />
          </div>
      </div>
  
    </div>
   <div class="cursor-auto">
     <TabView class="tabview-custom" ref="tabview4">
      <TabPanel>
        <template #header>
          <i class="pi pi-home"/>
          <span>Ana Sayfa</span>
        </template>
        <dashboard-view></dashboard-view>
      </TabPanel>

      <TabPanel>
        <template #header>
          <i class="pi pi-user"/>
          <span>Hata Listesi</span>
        </template>
        <customer-view/>
      </TabPanel>

       <TabPanel>
         <template #header>
           <i class="pi pi-user"/>
           <span>Hata Detay Listesi</span>
         </template>
         <ErrorDetailsView></ErrorDetailsView>
       </TabPanel>
      </TabView>

   </div>

</template>

<script>
import customerView from "@/views/CustomerView";
import router from "@/router";
import DashboardView from "@/views/DashboardView";
import ErrorDetailsView from "@/views/ErrorDetailsView";
export default {
  name: 'TabViewComp',

  components:{
    customerView,DashboardView,ErrorDetailsView
  },
  setup(){
      const logout=()=>{
        localStorage.clear()
        router.push({name:'LoginComp'})
      }
      const home=()=>{
        router.push({name:'HomeView'})
      }
      return{
        logout,home
      }
  }

}

</script>


<style lang="scss" scoped>
.tabview-custom {
i, span {
  vertical-align: center;
}

span {
  margin: 0 .5rem;
}
}

.p-tabview p {
  line-height: 1.5;
  margin: 0;
}
.p-tabview-nav{
  display:flex;
  justify-content: end;
}
</style>
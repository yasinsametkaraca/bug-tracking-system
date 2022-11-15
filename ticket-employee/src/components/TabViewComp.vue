<template>
  <div>
    <PvTabView>
      <PvTabPanel>
        <template #header>
          <i class="pi pi-home"/>
          <span>Ana Sayfa</span>
        </template>
        <home-page-view/>
      </PvTabPanel>
      <PvTabPanel>
        <template #header>
          <i class="pi pi-building"/>
          <span>Firmalar</span>
        </template>
        <customer-view/>
      </PvTabPanel>
      <PvTabPanel>
        <template #header>
          <i class="pi pi-check"/>
          <span>İstekler</span>
        </template>
        <request-view/>
      </PvTabPanel>
      <PvTabPanel>
        <template #header>
          <i class="pi pi-users"/>
          <span>Kullanıcılar</span>
        </template>
        <user-view/>
      </PvTabPanel>
    </PvTabView>
  </div>
</template>

<script>

import UserView from "@/views/UserView";
import RequestView from "@/views/RequestView";
import CustomerView from "@/views/CustomerView";
import HomePageView from "@/views/HomePageView";
export default {
  name: 'TabViewComp',
  components: {HomePageView, CustomerView, RequestView, UserView},
}
</script>

<style>
.p-tabview-nav{
  display: flex;
  justify-content:end;
  align-items: center;
}
</style>

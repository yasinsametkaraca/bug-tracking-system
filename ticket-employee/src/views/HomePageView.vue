<template>
  <div class="flex justify-content-between">
    <div class="lg:w-30rem md:w-20rem sm:w-10rem w-5rem">
      <PvAccordion>
        <PvAccordionTab class="h-5rem" v-for="i in projectList" :key="i.parentDefinition"
                        :header="i.parentDefinition">
          <div class="flex justify-content-between">
            <div>
              <p>{{i.definition}} </p>
            </div>
            <div class="flex lg:w-30rem md:w-20rem sm:w-10rem w-5rem justify-content-end absolute "  >
              <PvSpeedDial class="mr-4" :model="items" :radius="45" type="semi-circle" direction="up" mask @click="getId(i.id)"/>
            </div>
          </div>
        </PvAccordionTab>
      </PvAccordion>
      <home-page-comp v-if="homeDialog" :active="active" :process-type="processType" :close-dialog="closeDialog"/>
    </div>
    <div class="w-25rem h-3rem">
      <PvChart type="doughnut" :data="chartData" :options="lightOptions"/>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, computed} from "vue";
import ProjectService from "@/service/ProjectService";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import HomePageComp from "@/components/HomePage/HomePageComp";

export default {
  name: 'HomePageView',
  components: {HomePageComp},
  setup(){
    const toast = useToast();
    const confirm = useConfirm();
    const projectList = ref(null);
    const active = ref(null);
    const status = ref({});
    const statusList = [];
    const homeDialog = ref(false);
    const processType = ref(null);
    const getId =(id)=>{
      active.value = id;
    }

    const items = ref([
      {label: 'Delete', icon: 'pi pi-trash', command: () => deleteProject()},
      {label: 'Update', icon: 'pi pi-refresh', command: () => openDialog(2)},
      {label: 'Add', icon: 'pi pi-pencil', command: () => openDialog(1)},
    ])

    const openDialog = (type) =>{
      processType.value = type
      homeDialog.value = true;
    }
    const closeDialog = (refresh) =>{
      homeDialog.value = false;
      if(refresh){
        getProjectList();
      }
    }

    /////////deleteProject/////////////////////////////////////////////////////////////////////
    const deleteProject = () =>{
      console.log('active',active.value);
      confirm.require({
        message: 'Projeyi silmek istediğinizden emin misiniz?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          ProjectService.deleteProject(active.value)
              .then((response)=>{
                if(response.data.success){
                  getProjectList()
                  toast.add({severity:'success', summary:'Başarılı', detail:'Firma silindi', life: 3000});
                }

              })
        }}
      )}

    ////////getProjectList/////////////////////////////////////////////////////////////////////
    const getProjectList=()=>{
      ProjectService.getProject()
          .then((res)=>{
            if (res.data.success){
              projectList.value = res.data.payload
            }
          }).catch((err) => {
        console.log("error")
        console.log(err);
      })}

    ////////getRequestList////////////////////////////////////////////////////////////////////////
    const getRequestList  = () =>{
      ProjectService.getCustomerRequest()
          .then((res)=>{
            if (res.data.success){
              for (let i in res.data.payload){
                statusList[i] =res.data.payload[i].status
              }
              status.value = statusList.reduce((x,y)=>(x[y]=(x[y] || 0) +1, x), Object.create(null));
            }
          }).catch((err) => {
        console.log("error")
        console.log(err);
      })}

    const chartData = computed(()=>{
      return{
        labels: ['Waiting','Working','Upgrading','Runningtest','finishing'],
        datasets: [
          {
            data: [status.value['0'], status.value['1'], status.value['2'],status.value['3'],status.value['4']],
            backgroundColor: ["#FFE856FF","#FFBB56FF","#36A2EB","#FF6384FF","#6DFF56FF"],
            hoverBackgroundColor: ["#FFE856FF","#FFBB56FF","#36A2EB","#FF6384FF","#6DFF56FF"]
          }
        ]}
    });

    const lightOptions = ref({
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    });

    onMounted(()=>{
      getProjectList()
      getRequestList()
    })
    return{
      projectList, active, chartData, lightOptions, status, statusList, items, homeDialog, processType,

      getId, closeDialog, openDialog, deleteProject
    }
  }
}
</script>
<style>
.p-speeddial-button.p-button.p-button-icon-only {
  width: 2rem;
  height: 2rem;
}
.p-speeddial-action {
  width: 2rem;
  height: 2rem;
  background: #495057;
  color: #fff;
}
</style>

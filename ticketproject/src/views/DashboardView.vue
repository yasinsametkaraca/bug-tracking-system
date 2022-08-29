<template>
 <div>
   <div class="flex justify-content-center mt-5">
     <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3 class="text-blue-500">Waiting</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/waiting.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p style="font-size: large; font-weight:600;">{{ errorStatusGroup['0'] }}</p>
      </template>
    </PvCard>
    <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3 class="text-green-500">Working</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/working.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p style="font-size: large; font-weight:600;" >{{ errorStatusGroup['1'] }}</p>
      </template>
    </PvCard>
    <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3 class="text-yellow-500" >Upgrading</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/upgrading.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p style="font-size: large; font-weight:600;" >{{ errorStatusGroup['2'] }}</p>
      </template>
    </PvCard>
    <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3 class="text-teal-300" >Running Test</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/testing.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p style="font-size: large; font-weight:600;">{{ errorStatusGroup['3'] }}</p>
      </template>
    </PvCard>
    <PvCard class="" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3 class="text-purple-700" >Finishing</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/finishing.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p style="font-size: large; font-weight:600;">{{ errorStatusGroup['4'] }}</p>
      </template>
    </PvCard>
   </div>
     <div class="flex justify-content-center">
       <PvCard  style= "margin-right: 2rem; width: 21rem; height: 20rem; margin-bottom: 2em">
         <template #title>
          <div>
            <PvChart  type="polarArea" :data="chartData" :options="chartOptions" />
          </div>

         </template>
        </PvCard>
        <PvCard class="" style=" margin-right: 2rem;  width: 40rem; height: 20rem; margin-bottom: 2em">
         <template #title>
           <div class="bar-container">
             <PvChart type="bar" :data="chartData2" :options="chartOptions2" />
           </div>

         </template>
       </PvCard>
       <PvCard  style= "margin-right: 2rem; width: 21rem; height: 20rem; margin-bottom: 2em">
         <template #title>
           <PvListbox v-model="selectedProject" :options="projectList" :multiple="true" :filter="true" optionLabel="parentDefinition"  listStyle="max-height:230px" style="width:19rem" filterPlaceholder="Ara">
             <template #option="slotProps">
               <div class="country-item">
                 <div>{{slotProps.option.parentDefinition}}</div>
               </div>
             </template>
           </PvListbox>
         </template>
       </PvCard>
   </div>

 </div>
</template>

<script>

import { onMounted, ref, computed} from "vue";
import RequestProjectService from "@/service/RequestProjectService";
import RequestCustomerService from "@/service/RequestCustomerService";
export default {
name:"DashboardView",
  setup(){

    const errorStatus=[]
    const errorStatusGroup=ref({})
    const errorDate=[]
    const errorDateGroup=ref({})
    const projectList=ref()
    const getErrors=()=>{
      RequestCustomerService.getErrorListSummary()
          .then((response) => {
            for(let i in response.data.payload ) {
              errorStatus[i] = response.data.payload[i].status;
            }
            errorStatusGroup.value= errorStatus.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
            console.log("errorStatus.value", errorStatusGroup.value['0'])

          })
    }
    const getErrorSummary = () =>{
      RequestCustomerService.getErrorListSummary()
          .then((response)=>{
        if(response.data.success){
          for(let i in response.data.payload) {
            errorDate[i]=formatDate(response.data.payload[i].createDate)
          }
          errorDateGroup.value= errorDate.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
        }
          })
    }
    const formatDate = (value) => {
      return new Date(value).toLocaleDateString('en-US',{
        month: "2-digit",
        }
      )};

    const getProjectList=()=>{
      RequestProjectService.getProjectSummary()
          .then((response)=>{
            if(response.data.success) {
              console.log("response proje", response);
              projectList.value = response.data.payload
            }
          }).catch((error)=>{
        console.log("error project list",error)
      })

    }
    const chartData = computed(()=>{
      return {
      datasets: [{
        data: [errorStatusGroup.value['0'],errorStatusGroup.value['1'],errorStatusGroup.value['2'],
          errorStatusGroup.value['3'],errorStatusGroup.value['4']],
        backgroundColor: ["#42A5F5","#66BB6A","#FFA726","#26C6DA","#7E57C2"],
        label: 'My dataset'
      }],
      labels: ["Waiting","Working","Upgrading","Running Test","Finished"]
    }});


    const chartOptions = computed(()=> {
      return {
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          }
        },
        scales: {
          r: {
            grid: {
              color: '#ebedef'
            }
          }
        }
      }
    });
    const chartData2 = computed(()=>{
    return {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      datasets: [{
        type: 'bar',
        label: 'Hata Sayısı',
        backgroundColor: '#66BB6A',
        data: [errorDateGroup.value["01"], errorDateGroup.value["02"], errorDateGroup.value["03"],
          errorDateGroup.value["04"], errorDateGroup.value["05"], errorDateGroup.value["06"],
          errorDateGroup.value["07"],errorDateGroup.value["08"], errorDateGroup.value["09"],
          errorDateGroup.value["10"],errorDateGroup.value["11"],errorDateGroup.value["12"]],
        borderColor: 'white',
        borderWidth: 2
      }]
    }
    });

    const chartOptions2 = ref({
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    });

    onMounted( ()=>{
      getErrors()
      getProjectList()
      getErrorSummary()

    })
    return {projectList,errorStatus,chartData,chartOptions,chartData2,chartOptions2,errorStatusGroup}
  }
}
/*const getErrors = () => {
    axios.get('data/data.json')
        .then((res) => {
          for(let i in res.data.data ) {
            errorStatus[i] = res.data.data[i].status;
          }console.log("errorStatus.value", errorStatus)

          errorStatusGroup.value = errorStatus.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
          console.log("reduce",errorStatusGroup.value)
          waitingcount.value=errorStatusGroup.value.waiting
          workingcount.value=errorStatusGroup.value.working
          upgradingcount.value=errorStatusGroup.value.upgrading
          runningtestcount.value=errorStatusGroup.value.runningtest
          finishedcount.value=errorStatusGroup.value.finished
        }).catch((err) => {
      console.log("error")
      console.log(err);
    })
  }*/
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
p {
  display: flex;
  justify-content: center;
  line-height: 1.5;
  margin: 0;
}
h3,{
  display: flex;
  justify-content: center;
}
.bar-container{
  height: 100%;
}

</style>


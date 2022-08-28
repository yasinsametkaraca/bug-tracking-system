<template>
 <div>
   <div class="flex justify-content-center mt-5">
     <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3>Waiting</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/waiting.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p>{{ waitingcount }}</p>
      </template>
    </PvCard>
    <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3>Working</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/working.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p>{{workingcount}}</p>
      </template>
    </PvCard>
    <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3>Upgrading</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/upgrading.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p>{{upgradingcount}}</p>
      </template>
    </PvCard>
    <PvCard class="mr-5" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3>Running Test</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/testing.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p>{{ runningtestcount }}</p>
      </template>
    </PvCard>
    <PvCard class="" style="width: 25rem; margin-bottom: 2em">
      <template #title>
        <div class="title">
          <div>
            <h3>Finishing</h3>
          </div>
          <div class="flex justify-content-center mt-3">
            <img src="../assets/finishing.png" style="height: 3rem" />
          </div>
        </div>
      </template>
      <template #content>
        <p>{{finishedcount}}</p>
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
        <PvCard class="" style="  width: 40rem; height: 20rem; margin-bottom: 2em">
         <template #title>
           <div class="bar-container">
             <PvChart type="bar" :data="chartData2" :options="chartOptions2" />
           </div>

         </template>
       </PvCard>
   </div>

 </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref} from "vue";
export default {
name:"DashboardView",
  setup(){
    const waitingcount = ref(0)
    const workingcount = ref(0)
    const upgradingcount = ref(0)
    const runningtestcount = ref(0)
    const finishedcount = ref(0)
    const errorStatus=[]
    const errorStatusGroup=ref()

    const getErrors = () => {
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
            console.log(waitingcount.value)
          }).catch((err) => {
        console.log("error")
        console.log(err);
      })
    }



    const chartData = ref({
      datasets: [{
        data: [waitingcount.value,workingcount.value,upgradingcount.value,runningtestcount.value,finishedcount.value],
        backgroundColor: ["#42A5F5","#66BB6A","#FFA726","#26C6DA","#7E57C2"],
        label: 'My dataset'
      }],
      labels: ["Waiting","Working","Upgrading","Running Test","Finished"]
    });


    const chartOptions = ref(
        {
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
    );
    const chartData2 = ref({
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz'],
      datasets: [{
        type: 'bar',
        label: 'Hata Sayısı',
        backgroundColor: '#66BB6A',
        data: [21,84,24,75,37,65,34],
        borderColor: 'white',
        borderWidth: 2
      }]
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

    onMounted(()=>{
      getErrors()
    })
    return {getErrors,errorStatus,upgradingcount,waitingcount,workingcount,runningtestcount,finishedcount,chartData,chartOptions,chartData2,chartOptions2,errorStatusGroup}
  }
}
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
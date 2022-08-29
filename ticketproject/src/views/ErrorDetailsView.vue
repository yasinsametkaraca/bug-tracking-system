<template>
  <div>
    <PvDataTable :value="errorList" responsiveLayout="scroll" ref="dt" >
      <template #header>
        <div class="flex justify-content-between col-12">
          <div class="flex justify-content-between" >
            <PvButton icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
          </div>
          <div class="flex justify-content-between" >
            <PvMultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                         placeholder="Select Columns" style="width: 20em"/>
          </div>
        </div>
      </template>
      <PvColumn field="errorTitle" header="Hata Adı" exportHeader="errorTitle"></PvColumn>
      <PvColumn field="createDate" header="Hata Oluşturulma Tarihi">
        <template #body="{data}">
          {{formatDate(data.createDate)}}
        </template>
      </PvColumn>
      <PvColumn field="updateDate" header="Son Güncelleme Tarihi">
        <template #body="{data}">
          {{formatDate(data.updateDate)}}
        </template>
      </PvColumn>
      <PvColumn field="status" header="Hata Durumu">
        <template #body="slotProps">
          {{getStatusDefinition(slotProps.data.status)}}
        </template>
      </PvColumn>
      <PvColumn v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index"></PvColumn>
    </PvDataTable>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import UserRequestService from "@/service/UserRequestService";
import {StatusTypeList} from "@/list";

export default {
  setup() {
    const columns = ref([
      {field: 'definition', header: 'Proje Adı'},
      {field: 'moduleDefinition', header: 'Modül Adı'},
      {field: 'userNameSurname', header: 'Müşteri Adı'},
      {field: 'name', header: 'Firma Adı'},
    ]);

    const onToggle = (val) => {
      selectedColumns.value = columns.value.filter(col => val.includes(col));
    };

    const selectedColumns = ref(columns.value);

    const errorList=ref()
    const getCustomerErrorDetails=()=>{

        UserRequestService.getErrorDetailSummary()
            .then((response)=>{
              if(response.data.success){
                errorList.value = response.data.payload
              }

    })
    }

    const getStatusDefinition =(errorStatus)=> {
      const errorDefArr =  StatusTypeList.filter((s) => s.Id == errorStatus);
      const errorDef = errorDefArr && errorDefArr.length > 0 ? errorDefArr[0].definition : "Undefined";
      return errorDef;
    }

    const formatDate = (value) => {
      return new Date(value).toLocaleDateString('en-US',{
        day: "2-digit",
        month: "2-digit",
        year: "numeric",}
      )};


    onMounted(() => {
      getCustomerErrorDetails()
    })

    const dt = ref();
    const exportCSV = () => {
      dt.value.exportCSV();
    };

    return { selectedColumns,dt,onToggle ,columns, exportCSV ,errorList,formatDate,getStatusDefinition}
  }
}
</script>
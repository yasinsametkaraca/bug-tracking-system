
import 'primevue/resources/themes/saga-blue/theme.css'
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import TabView from 'primevue/tabview';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import TabPanel from "primevue/tabpanel";
import ToastService from 'primevue/toastservice';
import DataTable from "primevue/datatable";
import ToggleButton from 'primevue/togglebutton';
import Calendar from "primevue/calendar";
import Column from 'primevue/column';
import ContextMenu from "primevue/contextmenu";
import Dialog from "primevue/dialog";
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
import Password from "primevue/password";
import Textarea from 'primevue/textarea';




const app = createApp(App);
app.use(router).mount('#app');
app.use(PrimeVue);
app.use(ToastService);
app.component('TabView', TabView);
app.component('PvButton', Button);
app.component('InputText', InputText);
app.component('TabPanel', TabPanel)
app.component('PvDataTable',DataTable)
app.component('PvColumn',Column)
app.component('ToggleButton',ToggleButton)
app.component('PvCalendar',Calendar)
app.component('ContextMenu',ContextMenu)
app.component('PvDialog',Dialog)
app.component('PvToast',Toast)
app.component('PvDropdown',Dropdown)
app.component('PvPassword',Password)
app.component('PvTextarea',Textarea)
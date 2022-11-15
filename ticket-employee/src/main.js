import "primevue/resources/themes/saga-blue/theme.css"       //theme
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons
import "primeflex/primeflex.css"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import ToastService from 'primevue/toastservice';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ContextMenu from "primevue/contextmenu"
import Password from "primevue/password"
import Dropdown from "primevue/dropdown";
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from "primevue/toast";
import Listbox from 'primevue/listbox';
import MegaMenu from "primevue/megamenu";
import Chart from "primevue/chart";
import Tree from "primevue/tree";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import SpeedDial from 'primevue/speeddial';
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.component('PvTabView',TabView);
app.component('PvTabPanel', TabPanel);
app.component('PvButton', Button);
app.component('InputText', InputText);
app.component('PvDialog', Dialog);
app.component('PvConfirmDialog', ConfirmDialog);
app.component('PvToast', Toast);
app.component('DataTable', DataTable);
app.component('PvColumn', Column);
app.component('ContextMenu', ContextMenu);
app.component('PvPassword', Password);
app.component('PvDropdown', Dropdown);
app.component('PvListbox', Listbox);
app.component('PvMegaMenu', MegaMenu);
app.component('PvChart', Chart);
app.component('PvTree', Tree);
app.component('PvAccordion', Accordion);
app.component('PvAccordionTab', AccordionTab);
app.component('PvSpeedDial', SpeedDial)
app.mount('#app');
export default app;
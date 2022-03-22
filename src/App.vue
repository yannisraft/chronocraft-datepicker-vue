<template>
<h1>Chronocraft Library Test Playground</h1>
<br/>
<h3>Datepicker Using Input field</h3>
<DatePicker :rangepicker="true" :showselecteddate="true" style="margin: 0px auto;">
</DatePicker>
<br/>
<h3>Datepicker Using Icon</h3>
<DatePicker :rangepicker="true" :showselecteddate="true" style="margin: 0px auto;" @on-date-selected="OnDateSelected">
    <template v-slot:inputfield="slotProps">
        <span class="material-icons-outlined" style="cursor: pointer;">date_range</span>
    </template>
</DatePicker>
<p>Selected Date: {{ selecteddata }}</p>
<h3>Datepicker Position Adjustment</h3>
<DatePicker :rangepicker="true" :showselecteddate="true" style="float: right; margin-right: 30px;" @on-date-selected="OnDateSelected">
    <template v-slot:inputfield="slotProps">
        <span class="material-icons-outlined" style="cursor: pointer;">date_range</span>
    </template>
</DatePicker>
</template>

<script>
import {
    defineComponent
} from 'vue';
import DatePicker from './components/DatePicker/DatePicker.vue';

import {
    formatDate
} from "./utilities/index";

export default defineComponent({
    name: 'App',    
    components: {
        DatePicker
    },
    data: function () {
        return {
          selecteddata: '-'
        }
    },
    methods: {
      OnDateSelected(selected) {
        console.log(selected.date);
        this.selecteddata = formatDate(selected.date, 'dd MMM yyyy') + ' - ' + formatDate(selected.enddate, 'dd MMM yyyy');
      }
    }
});
</script>

<style>
#app {
    font-family: 'Advent Pro', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1 {
    font-weight: 400 !important;
}

.widget-container {
    border: 0px solid;
    box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
    text-indent: 10px;
    font-size: 16pt;
    padding: 20px;
    margin: 0px auto;
    max-width: 50%;
    margin-bottom: 20px;
    position: relative;
}

.widget-container h3 {
    margin-top: 10px;
    font-family: 'Advent Pro', sans-serif;
    font-weight: 300 !important;
}

.madewith {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 12pt;
}

@media screen and (max-width: 600px) {
    .widget-container {
        max-width: 90%;
    }
}

@media screen and (max-width: 960px) {
    .widget-container {
        max-width: 70%;
    }
}
</style>

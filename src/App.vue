<template>
    <div class="ccr-panel">
        <h1>Chronocraft Library Test Playground</h1>
        <br />
        <h3>Datepicker Using Input field</h3>
        <DatePicker :rangepicker="true" :showselecteddate="true" style="margin: 0px auto;">
        </DatePicker>
        <br />
        <h3>Datepicker Using Icon</h3>
        <DatePicker :rangepicker="true" :showselecteddate="true" style="margin: 0px auto;" @on-date-selected="OnDateSelected">
            <template v-slot:inputfield="slotProps">
                <span class="ccr-icon material-icons-outlined" style="cursor: pointer;">date_range</span>
            </template>
        </DatePicker>
        <p>Selected Date: {{ selecteddata }}</p>
        <div class="absolutepos">
            <h4>Datepicker Position Adjustment</h4>
            <DatePicker :rangepicker="true" :showselecteddate="true" style="float: right; margin-right: 30px;" @on-date-selected="OnDateSelected">
                <template v-slot:inputfield="slotProps">
                    <span class="ccr-icon material-icons-outlined" style="cursor: pointer;">date_range</span>
                </template>
            </DatePicker>
        </div>        
        <div style="margin-top: 80px; float: right;width: 100%;">
            <button @click="ApplyTheme('Flat')" class="stylemodebtn" type="button">Theme Flat</button>
            <button @click="ApplyTheme('Stylus')" class="stylemodebtn" type="button">Theme Stylus</button>
            <button @click="ApplyTheme('Colored')" class="stylemodebtn" type="button">Theme Colored</button>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent
} from 'vue';
import DatePicker from './components/DatePicker/DatePicker.vue';

import { Theme } from "./interfaces";
import {
    ThemeManager,
    formatDate
} from "./utilities/index";

export default defineComponent({
    name: 'App',
    components: {
        DatePicker
    },
    data: function () {
        return {
            selecteddata: '-',
            themeManager: new ThemeManager(),
            themes: [
                {
                    name: "Flat",
                    link: "/themes/ccr.theme.flat/ccr.theme.flat.css"
                },
                {
                    name: "Stylus",
                    link: "/themes/ccr.theme.stylus/ccr.theme.stylus.css"
                },
                {
                    name: "Opus",
                    link: "/themes/ccr.theme.opus/ccr.theme.opus.css"
                }
            ]
        }
    },
    methods: {
        OnDateSelected(selected: any) {
            this.selecteddata = formatDate(selected.date, 'dd MMM yyyy') + ' - ' + formatDate(selected.enddate, 'dd MMM yyyy');
        },
        ApplyTheme(themename: string) {
            let theme = this.themes.find(i => i.name === themename);
            if(theme)
            {
                this.themeManager.theme = theme.name;
            }
        }
    },
    mounted() {       
        this.themeManager.setThemes(this.themes);
        this.themeManager.theme = 'Stylus';
    }
});
</script>

<style>
#app {    
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
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

.stylemodebtn {
    margin-left: 30px;
}

.absolutepos {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
}

.absolutepos h4 {
    margin: 0px 20px 0px 0px;
}

.ccr-panel {
    width: 50%;
    margin: 0px auto;
}
</style>

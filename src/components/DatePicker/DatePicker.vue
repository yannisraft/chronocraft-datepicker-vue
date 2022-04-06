<template>
<div class="datepicker-container">
    <div class="pickerbtn" @click="OnFocusInput(true)" @mouseover="inputhovering = true" @mouseleave="inputhovering = false">
        <slot :formatSelected="formatSelected" name="inputfield">
            <!-- <input type="text" v-model="formatSelected" id="date" @focusin="OnFocusInput(true)" @mouseover="inputhovering = true" @mouseleave="inputhovering = false" name="datepicker" class="datepicker-input" /> -->
            <input type="text" v-model="formatSelected" id="date" name="datepicker" class="datepicker-input" />
        </slot>
    </div>
    <div class="fixed-datepicker-container" :ref="el => {datepicker_container_element = el}">
        <div class="ccr-datepicker-panel" @mouseover="datepickerhovering = true" @mouseleave="datepickerhovering = false" :style="{visibility: showdatepicker ? 'visible' : 'hidden', 'left': positionX, 'top': positionY}" :ref="el => {datepicker_element = el}">
            <div class="ccr-.datepicker-header-year unselectable">
                <h4 @click="OpenSelectYear()">{{ yearlabel }}</h4>
            </div>
            <div class="datepicker-header-month unselectable">
                <div v-if="!selectMonthActive && !selectYearActive" class="datepicker-arrows arrow-left" @click="PreviousMonth()">&lt;</div>
                <h3 @click="OpenSelectMonth()">{{ monthlabel }}</h3>
                <div v-if="!selectMonthActive && !selectYearActive" class="datepicker-arrows arrow-right" @click="NextMonth()">&gt;</div>
            </div>
            <div v-if="showselecteddate" class="datepicker-header-fulldate unselectable">
                <h6>{{ fulldatelabel }}</h6>
                <h6 v-if="rangepicker">{{ rangeTotalDays }} days</h6>
            </div>
            <div class="datepicker-month-container">
                <div class="datepicker-weekdays unselectable">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class="datepicker-days">
                    <div v-for="(weekarray, index) in daysArray" class="days-row">
                        <div class="days-row">
                            <div v-for="(dayitem, index) in weekarray" @click="SelectDay(dayitem)" :class="[{notcurrentmonth: !dayitem.currentMonth}, { today: isToday(dayitem) }, { dayselected: isSelectedDay(dayitem) === 1}, { 'dayselected-start': isSelectedDay(dayitem) === 2}, { 'dayselected-end': isSelectedDay(dayitem) === 3}, { rangeday: isRangeDay(dayitem)}, 'datepicker-day', 'unselectable']">{{ dayitem.date.getDate() }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="selectMonthActive" class="datepicker-monthselect-container">
                    <div v-for="(months, months_index) in monthNamesArray" class="monthselect-row">
                        <div v-for="(month, month_index) in months" @click="SelectMonth(months_index, month_index)" :class="['monthselect-item','unselectable', { 'monthselect-selected': isSelectedMonth(months_index, month_index) }]">{{ month }}</div>
                    </div>
                </div>
                <div v-if="selectYearActive" class="datepicker-yearselect-container">
                    <div class="datepicker-arrows-year arrow-left" @click="UpdateYears(false)"></div>
                    <div class="datepicker-years-container">
                        <div v-for="(years, years_index) in yearsNamesArray" class="yearselect-row">
                            <div v-for="(year, month_index) in years" @click="SelectYear(year)" :class="['yearselect-item','unselectable', { 'yearselect-selected': isSelectedYear(year) }]">{{ year }}</div>
                        </div>
                    </div>
                    <div class="datepicker-arrows-year arrow-right" @click="UpdateYears(true)"></div>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script lang="ts">
// Component created with Composition API
// --------------------------------------

import {
    defineComponent,
    ref,
    reactive,
    onMounted,
    onUpdated,
    onBeforeMount,
    computed,
    getCurrentInstance
} from "vue";

import {
    enumerateDaysBetweenDates,
    formatDate,
    addDays,
    addMonths,
    checkIfWeekendDay,
    getDiff,
    getDiffInDays,
    daysMatch,
    isDateBetweenDatesExcluding
} from "./../../utilities/index";

export default defineComponent({
    name: 'DatePicker',
    components: {},
    props: {
        showselecteddate: {
            type: Boolean,
            default: false
        },
        dateformat: {
            type: String,
            default: "dd MMMM yyyy"
        },
        rangepicker: {
            type: Boolean,
            default: false
        },
        autohide: {
            type: Boolean,
            default: true
        }
    },
    setup(props, context) {
        const {
            ctx: _this
        }: any = getCurrentInstance()
        let thisapp: any = null;
        let showdatepicker = ref(false);
        let datepickerhovering = ref(false);
        let inputhovering = ref(false);
        let beginRow = "";
        let endRow = "";
        let selectedDate: any = ref(new Date());
        let selectedDate_end: any = ref(new Date());
        let rangePickStatus = 0;
        let rangeTotalDays = ref(0);
        let activeDate = new Date();
        let yearlabel = ref(selectedDate.value.getFullYear());
        let monthlabel = ref(formatDate(selectedDate.value, 'MMMM'));
        let fulldatelabel = ref(formatDate(selectedDate.value, 'dd MMMM yyyy'));
        let daysArray: any = ref([
            [],
            [],
            [],
            [],
            []
        ]);
        let monthNamesArray = ref([
            ['January', 'February', 'March'],
            ['April', 'May', 'June'],
            ['July', 'August', 'September'],
            ['October', 'November', 'December']
        ]);
        let yearsNamesArray: any = ref([
            [],
            [],
            [],
            [],
            [],
            []
        ]);
        let selectYearActive = ref(false);
        let selectMonthActive = ref(false);
        let datepicker_element: any = ref(null);
        let datepicker_container_element: any = ref(null);
        let positionX = ref("auto");
        let positionY = ref("auto");

        function Initialize() {
            RenderMonth(activeDate);
            RenderYears(new Date());
        }

        function OnFocusInput(show: any) {
            if (!show) {
                if (!datepickerhovering.value) {
                    showdatepicker.value = show;
                }
            } else {
                CalculateDatepickerPosition();
                showdatepicker.value = show;
            }

        }

        function addToCalendar(startDate: any, endDate: any, rowindex: any, monthType: any) {
            let today = new Date();
            var currentMonth = false;

            if (monthType === "previous") {

            } else if (monthType === "next") {

            } else {
                currentMonth = true;
            }

            var startIndex = startDate.getDate();
            var endIndex = endDate.getDate();

            for (var i = startIndex; i <= endIndex; i++) {
                /* var isToday = false;
                if (currentMonth && (i === today.getDate())) {
                    isToday = true;
                } */

                daysArray.value[rowindex].push({
                    day: i,
                    date: new Date(startDate.getFullYear(), startDate.getMonth(), i),
                    currentMonth: currentMonth
                });
            }
        }

        function RenderMonth(renderDate: any) {
            let rowindex = 0;
            daysArray.value = [
                [],
                [],
                [],
                [],
                []
            ];

            //var today = new Date();
            var firstDayOfMonth = new Date(renderDate.getFullYear(), renderDate.getMonth(), 1);
            var firstWeekdayIndex = firstDayOfMonth.getDay(); // Index of week day
            var firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);
            var lastDayOfMonth = addDays(firstDayOfNextMonth, -1);

            var previousMonthLastDay = addDays(firstDayOfMonth, -1);
            var previousMonthLastDayIndex = previousMonthLastDay.getDate();
            var previousMonthStartAddingIndex = previousMonthLastDayIndex - firstWeekdayIndex + 1;
            var previousMonthStartAddingDate = addDays(previousMonthLastDay, -firstWeekdayIndex + 1);

            // Add all days from previous month
            if (firstWeekdayIndex > 0) {
                addToCalendar(previousMonthStartAddingDate, previousMonthLastDay, rowindex, "previous");
            }

            // Fill out rest of row with current month
            var currentMonthLastWeekday = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), 7 - firstWeekdayIndex);
            addToCalendar(firstDayOfMonth, currentMonthLastWeekday, rowindex, "current");

            rowindex++;
            addToCalendar(addDays(currentMonthLastWeekday, 1), addDays(currentMonthLastWeekday, 7), rowindex, "current");
            currentMonthLastWeekday = addDays(currentMonthLastWeekday, 7);

            rowindex++;
            addToCalendar(addDays(currentMonthLastWeekday, 1), addDays(currentMonthLastWeekday, 7), rowindex, "current");
            currentMonthLastWeekday = addDays(currentMonthLastWeekday, 7);

            rowindex++;
            addToCalendar(addDays(currentMonthLastWeekday, 1), addDays(currentMonthLastWeekday, 7), rowindex, "current");
            currentMonthLastWeekday = addDays(currentMonthLastWeekday, 7);

            // Check if the 5th row is the last
            rowindex++;
            var diff = getDiffInDays(lastDayOfMonth, currentMonthLastWeekday);
            if (diff > 6) {
                addToCalendar(addDays(currentMonthLastWeekday, 1), addDays(currentMonthLastWeekday, 7), rowindex, "current");
                currentMonthLastWeekday = addDays(currentMonthLastWeekday, 7);
                rowindex++;
                daysArray.value.push([]);
            }

            // Add Last days of the month in the last row
            if (diff != 7) {
                addToCalendar(addDays(currentMonthLastWeekday, 1), lastDayOfMonth, rowindex, "current");
            }

            // Add First days of the next month
            var nextMonthLastWeekDay = addDays(firstDayOfNextMonth, 7 - firstDayOfNextMonth.getDay() - 1);
            addToCalendar(firstDayOfNextMonth, nextMonthLastWeekDay, rowindex, "next");

        }

        function PreviousMonth() {
            activeDate = addMonths(activeDate, -1);
            RenderMonth(activeDate);
            UpdateMonthandYear(activeDate);
        }

        function NextMonth() {
            activeDate = addMonths(activeDate, 1);
            RenderMonth(activeDate);
            UpdateMonthandYear(activeDate);
        }

        function UpdateMonthandYear(newdate: any) {
            yearlabel.value = activeDate.getFullYear();
            monthlabel.value = formatDate(activeDate, 'MMMM');
        }

        function OpenSelectYear() {
            if (!selectYearActive.value) {
                selectYearActive.value = true;
                selectMonthActive.value = false;
                monthlabel.value = 'Select Year';
            } else {
                selectYearActive.value = false;
                selectMonthActive.value = false;
                monthlabel.value = formatDate(activeDate, 'MMMM');
            }
        }

        function OpenSelectMonth() {
            if (!selectMonthActive.value) {
                selectYearActive.value = false;
                selectMonthActive.value = true;
                monthlabel.value = 'Select Month';
            } else {
                selectYearActive.value = false;
                selectMonthActive.value = false;
                monthlabel.value = formatDate(activeDate, 'MMMM');
            }
        }

        function SelectDay(dayitem: any) {
            if (!props.rangepicker) {
                selectedDate.value = dayitem.date;
                fulldatelabel.value = formatDate(dayitem.date, 'dd/MM/yyyy');
                //this.$forceUpdate();
                _this.$forceUpdate();

                setTimeout(() => {
                    if (props.autohide) showdatepicker.value = false;
                    context.emit("on-date-selected", {
                        date: dayitem.date
                    });
                }, 500);

            } else {
                if (rangePickStatus === 0) {
                    selectedDate.value = dayitem.date;
                    selectedDate_end.value = dayitem.date;
                    fulldatelabel.value = formatDate(dayitem.date, 'dd MMMM yyyy') + ' - ?';
                    _this.$forceUpdate();
                    rangePickStatus = 1;
                } else if (rangePickStatus === 1) {
                    if (dayitem.date < selectedDate.value) {
                        selectedDate_end.value = selectedDate.value;
                        selectedDate.value = dayitem.date;
                    } else {
                        selectedDate_end.value = dayitem.date;
                    }

                    fulldatelabel.value = (fulldatelabel.value).slice(0, -1);
                    fulldatelabel.value += formatDate(dayitem.date, 'dd MMMM yyyy');
                    rangeTotalDays.value = getDiffInDays(selectedDate_end.value, selectedDate.value);
                    _this.$forceUpdate();
                    rangePickStatus = 0;

                    setTimeout(() => {
                        if (props.autohide) showdatepicker.value = false;
                        context.emit("on-date-selected", {
                            date: selectedDate.value,
                            enddate: selectedDate_end.value
                        });
                    }, 500);
                } else {

                }
            }
        }

        function SelectMonth(months_index: any, month_index: any) {
            var selectedmonthIndex = (months_index * 3 + month_index);
            activeDate.setMonth(selectedmonthIndex);
            RenderMonth(activeDate);
            UpdateMonthandYear(activeDate);
            //fulldatelabel.value = formatDate(selectedDate, 'dd MMMM yyyy');
            selectMonthActive.value = false;
        }

        function SelectYear(year: any) {
            activeDate.setFullYear(year);
            RenderMonth(activeDate);
            UpdateMonthandYear(activeDate);
            selectYearActive.value = false;
        }

        function UpdateYears(nextyears: any) {
            var date = new Date();
            var newdate = date;
            if (nextyears) {
                var lastyear = yearsNamesArray.value[5][2];
                newdate.setFullYear(lastyear + 2);

            } else {
                var firstyear = yearsNamesArray.value[0][0];
                newdate.setFullYear(firstyear - 17);
            }

            RenderYears(newdate);
        }

        function RenderYears(newyear: any) {
            yearsNamesArray.value = [
                [],
                [],
                [],
                [],
                [],
                []
            ];

            let currentYear: any = newyear.getFullYear();

            yearsNamesArray.value[0].push(currentYear - 1);
            yearsNamesArray.value[0].push(currentYear);
            yearsNamesArray.value[0].push(currentYear + 1);

            var year: number = currentYear + 2;
            for (var f = 1; f < 6; f++) {
                for (var d = 0; d < 3; d++) {
                    yearsNamesArray.value[f].push(year);
                    year++;
                }
            }
        }

        function CalculateDatepickerPosition() {
            if (datepicker_element.value !== null && datepicker_container_element.value !== null) {

                const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

                let datepicker_rect = (datepicker_element.value).getBoundingClientRect();
                let datepicker_container_rect = (datepicker_container_element.value).getBoundingClientRect();

                let datepicker_width = datepicker_rect.width;
                let datepicker_height = datepicker_rect.height;
                let margin = 10;

                // Calculate Datepicker new position
                if (datepicker_container_rect.left + datepicker_width + margin > vw) {
                    let newPositionX = (vw - datepicker_width - margin);
                    positionX.value = newPositionX + "px";
                }

                if (datepicker_container_rect.top + datepicker_height + margin > vh) {
                    let newPositionY = (vh - datepicker_height - margin);
                    positionY.value = newPositionY + "px";
                }
            }
        }

        onMounted(() => {
            Initialize();

            window.addEventListener('resize', function (event) {
                CalculateDatepickerPosition();
            }, true);
        });

        onUpdated(() => {
            
        });

        onBeforeMount(() => {
            document.addEventListener("click", () => {
                if (!datepickerhovering.value && !inputhovering.value) {
                    showdatepicker.value = false;
                }
            });
        });

        const isToday = computed(() => {
            return (dayitem: any) => {
                var istoday = false;
                var today = new Date();
                if (dayitem.date.getDate() === today.getDate() && dayitem.date.getMonth() === today.getMonth() && dayitem.date.getFullYear() === today.getFullYear()) {
                    istoday = true;
                }
                return istoday;
            }
        });

        const isSelectedMonth = computed(() => {
            return (months_index: number, month_index: number) => {
                var isselected = false;
                var selectedmonthIndex = (months_index * 3 + month_index);
                if (selectedmonthIndex === selectedDate.value.getMonth()) {
                    isselected = true;
                }
                return isselected;
            }
        });

        const isSelectedYear = computed(() => {
            return (year: number) => {
                var isselected = false;
                if (year === selectedDate.value.getFullYear()) {
                    isselected = true;
                }
                return isselected;
            }
        });

        const isSelectedDay = computed(() => {
            return (dayitem: any) => {
                var isSelected = 0;
                if (props.rangepicker) {
                    if (dayitem.date.getDate() === selectedDate_end.value.getDate() && dayitem.date.getMonth() === selectedDate_end.value.getMonth() && dayitem.date.getFullYear() === selectedDate_end.value.getFullYear()) {
                        isSelected = 3;
                    }
                }

                if (dayitem.date.getDate() === selectedDate.value.getDate() && dayitem.date.getMonth() === selectedDate.value.getMonth() && dayitem.date.getFullYear() === selectedDate.value.getFullYear()) {
                    if (props.rangepicker) {
                        if (selectedDate_end.value.getDate() === selectedDate.value.getDate() && selectedDate_end.value.getMonth() === selectedDate.value.getMonth() && selectedDate_end.value.getFullYear() === selectedDate.value.getFullYear()) {
                            isSelected = 1;
                        } else {
                            isSelected = 2;
                        }
                    } else {
                        isSelected = 1;
                    }
                }

                return isSelected;
            }
        });

        const isRangeDay = computed(() => {
            return (dayitem: any) => {
                var isRange = false;
                if (props.rangepicker) isRange = isDateBetweenDatesExcluding(selectedDate.value, selectedDate_end.value, dayitem.date);
                return isRange;
            }
        });

        const formatSelected = computed(() => {
            var result = "";
            if (!props.rangepicker) {
                result = formatDate(selectedDate.value, props.dateformat);
            } else {
                result = formatDate(selectedDate.value, props.dateformat) + " - " + formatDate(selectedDate_end.value, props.dateformat);
            }

            return result;
        });

        return {
            showdatepicker,
            datepickerhovering,
            inputhovering,
            daysArray,
            monthNamesArray,
            yearsNamesArray,
            yearlabel,
            monthlabel,
            fulldatelabel,
            selectMonthActive,
            selectYearActive,
            selectedDate,
            selectedDate_end,
            isToday,
            isSelectedMonth,
            isSelectedYear,
            isSelectedDay,
            isRangeDay,
            positionX,
            positionY,
            formatSelected,
            datepicker_element,
            datepicker_container_element,
            rangeTotalDays,
            PreviousMonth,
            NextMonth,
            OpenSelectYear,
            OpenSelectMonth,
            SelectDay,
            SelectMonth,
            SelectYear,
            UpdateYears,
            CalculateDatepickerPosition,
            OnFocusInput
        }
    }
});
</script>

<style lang="css">
@import "./datepicker.css";
</style><style lang="css" scoped>

</style>

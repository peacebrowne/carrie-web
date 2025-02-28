<template>
  <div class="is-light-mode">
    <div class="mb-4 text-left">
      <span class="font-black">Scheduled Articles</span>
    </div>
    <Qalendar class="h-72" :events="events" :config="config" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Qalendar } from "qalendar";

const events = [
  // ...
  {
    title: "Advanced algebra",
    with: "Chandler Bing",
    time: { start: "2022-05-16 12:05", end: "2022-05-16 13:35" },
    color: "yellow",
    isEditable: false,
    id: "753944708f0f",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
  },
  {
    title: "Ralph on holiday",
    with: "Rachel Greene",
    time: { start: "2025-02-22", end: "2025-02-22" },
    color: "green",
    isEditable: false,
    id: "5602b6f589fc",
  },
];

const config = ref({
  week: {
    startsOn: "sunday",
    nDays: 7,
    scrollToHour: 5,
  },
  month: {
    showTrailingAndLeadingDates: false,
  },
  style: {
    fontFamily: "Nunito",
  },
  showCurrentTime: true,
  defaultMode: "month",
});
</script>

<style>
@import "qalendar/dist/style.css";

.svg-inline--fa.fa-calendar-day,
.date-picker__value-display-text {
  margin: auto;
}

.calendar-month__week-day-name,
.calendar-month__day-name {
  margin: 0 !important;
  padding: 1rem;
  font-weight: 700 !important;
}

.calendar-month__weekday {
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-month__event {
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-picker__value-display,
.calendar-header__chevron-arrows {
  gap: 0rem !important;
}

.calendar-header {
  padding: 0.7rem 2rem !important;
}

.event-flyout__row.is-description {
  font-size: small;
  text-align: left;
}

.male-color {
  padding: 0.3rem;
  background-color: #1971c2;
  height: 1px;
  border-radius: 50%;
}

.female-color {
  padding: 0.3rem;
  background-color: #0a6e31;
  height: 1px;
  border-radius: 50%;
}
</style>

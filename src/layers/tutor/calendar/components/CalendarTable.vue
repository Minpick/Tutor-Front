<template>
  <div class="wrapper">
    <ScheduleXCalendar :calendar-app="calendarApp" class="calendar">
      <template #eventModal="{ calendarEvent }">
        <EventModal :id="calendarEvent.id" :close="() => eventModal.close()" />
      </template>
    </ScheduleXCalendar>
  </div>
</template>


<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import '@schedule-x/theme-default/dist/index.css'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { useDark } from '@vueuse/core'
import { provide, watch, } from 'vue'
import '../calendar.css'
import dayjs from 'dayjs'


import { calendarService } from '../calendarService'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import EventModal from './EventModal.vue'
import { roundToNearest15Minutes } from '../utlis'





const eventsServicePlugin = createEventsServicePlugin();
const calendarControls = createCalendarControlsPlugin()
const eventModal = createEventModalPlugin()


// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const isDark = useDark()
const calendarApp = createCalendar({
  locale: 'ru-RU',
  isDark: isDark.value,
  weekOptions: {
    gridHeight: 1000,
    nDays: 7,
    eventWidth: 95,
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
  },
  monthGridOptions: {
    nEventsPerDay: 5,
  },
  views: [
    createViewDay(),
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),

  ],
  plugins: [
    createDragAndDropPlugin(),
    createResizePlugin(),
    createScrollControllerPlugin({
      initialScroll: '07:50'
    }),
    eventsServicePlugin,
    calendarControls,
    eventModal
  ],
  callbacks: {
    async onRangeUpdate(range) {
      const response = await calendarService.getAllEvents(range.start, range.end)
      calendarApp.events.set(response)
      console.log('new calendar range start date', dayjs.utc(range.start).toISOString())
      console.log('new calendar range end date', dayjs.utc(range.end).toISOString())
    },
    async beforeRender($app) {
      const range = $app.calendarState.range.value
      console.log('calendar rendered')
      if (range) {
        const response = await calendarService.getAllEvents((range?.start as string), (range?.end as string))
        calendarApp.events.set(response)
      }
    },
    onEventClick(calendarEvent) {
      console.log('onEventClick', calendarEvent)
    },
    onClickDate(date) {
      console.log('onClickDate', date) // e.g. 2024-01-01
    },
    async onClickDateTime(dateTime) {
      console.log(calendarApp.events.getAll())
      const newDateTime = roundToNearest15Minutes(dateTime)
      const newEvent = {
        id: 0,
        start: newDateTime,
        end: dayjs(newDateTime).add(2, 'hour').format('YYYY-MM-DD HH:mm')
      }
      setTimeout(() => {
        calendarApp.events.add(newEvent)
      }, 10)
      setTimeout(() => {
        const eventElement = document.querySelector(`[data-event-id="${newEvent.id}"] .sx__time-grid-event-inner`);
        if (eventElement) {
          const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, view: window });
          const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, view: window });
          eventElement.dispatchEvent(mouseDownEvent);
          setTimeout(() => {
            eventElement.dispatchEvent(mouseUpEvent);
          }, 50)
        } else {
          console.warn('Событие не найдено в DOM');
        }
      }, 50);

    },
  }
})
provide('calendarApp', calendarApp)
watch(isDark, (newIsDark) => {
  calendarApp.setTheme(newIsDark ? "dark" : "light")
})
</script>

<style scoped>
.calendar {
  font-weight: 600;
  height: calc(100vh - 100px);

  :global(.sx__range-heading::first-letter) {
    text-transform: uppercase;
  }

  :global(.sx__date-picker__month-view-header__month-year::first-letter) {
    text-transform: uppercase;
  }

  :global(.sx__date-input-chevron-wrapper:focus) {
    border: none;
  }

  :global(.sx__view-selection-items) {
    right: 50%;
    transform: translateX(50%);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px #cfcfcf;
  }

  :global(.sx__view-selection-item),
  :global(.sx__view-selection-selected-item) {
    transition: background-color .4s;
  }

  :global(.sx__date-input-label) {
    display: none;
  }

  @media (hover: hover) {
    :global(.sx__time-grid-event-resize-handle) {
      height: clamp(5px, 10px, 50%);
    }
  }

  :global(.sx__event-modal.is-open) {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #b4b4b4;
  }
}

.calendar :global(.dark) {
  :global(.sx__view-selection-items) {
    box-shadow: 0 0 5px #4d4d4d;
  }

  :global(.sx__chevron-wrapper:hover) {
    background-color: var(--sx-color-surface-container-low);
  }
}
</style>

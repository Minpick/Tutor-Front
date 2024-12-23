<template>
  <div :class='$style.wrapper' ref="element">
    <Tabs :value="CalendarEventType.LESSON">
      <TabList style="position: relative;">
        <Tab :value="CalendarEventType.LESSON">{{ CalendarEventTypeName.LESSON }}</Tab>
        <Tab :value="CalendarEventType.OTHER">{{ CalendarEventTypeName.OTHER }}</Tab>
        <i class="pi pi-times" @click="handleClose" :class="$style.exitIcon"></i>
      </TabList>
      <TabPanels>
        <TabPanel :value="CalendarEventType.LESSON">
          <LessonModal :id="id" />
        </TabPanel>
        <TabPanel :value="CalendarEventType.OTHER">
          <div>OTHER</div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang='ts'>
import { CalendarEventType, CalendarEventTypeName } from '@/app/enums/CalendarEnums';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue';
import LessonModal from './LessonModal.vue';
import { inject, onMounted, onUnmounted, } from 'vue';






type Props = {
  id: number
  close: ((payload: MouseEvent) => void) | undefined
}
const calendarApp = inject<{ events: { remove: (id: number) => void, get: (id: number) => void } }>('calendarApp')

const { id, close } = defineProps<Props>()

const handleClose = (e: MouseEvent) => {

  calendarApp?.events.remove(0)
  if (close) {
    close(e)
  }
}
onMounted(() => {
  const element = document.querySelector('.sx__event-modal');
  const uniqueId = element?.id;
  if (uniqueId) {
    const handler = (event: Event) => {
      const targetElement = document.getElementById(uniqueId);
      if (targetElement && !targetElement.contains((event.target as HTMLElement))) {
        if (calendarApp?.events.get(0)) {
          calendarApp?.events.remove(0)
        }
      }
    };
    document.addEventListener('click', handler, true);
    onUnmounted(() => {
      document.removeEventListener('click', handler);
    });
  }
});

</script>

<style module>
.wrapper {

  :global(.p-tab) {
    cursor: pointer;
    border-style: solid;
    border-width: var(--ui-tabs-tab-border-width);
    border-color: var(--ui-tabs-tab-border-color);
    font-weight: var(--ui-tabs-tab-font-weight);
    transition: background var(--ui-tabs-transition-duration), border-color var(--ui-tabs-transition-duration), color var(--ui-tabs-transition-duration), outline-color var(--ui-tabs-transition-duration), box-shadow var(--ui-tabs-transition-duration);
  }
}

.exitIcon {
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: font-size .4s;

  &:hover {
    font-size: 21px;
  }
}
</style>

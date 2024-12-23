<template>
  <div :class='$style.wrapper'>
    <div :class="$style.btns">
      <div v-if="$route.path.startsWith('/tutor')" style="width: 100%;"><Button as="router-link" label="Создать урок"
          :to="{ name: 'lessonsForm' }" /></div>
      <StudentsSelect v-model="studentId" />
    </div>
    <DataTable :value="data?.lessonsList" paginator :rows="size" tableStyle="min-width: 50rem" :class="$style.table"
      :dataKey="(student) => student.id" :rowsPerPageOptions="[5, 10, 20]" :totalRecords="data?.totalElements"
      @update:rows="(e) => size = e" v-on:page="(e) => page = e.page" :lazy="true"
      @row-click="(e) => $router.push({ name: 'lessonsForm', params: { id: e.data.id } })" removableSort
      v-on:sort="(e) => sortOrder = e.sortOrder">
      <Column field="fullName" header="Ученик" style="width: 15%" v-if="$route.path.startsWith('/tutor')"></Column>
      <Column field="grade" header="Класс" style="width: 5%;text-align: center;"
        v-if="$route.path.startsWith('/tutor')"></Column>
      <Column field="shortDescription" header="Описание" style="width: 25%"></Column>
      <Column field="date" header="Дата" style="width: 5%;text-align: center;">
        <template #body="slotProps">
          {{ dayjs(slotProps.data.startDate).format('DD.MM.YYYY')}}
        </template>
      </Column>
      <Column field="miroLink" header="Миро" style="width: 10%;text-align: center;">
        <template #body="slotProps">
          <MiroLink :link="slotProps.data.miroLink" />
        </template>
      </Column>
      <Column field="cost" header="Стоимость" style="width: 10%;text-align: center;"></Column>
      <Column field="paid" header="Оплачен" sortable style="width: 10%;text-align: center;">
        <template #body="slotProps">
          <BaseCheckbox v-model="slotProps.data.paid"
            style="display: flex;justify-content: center;pointer-events: none;" />
        </template>
      </Column>
      <Column field="homeWork" header="Задание" style="width: 15%;text-align: center;">
        <template #body="slotProps">
          <HomeWorkName :name="slotProps.data.homeWork" />
        </template>
      </Column>
    </DataTable>
  </div>
  <RouterView />
</template>

<script setup lang='ts'>
import { useQuery } from '@tanstack/vue-query';

import { Button, Column, DataTable } from 'primevue';
import { ref, } from 'vue';

import { lessonsService } from '../lessonsService';
import BaseCheckbox from '@/app/components/UI/BaseCheckbox.vue';
import HomeWorkName from '../components/HomeWorkName.vue';
import dayjs from 'dayjs';

import MiroLink from '../components/MiroLink.vue';
import StudentsSelect from '../components/StudentsSelect.vue';


const sortOrder = ref()
const studentId = ref(null)
const page = ref(0)
const size = ref(10)
const { data } = useQuery({ queryKey: ['lessons', size, page, studentId, sortOrder], queryFn: () => lessonsService.getLessons({ page: page.value, size: size.value, studentId: studentId.value, sortOrder: sortOrder.value }) })

</script>

<style module>
.wrapper {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;



  & .btns {
    display: flex;
    align-self: flex-start;
    gap: 20px;

    &>span {
      min-width: 250px
    }

    & div>a {
      background-color: transparent;
      color: var(--ui-primary-400);
      border: none;
      width: fit-content;

      &:hover {
        color: var(--ui-primary-600);
      }
    }
  }


}

.table {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 2px var(--gray-text);

  & tbody>tr {
    cursor: pointer;
  }
}

:global(.p-datatable-column-title) {
  width: 100%;
}

.selectBtn {
  width: fit-content;
}
</style>

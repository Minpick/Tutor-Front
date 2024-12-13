<template>
  <Dialog modal :header="isCreateForm ? 'Создать урок' : 'Редактировать урок'" v-model:visible="visible"
    v-on:hide="$router.go(-1)" :dismissableMask="true" :class="$style.wrapper" :contentClass="$style.content">
    <Form :class="$style.form" :validateOnValueUpdate="true" :resolver @submit="onFormSubmit" autocomplete="off">
      <LessonFormFields v-model="formState" />
      <Button type="submit" :label="isCreateForm ? 'Создать' : 'Редактировать'" />
      <Button label="Удалить" v-if="!isCreateForm" severity="danger" variant="outlined" @click="handleDelete" />
    </Form>
  </Dialog>
</template>

<script setup lang='ts'>
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { Button, Dialog, } from 'primevue';
import { computed, ref } from 'vue';


import { useQueryClient } from '@tanstack/vue-query';
import { useAutoQuery } from '@/app/composables/useAutoQuery';
import { useRoute, useRouter } from 'vue-router';

import { lessonsService } from '../lessonsService';
import type { Lesson } from '../LessonsTypes';
import { LessonStatus } from '@/app/enums/LessonStatus';
import { existValidation, regexValidation } from '@/app/utils/validation';
import LessonFormFields from '../components/LessonFormFields.vue';
import { rangeValidation } from '../../components/TimePicker/rangeValidations';
import dayjs from 'dayjs';



const visible = ref(true);
const queryClient = useQueryClient()
const route = useRoute()
const router = useRouter()
const isCreateForm = computed(() => !!!route.params.id)
const formState = ref<Lesson>({
  // duration: null,
  miroLink: '',
  shortDescription: '',
  cost: null,
  categoryId: 1,
  studentId: [],
  homeWork: LessonStatus.PROCESSING,
  paid: false,
  startTime: dayjs().format('HH:mm'),
  endTime: dayjs().add(1, 'hour').format('HH:mm'),
  date: new Date
});
useAutoQuery(formState, { queryKey: ['lessonInfo'], queryFn: () => lessonsService.getLessonInfo(Number(route.params.id)), retry: 1, enabled: !!route.params.id, gcTime: 0 })
//trigger to call authenticate function
//form validation
type Errors = {
  studentId: Array<object>,
  miroLink: Array<object>,
  startTime: Array<object>,
  endTime: Array<object>,
  date: Array<object>,
}
const resolver = () => {
  const errors: Errors = {
    studentId: existValidation(formState.value?.studentId, 'Выберите студента'),
    date: existValidation(formState.value?.date, 'Выберите дату'),
    miroLink: regexValidation(formState.value?.miroLink, 'Введите корректную ссылку', /^https:\/\/miro\..+/, true),
    startTime: rangeValidation(formState.value?.startTime, formState.value?.endTime, 'Введите корректное время'),
    endTime: rangeValidation(formState.value?.startTime, formState.value?.endTime, 'Введите корректное время'),
  };
  return {
    values: formState.value,
    errors
  };
}

const onFormSubmit = async (e: FormSubmitEvent) => {
  // e.originalEvent: Represents the native form submit event.
  // e.valid: A boolean that indicates whether the form is valid or not.
  // e.states: Contains the current state of each form field, including validity status.
  // e.errors: An object that holds any validation errors for the invalid fields in the form.
  // e.values: An object containing the current values of all form fields.
  // e.reset: A function that resets the form to its initial state.
  if (e.valid) {
    if (isCreateForm.value) {
      lessonsService.createLesson({ e, queryClient, router })
    } else {
      e.values.id = route.params.id
      lessonsService.updateLesson({ e, queryClient, router })
    }
  }
};
const handleDelete = () => {
  lessonsService.deleteLesson({ id: Number(route.params.id), queryClient, router })
}
</script>

<style module>
.wrapper {
  background-color: var(--frame);
  min-width: 0;
  max-width: 870px;
  width: 100%;
  padding: 1.2rem;

  &>:global(.p-dialog-header) {
    padding: 15px;
  }
}


.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  flex-grow: 1;
}

.form>ul {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "item1 item2"
    "item6 item3"
    "item7 item4"
    "desc item5"
    "desc item5";

  & span[name="shortDescription"] {
    grid-area: desc;
  }
}

/* .container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex: 1 1 0;
  max-width: 400px;
  width: 100%;
}

.splitContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  flex: 1 1 0;
  max-width: 400px;
  width: 100%;
} */
</style>

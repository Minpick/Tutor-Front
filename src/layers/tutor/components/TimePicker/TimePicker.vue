<template>
  <Select v-model="model" :options="options" optionLabel="value" :name="name" fluid optionValue="value"
    :placeholder="label" :class="$style.select" dropdownIcon="null" :unstyled="false" />
</template>

<script setup lang='ts'>
import { Select } from 'primevue';
import { ref, } from 'vue';
import { timeOptions } from './timeOptions';

type Props = {
  name?:string
  label?:string
}
defineProps<Props>()
const options = ref(timeOptions);
const model = defineModel()

</script>

<style module>
.select {
  width: 67px;

  :global(.p-select-dropdown){
    display: none;
  }
}
</style>

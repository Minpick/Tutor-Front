
import type { FormSubmitEvent } from "@primevue/forms";
import { apiClient } from "@/app/api";
import type { QueryClient } from "@tanstack/vue-query";
import type { Router } from "vue-router";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { CalendarEventType } from "@/app/enums/CalendarEnums";
import { convertTimeFromUTC, convertTimeToUTC } from "../calendar/utlis";




export const lessonsService = {
  getLessons: async ({ page, size, studentId, sortOrder }: { page: number, size: number, studentId: number | null, sortOrder: number | null }) => {
    const response = await apiClient.get(`/lesson/get?page=${page}&size=${size}&paid=${sortOrder||''}&studentId=${studentId || ''}`)
    return { lessonsList: response.data._embedded.showListLessonsDTOList, totalElements: response.data.page.totalElements }
  },
  getLessonInfo: async (id: number) => {
    const response = await apiClient.get(`/calendar/LESSON/${id}`)
    response.data.date = new Date(response.data.date)
    response.data.startTime = convertTimeFromUTC(response.data.startTime.slice(0,-3))
    response.data.endTime = convertTimeFromUTC(response.data.endTime.slice(0,-3))
    return response.data
  },
  getListOfStudents: async () => {
    const response = await apiClient.get(`/lesson/FIOStudents`)
    return response.data
  },
  createLesson: async ({ e, queryClient, router }: { e: FormSubmitEvent, queryClient: QueryClient, router: Router }) => {
    e.values.date = dayjs(e.values.date).format('YYYY-MM-DD')
    e.values.color = 'blue'
    e.values.eventType = CalendarEventType.LESSON
    e.values.startTime = convertTimeToUTC(e.values.startTime)
    e.values.endTime = convertTimeToUTC(e.values.endTime)
    apiClient.post('/calendar/event', e.values).then(() => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      router.go(-1)
    }).catch(error => {
      console.log(error)
    })
  },
  updateLesson: async ({ e, queryClient, router }: { e: FormSubmitEvent, queryClient: QueryClient, router: Router }) => {
    const id = e.values.id
    delete e.values.id
    e.values.date = dayjs(e.values.date).format('YYYY-MM-DD')
    e.values.color = 'blue'
    e.values.eventType = CalendarEventType.LESSON
    e.values.repeatType = 'ONE'
    e.values.startTime = convertTimeToUTC(e.values.startTime)
    e.values.endTime = convertTimeToUTC(e.values.endTime)
    apiClient.patch(`/calendar/event/${id}`, e.values).then(() => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      router.go(-1)
    }).catch(error => {
      console.log(error)
    })
  },
  deleteLesson: async ({ id, queryClient, router }: { id: number, queryClient: QueryClient, router: Router }) => {
    apiClient.delete(`/lesson/delete/${id}`).then(() => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      router.go(-1)
    })
  },
}



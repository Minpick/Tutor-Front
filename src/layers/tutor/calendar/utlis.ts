import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const formatISOToCalendarString = (ISOString: string) => {
  return dayjs(ISOString + 'Z').format('YYYY-MM-DD HH:mm')
}
export const formatCalendarStringToISO = (calendarString: string) => {
  return dayjs.utc(calendarString).toISOString().slice(0, -1)
}
export const roundToNearest15Minutes = (dateStr: string) => {
  const dt = dayjs(dateStr);

  // Получаем количество минут
  const minutes = dt.minute();

  // Округляем минуты до ближайших 15
  const roundedMinutes = Math.round(minutes / 15) * 15;

  // Округляем дату с новыми минутами, сбрасываем секунды и миллисекунды
  return dt
    .minute(roundedMinutes)
    .second(0)
    .millisecond(0)
    .format('YYYY-MM-DD HH:mm');
}
export const roundTimeToNearest30Minutes = (timeString: string) => {
  // Parse the input time
  const [hours, minutes] = timeString.split(':').map(Number);

  // Convert hours and minutes to total minutes
  const totalMinutes = hours * 60 + minutes;

  // Round to the nearest 30 minutes
  const roundedMinutes = Math.round(totalMinutes / 30) * 30;

  // Convert back to hours and minutes
  const roundedHours = Math.floor(roundedMinutes / 60) % 24;
  const roundedMinutesOnly = roundedMinutes % 60;

  // Format the result as HH:mm
  return `${String(roundedHours).padStart(2, '0')}:${String(roundedMinutesOnly).padStart(2, '0')}`;
}

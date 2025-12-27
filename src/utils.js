import dayjs from 'dayjs';


const MILISECONDS_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;

export const DateFormat = {
  monthDay: 'MMM D',
  hourMinute: 'HH:mm',
  yearMonthDay: 'YYYY-MM-DD',
  dateTime:'DD/MM/YY HH:mm',
  dateTimeT: 'YYYY-MM-DDTHH:mm'

};

export const getDefaultPoint = () => ({
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: 0,
  isFavorite: false,
  offers: [],
  type: 'taxi',
});

export function humanizeTaskDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat).toUpperCase() : '';
}

export function getTimePeriod(start, end) {
  const period = dayjs(end).diff(start) / MILISECONDS_IN_MINUTE;
  if (period < 0) {
    return 'неверные даты';
  }
  if (period < MINUTES_IN_HOUR) {
    return `${String(period.toFixed()).padStart(2,'0')} M`;
  }
  if (period < MINUTES_IN_DAY) {
    return `${String(~~(period / MINUTES_IN_HOUR)).padStart(2,'0')}H ${String(Math.ceil((period % MINUTES_IN_HOUR))).padStart(2,'0')}M`;
  }

  return `${String(~~(period / MINUTES_IN_DAY)).padStart(2,'0')}D ${String(~~(period % MINUTES_IN_DAY / MINUTES_IN_HOUR)).padStart(2,'0')}H ${String(Math.ceil((period % MINUTES_IN_HOUR))).padStart(2,'0')}M`;
}

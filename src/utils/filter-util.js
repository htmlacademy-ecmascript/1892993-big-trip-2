import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FilterType } from '../const.js';
dayjs.extend(utc);

export const filter = {
  [FilterType.EVERYTHING]:(points)=> points,
  [FilterType.FUTURE]: (points)=> points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs().utc())),
  [FilterType.PAST]:(points)=>points.filter((point) => dayjs(point.dateTo).isBefore(dayjs().utc())),
  [FilterType.PRESENT]: (points)=>points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs().utc()) && dayjs(point.dateTo).isAfter(dayjs().utc())),
};

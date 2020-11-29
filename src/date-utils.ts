import { DateTime } from 'luxon';
import { FrequencyType } from './enums';

export enum Criteria {
  None = 'none',
  Week = 'weekday,weeks',
  Month = 'day,months',
}

export const calculateNearestDates = (
  date: DateTime,
  days: number[] = [],
  criteria: Criteria
): DateTime[] => {
  const [a, b] = criteria.split(',');
  return days
    .map(day =>
      date.set({ [a]: day }).plus({ [b]: +(day <= (date as any)[a]) })
    )
    .sort((f, s) => (f < s ? -1 : 1));
};

const diffDays = (from: DateTime, to: DateTime): number =>
  from.diff(to, FrequencyType.D).days - 1;

export const nearestDate = (
  date: DateTime,
  days: number[] = [],
  criteria: Criteria,
  setupTime = 0
): DateTime | never => {
  if (days.length === 0)
    throw new Error('Days must have at least one element.');

  const [first, ...rest] = calculateNearestDates(date, days, criteria);

  if (diffDays(first, date) < setupTime) {
    const found = rest.find(r => diffDays(r, date) >= setupTime);

    if (found) return found;

    return nearestDate(date.plus({ days: setupTime }), days, criteria);
  }

  return first;
};

export const nearestDateInWeek = (date: DateTime, setupTime = 0): DateTime =>
  nearestDate(date, [1, 2, 3, 4, 5, 6, 7], Criteria.Week, setupTime);

export const times = (n: number) => (f: (i: number) => void): void => {
  const iter = (i: number) => {
    if (i === n) return;
    f(i);
    iter(i + 1);
  };
  return iter(0);
};

import { DateTime } from 'luxon';
import { FirstDeliveryType, FrequencyType, ScheduleType } from './enums';
import {
  Criteria,
  nearestDate,
  nearestDateInWeek,
  calculateNearestDates,
  times,
} from './date-utils';

export class Schedule {
  constructor(readonly type: ScheduleType, readonly units: number[]) {}

  isFree(): boolean {
    return this.type === ScheduleType.F;
  }

  isMonthly(): boolean {
    return this.type === ScheduleType.M;
  }
}

export class Frequency {
  constructor(readonly type: FrequencyType, readonly units: number) {}

  isSchedule(): boolean {
    return this.type === FrequencyType.S;
  }
}

export class FirstDelivery {
  constructor(readonly type: FirstDeliveryType, readonly setupTime: number) {}

  isSchedule(): boolean {
    return this.type === FirstDeliveryType.S;
  }
}

export const nextDeliveryDate = (
  date: DateTime,
  schedule: Schedule,
  frequency: Frequency
): DateTime =>
  frequency.isSchedule()
    ? nearestDate(date, schedule.units, Criteria[schedule.type])
    : date.plus({ [frequency.type]: frequency.units });

export default (
  date: DateTime,
  schedule: Schedule,
  frequency: Frequency,
  firstDelivery: FirstDelivery,
  extra = 1
): DateTime[] => {
  const dates: DateTime[] = [];
  if (schedule.isFree()) {
    const first = nearestDateInWeek(date, firstDelivery.setupTime);
    dates.push(first);

    const second = first.plus({ [frequency.type]: frequency.units });
    dates.push(second);
  } else {
    const criteria = Criteria[schedule.type];

    if (firstDelivery.isSchedule()) {
      const first = nearestDate(
        date,
        schedule.units,
        criteria,
        firstDelivery.setupTime
      );
      dates.push(first);

      const second = nextDeliveryDate(first, schedule, frequency);
      dates.push(second);
    } else {
      const first = nearestDateInWeek(date, firstDelivery.setupTime);
      dates.push(first);

      const fechaReferencia = first.plus({ [frequency.type]: frequency.units });

      const pool = calculateNearestDates(first, schedule.units, criteria);

      times(5)(() =>
        calculateNearestDates(
          pool[pool.length - 1],
          schedule.units,
          criteria
        ).forEach(d => pool.push(d))
      );

      pool.sort((a, b) =>
        Math.abs(fechaReferencia.diff(a, 'day').days) >
        Math.abs(fechaReferencia.diff(b, 'day').days)
          ? 1
          : -1
      );

      dates.push(pool[0]);
    }
  }

  times(extra)(() =>
    dates.push(nextDeliveryDate(dates[dates.length - 1], schedule, frequency))
  );

  return dates;
};

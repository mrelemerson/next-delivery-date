import { DateTime } from 'luxon';
import { FirstDeliveryType, FrequencyType, ScheduleType } from './enums';
import DeliveryDates, {
  FirstDelivery,
  Frequency,
  Schedule,
  nextDeliveryDate as ndd,
} from './delivery-dates';
import { times } from './date-utils';

function generateRange(start: number, end: number, step = 1): number[] {
  const arr = [];
  for (let i = start; i <= end; i += step) {
    arr.push(i);
  }
  return arr;
}

function units(data = ''): number[] {
  if (data.includes(',')) {
    return data.split(',').map(n => parseInt(n));
  }
  if (data.includes('-')) {
    const [start, end] = data.split('-');
    return generateRange(parseInt(start), parseInt(end));
  }
  return [parseInt(data)];
}

function ensureThatTheScheduleTypeIsAValidValue(value: string): void | never {
  if (!['F', 'W', 'M'].includes(value)) {
    throw new Error(`The Schedule Type <${value}> is invalid`);
  }
}

function ensureThatTheFrequencyTypeIsAValidValue(value: string): void | never {
  if (!['S', 'D', 'W', 'M'].includes(value)) {
    throw new Error(`The Frequency Type <${value}> is invalid`);
  }
}

function ensureThatTheFirstDeliveryTypeIsAValidValue(
  value: string
): void | never {
  if (!['F', 'S'].includes(value)) {
    throw new Error(`The First Delivery Type <${value}> is invalid`);
  }
}

function parseCommand(command: string): [Schedule, Frequency, FirstDelivery] {
  const [argSchedule, argFrequency, argFirstDelivery] = command.split(' ');

  const [scheduleType, rawScheduleUnits = '1'] = argSchedule.split('/');
  ensureThatTheScheduleTypeIsAValidValue(scheduleType);
  const scheduleUnits = units(rawScheduleUnits);
  const schedule = new Schedule(
    (ScheduleType as any)[scheduleType],
    scheduleUnits
  );

  const [frequencyType, strFrequencyUnits = '0'] = argFrequency.split('/');
  ensureThatTheFrequencyTypeIsAValidValue(frequencyType);
  const frequencyUnits = parseInt(strFrequencyUnits);
  const frequency = new Frequency(
    (FrequencyType as any)[frequencyType],
    frequencyUnits
  );

  const [firstDeliveryType, strSetupTime = '0'] = argFirstDelivery.split('/');
  ensureThatTheFirstDeliveryTypeIsAValidValue(firstDeliveryType);
  const setupTime = parseInt(strSetupTime);
  const firstDelivery = new FirstDelivery(
    (FirstDeliveryType as any)[firstDeliveryType],
    setupTime
  );

  return [schedule, frequency, firstDelivery];
}

export type Options = {
  command: string;
  strDate: string;
  dateFormat?: string;
  extra?: number;
};

export function nextDeliveryDate(options: Options): string[] {
  const opts = {
    dateFormat: 'yyyy-MM-dd',
    extra: 0,
    ...options,
  };

  const [schedule, frequency] = parseCommand(opts.command);

  const date = DateTime.fromFormat(opts.strDate, opts.dateFormat);

  const dates: DateTime[] = [];

  dates.push(ndd(date, schedule, frequency));

  times(opts.extra)(() =>
    dates.push(ndd(dates[dates.length - 1], schedule, frequency))
  );

  return dates.map(d => d.toFormat(opts.dateFormat));
}

export default (options: Options): string[] => {
  const opts = {
    dateFormat: 'yyyy-MM-dd',
    extra: 0,
    ...options,
  };

  const [schedule, frequency, firstDelivery] = parseCommand(opts.command);

  const date = DateTime.fromFormat(opts.strDate, opts.dateFormat);

  const dates = DeliveryDates(date, schedule, frequency, firstDelivery, opts.extra);

  return dates.map(d => d.toFormat(opts.dateFormat));
};

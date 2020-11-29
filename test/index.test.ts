import next, { nextDeliveryDate } from '../src';

describe('Calculation of delivery dates.', () => {
  it('Case 01 - W/1,4 W/2 S/1', () => {
    const dates = next({
      command: 'W/1,4 W/2 S/1',
      strDate: '2020-09-22',
      extra: 2,
    });
    expect(dates[0]).toEqual('2020-09-24');
    expect(dates[1]).toEqual('2020-10-08');
    expect(dates[2]).toEqual('2020-10-22');
    expect(dates[3]).toEqual('2020-11-05');
  });
  it('Case 01 - Next deliveries - W/1,4 W/2 S/1', () => {
    const dates = nextDeliveryDate({
      command: 'W/1,4 W/2 S/1',
      strDate: '2020-11-05',
      extra: 3,
    });
    expect(dates[0]).toEqual('2020-11-19');
    expect(dates[1]).toEqual('2020-12-03');
    expect(dates[2]).toEqual('2020-12-17');
    expect(dates[3]).toEqual('2020-12-31');
  });
  it('Case 02 - M/1,15 M/1 F/1', () => {
    const dates = next({
      command: 'M/1,15 M/1 F/1',
      strDate: '2020-09-22',
      extra: 1,
    });
    expect(dates[0]).toEqual('2020-09-24');
    expect(dates[1]).toEqual('2020-11-01');
    expect(dates[2]).toEqual('2020-12-01');
  });
  it('Case 03 - M/1,15 M/1 S/1', () => {
    const dates = next({
      command: 'M/1,15 M/1 S/1',
      strDate: '2020-09-22',
      extra: 1,
    });
    expect(dates[0]).toEqual('2020-10-01');
    expect(dates[1]).toEqual('2020-11-01');
    expect(dates[2]).toEqual('2020-12-01');
  });
  it('Case 04 - F D/9 F/2', () => {
    const dates = next({
      command: 'F D/9 F/2',
      strDate: '2020-09-22',
      extra: 1,
    });
    expect(dates[0]).toEqual('2020-09-25');
    expect(dates[1]).toEqual('2020-10-04');
    expect(dates[2]).toEqual('2020-10-13');
  });
  it('Case 05 - W/1,4 S S/1', () => {
    const dates = next({
      command: 'W/1,4 S S/1',
      strDate: '2020-09-22',
      extra: 1,
    });
    expect(dates[0]).toEqual('2020-09-24');
    expect(dates[1]).toEqual('2020-09-28');
    expect(dates[2]).toEqual('2020-10-01');
  });
  it('Case 06 - M/1,15 M/1 F', () => {
    const dates = next({
      command: 'M/1,15 M/1 F',
      strDate: '2020-09-22',
      extra: 1,
    });
    expect(dates[0]).toEqual('2020-09-23');
    expect(dates[1]).toEqual('2020-10-15');
    expect(dates[2]).toEqual('2020-11-15');
  });
});

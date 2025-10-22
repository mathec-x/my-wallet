import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { arrayGroupBy } from './group-by';

const array = [
  { data: '2022-01-01', id: 1, qtde_inf: 1, qtde_pass: 1 },
  { data: '2022-01-02', id: 1, qtde_inf: 2, qtde_pass: 1 },
  { data: '2022-02-01', id: 1, qtde_inf: 4, qtde_pass: 1, latitude: 80, longitude: -80 },
  { data: '2022-02-02', id: 1, qtde_inf: 4, qtde_pass: 1 },
  { data: '2022-02-03', id: 1, qtde_inf: 3, qtde_pass: 1 },
  { data: '2022-02-03', id: 2, qtde_inf: 23, qtde_pass: 1 },
  { data: '2022-02-04', id: 2, qtde_inf: 44, qtde_pass: 1 },
  { data: '2022-02-05', id: 2, qtde_inf: 45, qtde_pass: 1, latitude: -100, longitude: 100 },
  { data: '2022-02-06', id: 2, qtde_inf: 46, qtde_pass: 1, latitude: -200, longitude: 200 },
];

describe('ArrayGroupBy', () => {
  it('Should group by date', () => {
    const result = arrayGroupBy(
      array,
      // ['id'],
      (x) => x.data.substring(0, 7) + x.id,
      (current, next) => {
        return {
          id: current.id,
          violation: next.Sum(current.qtde_inf, next.violation),
          max: next.Max(current.qtde_inf, next.max),
          min: next.Min(current.qtde_inf, next.min),
          dates: next.ConcatArray(current.data, next.dates),
          coords: next.AorB({
            latitude: current.latitude,
            longitude: current.longitude
          }, next.coords),
          data: next.Has('data')
        };
      }
    );

    const [firstResult] = result;
    assert.deepStrictEqual(firstResult, {
      id: 1,
      violation: 3,
      max: 2,
      min: 1,
      dates: ['2022-01-01', '2022-01-02'],
      coords: {},
      data: false
    }, 'First Result Match');
  });
});
import assert from 'assert';
import { describe, it } from 'node:test';
import { arrayCount } from './count';

const array = [
  { id: 1, name: 'teste 001', query: { date: '00100101010' } },
  { id: 2, name: 'teste 002', query: { date: '00100101010' } },
  { id: 3, name: 'teste 002', query: { date: '00100101010' } },
  { id: 4, name: 'teste 002', query: { date: '00100101010' } }
];

describe('ArrayCounter', () => {
  it('Should return object when count by prop', () => {
    const result = arrayCount(array, 'name');
    assert.deepStrictEqual(result, [
      { name: 'teste 002', _count: 3 },
      { name: 'teste 001', _count: 1 }
    ]);
  });

  it('Should return number when count by function', () => {
    const result = arrayCount(array, e => e.id === 0);
    assert.equal(result, 0);
  });

  it('Should return number when count by property', () => {
    const result = arrayCount(array, { id: 1 });
    assert.equal(result, 1);
  });
});
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { arrayDistinct } from './distinct';

const array = [
  { id: 1, name: 'teste 001', code: 'abc', query: { createdAt: '00100101010', updatedAt: '00100101010' } },
  { id: 2, name: 'teste 002', code: 'bcd', query: { createdAt: '00100101010', updatedAt: '00100101010' } },
  { id: 3, name: 'teste 002', code: 'cde', query: { createdAt: '00100101010', updatedAt: '00100101010' } },
  { id: 4, name: 'teste 002', code: 'cde', query: { createdAt: '00100101010', updatedAt: '00100101010' } }
];

// const test = arrayDistinct(array, 'id', ['code', 'code[s]'] )

describe('ArrayDistinct', () => {
  it('Should group by dot paths and pluralized group', () => {
    const result = arrayDistinct(array, 'name', ['name[s]', 'query.createdAt']);

    assert.deepStrictEqual(result, [
      { 'query.createdAt': '00100101010', names: ['teste 001'] },
      { 'query.createdAt': '00100101010', names: ['teste 002'] }
    ]);
  });

  it('Should use defaults', () => {
    const x = [{ a: 1, b: 'not_default' }, { a: 1 }, { a: 2 }];
    const result = arrayDistinct(x, 'a', ['b', 'a[s]'], { b: 'default' });

    assert.deepStrictEqual(result, [
      { b: 'not_default', as: [1] },
      { b: 'default', as: [2] }
    ]);
  });

  it('Should group ids by name', () => {
    const result = arrayDistinct(array, 'name', ['name', 'id[s]']);
    assert.equal(result.length, 2);
    assert.deepStrictEqual(result[1], {
      name: 'teste 002',
      ids: [2, 3, 4]
    });
  });

  it('Should return object when count by prop with additional property observations', () => {
    const result = arrayDistinct(array, 'name', ['id', 'name', 'query'], { observations: 'default value' });
    assert.equal(result.length, 2);
    assert.deepStrictEqual(result, [
      {
        id: 1,
        name: 'teste 001',
        query: { createdAt: '00100101010', updatedAt: '00100101010' },
        observations: 'default value',
      }, {
        id: 4,
        name: 'teste 002',
        query: { createdAt: '00100101010', updatedAt: '00100101010' },
        observations: 'default value'
      }
    ]);
  });

  it('Should return fully object distinct by multiple keys', () => {
    const test = arrayDistinct(array, ['name', 'code']);

    assert.equal(test.length, 3);
    assert.deepStrictEqual(test, [
      {
        code: 'abc',
        id: 1,
        name: 'teste 001',
        query: {
          createdAt: '00100101010',
          updatedAt: '00100101010'
        }
      },
      {
        code: 'bcd',
        id: 2,
        name: 'teste 002',
        query: {
          createdAt: '00100101010',
          updatedAt: '00100101010'
        }
      },
      {
        code: 'cde',
        id: 4,
        name: 'teste 002',
        query: {
          createdAt: '00100101010',
          updatedAt: '00100101010'
        }
      }]
    );
  });
});
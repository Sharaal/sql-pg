const assert = require('power-assert').strict
const sinon = require('sinon')

describe('sql.update', () => {
  let sql
  beforeEach(() => {
    sql = require('../../../')()
  })

  it('insert single row', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
    }

    sql.client = client
    const actualId = await sql.insert(
      'table',
      { column1: 'value1', column2: 'value2', column3: 'value3' }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "id"',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('insert multiple rows', async () => {
    const expectedIds = [5, 15, 25]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
    }

    sql.client = client
    const actualIds = await sql.insert(
      'table',
      [
        { column1: 'value11', column2: 'value12', column3: 'value13' },
        { column1: 'value21', column2: 'value22', column3: 'value23' },
        { column1: 'value31', column2: 'value32', column3: 'value33' }
      ]
    )

    assert.deepStrictEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9) RETURNING "id"',
        values: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
      }
    )
  })

  it('return array of IDs if inserting single row as array', async () => {
    const expectedIds = [5]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
    }

    sql.client = client
    const actualIds = await sql.insert(
      'table',
      [
        { column1: 'value1', column2: 'value2', column3: 'value3' }
      ]
    )

    assert.deepStrictEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "id"',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('return overwritten default serial column', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ column4: expectedId }] }))
    }

    sql.client = client
    sql.defaultSerialColumn = 'column4'
    const actualId = await sql.insert(
      'table',
      { column1: 'value1', column2: 'value2', column3: 'value3' }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "column4"',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('return given serial column', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ column4: expectedId }] }))
    }

    sql.client = client
    const actualId = await sql.insert(
      'table',
      { column1: 'value1', column2: 'value2', column3: 'value3' },
      { serialColumn: 'column4' }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "column4"',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('insert given columns of row', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
    }

    sql.client = client
    const actualId = await sql.insert(
      'table',
      { column1: 'value1', column2: 'value2', column3: 'value3', column4: 'value4' },
      { columns: ['column1', 'column2'] }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2") VALUES ($1, $2) RETURNING "id"',
        values: ['value1', 'value2']
      }
    )
  })

  it('insert given columns of multiple rows', async () => {
    const expectedIds = [5, 15, 25]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
    }

    sql.client = client
    const actualIds = await sql.insert(
      'table',
      [
        { column1: 'value11', column2: 'value12', column3: 'value13', column4: 'value14' },
        { column1: 'value21', column2: 'value22', column3: 'value23', column4: 'value24' },
        { column1: 'value31', column2: 'value32', column3: 'value33', column4: 'value34' }
      ],
      { columns: ['column1', 'column2'] }
    )

    assert.deepStrictEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" ("column1", "column2") VALUES ($1, $2), ($3, $4), ($5, $6) RETURNING "id"',
        values: ['value11', 'value12', 'value21', 'value22', 'value31', 'value32']
      }
    )
  })

  it('insert single row into a table with schema', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
    }

    sql.client = client
    const actualId = await sql.insert(
      ['schema', 'table'],
      { column1: 'value1', column2: 'value2', column3: 'value3' }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "schema"."table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "id"',
        values: ['value1', 'value2', 'value3']
      }
    )
  })

  it('insert with SQL Tag and the standard default serial column', async () => {
    const expectedIds = [5, 15, 25]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ id })) }))
    }

    sql.client = client
    const actualIds = await sql.insert(
      sql`INSERT INTO "table" SELECT * FROM "table"`
    )

    assert.deepStrictEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" SELECT * FROM "table"',
        values: []
      }
    )
  })

  it('insert with SQL Tag and the overwritten default serial column', async () => {
    const expectedIds = [5, 15, 25]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ column: id })) }))
    }

    sql.client = client
    sql.defaultSerialColumn = 'column'
    const actualIds = await sql.insert(
      sql`INSERT INTO "table" SELECT * FROM "table"`
    )

    assert.deepStrictEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" SELECT * FROM "table"',
        values: []
      }
    )
  })

  it('insert with SQL Tag and the given serial column', async () => {
    const expectedIds = [5, 15, 25]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedIds.map(id => ({ column: id })) }))
    }

    sql.client = client
    const actualIds = await sql.insert(
      sql`INSERT INTO "table" SELECT * FROM "table"`,
      { serialColumn: 'column' }
    )

    assert.deepStrictEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    assert.deepStrictEqual(
      client.query.getCall(0).args[0],
      {
        text: 'INSERT INTO "table" SELECT * FROM "table"',
        values: []
      }
    )
  })
})

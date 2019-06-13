const assert = require('power-assert')
const sinon = require('sinon')

describe('sql.update', () => {
  let sql
  beforeEach(() => {
    sql = require('../../')
    sql.client = undefined
    sql.defaultSerialColumn = 'id'
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "id"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($6, $7, $8) RETURNING "id"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
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

    assert.deepEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9) RETURNING "id"',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($6, $7, $8), ($9, $10, $11), ($12, $13, $14) RETURNING "id"',
      parameters: ['value11', 'value12', 'value13', 'value21', 'value22', 'value23', 'value31', 'value32', 'value33']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
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

    assert.deepEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "id"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($6, $7, $8) RETURNING "id"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "column4"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($6, $7, $8) RETURNING "column4"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
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

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($1, $2, $3) RETURNING "column4"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg0 = actualArg(0)
    const expectedArg0 = expectedArg
    assert.deepEqual({ text: actualArg0.text, parameters: actualArg0.parameters }, expectedArg0)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2", "column3") VALUES ($6, $7, $8) RETURNING "column4"',
      parameters: ['value1', 'value2', 'value3']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })

  it('insert given keys of row', async () => {
    const expectedId = 5
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [{ id: expectedId }] }))
    }

    sql.client = client
    const actualId = await sql.insert(
      'table',
      { column1: 'value1', column2: 'value2', column3: 'value3', column4: 'value4' },
      { keys: ['column1', 'column2'] }
    )

    assert.equal(actualId, expectedId)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2") VALUES ($1, $2) RETURNING "id"',
      parameters: ['value1', 'value2']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2") VALUES ($6, $7) RETURNING "id"',
      parameters: ['value1', 'value2']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })

  it('insert given keys of multiple rows', async () => {
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
      { keys: ['column1', 'column2'] }
    )

    assert.deepEqual(actualIds, expectedIds)

    assert(client.query.calledOnce)

    const actualArg = client.query.getCall(0).args[0]
    const expectedArg = {
      text: 'INSERT INTO "table" ("column1", "column2") VALUES ($1, $2), ($3, $4), ($5, $6) RETURNING "id"',
      parameters: ['value11', 'value12', 'value21', 'value22', 'value31', 'value32']
    }
    assert.deepEqual({ text: actualArg.text, parameters: actualArg.parameters }, expectedArg)

    const actualArg5 = actualArg(5)
    const expectedArg5 = {
      text: 'INSERT INTO "table" ("column1", "column2") VALUES ($6, $7), ($8, $9), ($10, $11) RETURNING "id"',
      parameters: ['value11', 'value12', 'value21', 'value22', 'value31', 'value32']
    }
    assert.deepEqual({ text: actualArg5.text, parameters: actualArg5.parameters }, expectedArg5)
  })
})

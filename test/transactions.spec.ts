import { expect, describe, test, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test('user should be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: "Test transaction",
                amount: 1,
                type: 'credit',
            })
            .expect(201)
    })

    test('user should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "Test transaction",
                amount: 1,
                type: 'credit',
            })
            .expect(201)

        const session_id = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', session_id)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'Test transaction',
                amount: 1,
            })
        ])    
    })
    test('user should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "Test transaction",
                amount: 1,
                type: 'credit',
            })
            .expect(201)

        const session_id = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', session_id)
            .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id

        const getTransactionIdResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', session_id)
            .expect(200)

        expect(getTransactionIdResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'Test transaction',
                amount: 1,
            })
        )    
    })

    test('user should be able to get transactions summary', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "Test transaction",
                amount: 5000,
                type: 'credit',
            })

        const session_id = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
            .post('/transactions')
            .set('Cookie', session_id)
            .send({
                title: "Test transaction",
                amount: 2000,
                type: 'debit',
            })

        const summaryResponse = await request(app.server)
            .get(`/transactions/summary`)
            .set('Cookie', session_id)
            .expect(200)

        expect(summaryResponse.body).toEqual({
            amount: 3000
        })    
    })
})
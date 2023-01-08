import {createMockContext, MockContext} from '../context'
import userFactory from '../factories/user'
import {TimeShardService} from '../../services'
import {TransactionTypeEnum} from '../../services/types'
import {UserService} from '../../services/UserService'
import {expect, jest, test} from '@jest/globals';


jest.mock('../../services/UserService')
//@ts-ignore
UserService.mockImplementation(() => ({
    findUserById: (id) => ({
        id,
        timeShards: 100
    })
}))

let mockCtx: MockContext
let timeShardService: TimeShardService


beforeEach(() => {
    mockCtx = createMockContext()
    mockCtx.prisma.user.findUnique.mockResolvedValue(null)
    mockCtx.prisma.transactionHistory.findMany.mockResolvedValue([])
    timeShardService = new TimeShardService(mockCtx.prisma)
})

test('get user transaction history ', async () => {
    const {id: userId} = userFactory.build()

    await timeShardService.getTransactionHistoryItemsByUserId(
        {
            userId
        })

    expect(mockCtx.prisma.transactionHistory.findMany).toHaveBeenCalledWith({
        where: {
            userId,
        },
    })

})

describe('some test', () => {
    beforeEach(() => {
        mockCtx.prisma.transactionHistory.findMany.mockResolvedValue([
            {
                id: '1',
                userId: 'userid',
                previousTimeShards: 0,
                timeShardsDelta: 20,
                updatedTimeShards: 20,
                transactionType: TransactionTypeEnum.credit
            },
            {
                id: '2',
                userId: 'userid',
                previousTimeShards: 10,
                timeShardsDelta: 10,
                updatedTimeShards: 10,
                transactionType: TransactionTypeEnum.debit
            },
            {
                id: '3',
                userId: 'userid',
                previousTimeShards: 10,
                timeShardsDelta: 10,
                updatedTimeShards: 0,
                transactionType: TransactionTypeEnum.debit
            }
        ])
    })

    test('get user balance ', async () => {
        const {id: userId} = userFactory.build()

        const result = await timeShardService.getUserBalance(
            {
                userId,
            })


        expect(result.userId).toEqual(userId)
        expect(result.timeShardBalance).toEqual(0)
    })
})


test('debit account ', async () => {
    const {id: userId} = userFactory.build()

    const amountToDebit = 100

    const result = await timeShardService.debitAccount(
        {
            userId,
            amountToDebit,
            transactionType: TransactionTypeEnum.debit,
        })


    expect(result.userId).toEqual(userId)
    expect(mockCtx.prisma.transactionHistory.create).toHaveBeenCalled()
    expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
        where: {
            id: userId,
        },
        data: {
            timeShards: 0,
        },
    })
})

test('credit account ', async () => {
    const {id: userId} = userFactory.build()

    const amountToCredit = 100

    const result = await timeShardService.creditAccount(
        {
            userId,
            amountToCredit,
            transactionType: TransactionTypeEnum.debit,
        })


    expect(result.userId).toEqual(userId)
    //This is kind of testing a side effect, wonder if I can do this nicer
    expect(mockCtx.prisma.transactionHistory.create).toHaveBeenCalled()
    expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
        where: {
            id: userId,
        },
        data: {
            timeShards: 200,
        },
    })
})
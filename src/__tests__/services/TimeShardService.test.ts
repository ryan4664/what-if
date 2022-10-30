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
    // @ts-ignore
    mockCtx.prisma.user.findUnique.mockResolvedValue([])
    timeShardService = new TimeShardService(mockCtx.prisma)
})

test('debit account ', async () => {
    const {id: userId} = userFactory.build()

    const amountToDebit = 100

    const result = await timeShardService.debitAccount(
        {
            userId,
            amountToDebit,
            transactionType: TransactionTypeEnum.testDebit,
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
            transactionType: TransactionTypeEnum.testDebit,
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
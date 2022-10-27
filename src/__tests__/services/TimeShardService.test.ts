import { createMockContext, MockContext } from '../context'
import userFactory from '../factories/user'
import { TimeShardService } from '../../services'
import { TransactionTypeEnum } from '../../services/types'
import { UserService } from '../../services/UserService'

jest.mock('../../services/UserService')
//@ts-ignore
UserService.mockImplementation(() => ({ findUserById: (a) => a }))

let mockCtx: MockContext
let timeShardService: TimeShardService

beforeEach(() => {
    mockCtx = createMockContext()
    // @ts-ignore
    mockCtx.prisma.user.findUnique.mockResolvedValue([])
    timeShardService = new TimeShardService(mockCtx.prisma)
})

test('getUserBalance ', async () => {
    const { id: userId } = userFactory.build()


    const amountToDebit = 100

    const result = await timeShardService.debitAccount(
        {
            userId,
            amountToDebit,
            transactionType: TransactionTypeEnum.testDebit,
        })


    expect(result.userId).toEqual(userId)
    expect(result.timeShardBalance).toEqual(0)
})

// test('debitAccount ', async () => {
//   const { id: userId } = userFactory.build()
//
//   const amountToDebit = 100
//
//   const result = await timeShardService.debitAccount(
//     {
//       userId,
//       amountToDebit,
//       transactionType: TransactionTypeEnum.testDebit
//     })
//
//
//   expect(result.length).toEqual(0)
// })
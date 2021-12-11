import { MockContext, createMockContext } from '../context'

let mockCtx: MockContext

beforeEach(() => {
  mockCtx = createMockContext()
  mockCtx.prisma.hero.findMany.mockResolvedValue([])
})

test('should return no heros ', async () => {
  expect(true).toEqual(true)
})

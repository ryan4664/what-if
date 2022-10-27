export enum TransactionTypeEnum {
    testDebit = -2,
    testCredit = -1,
    heroPurchaseDebit = 1
}

export interface UserBalance {
    userId: string
    timeShardBalance: number
}
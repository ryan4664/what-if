export enum TransactionTypeEnum {
	heroPurchaseDebit = 1,
	credit = 1,
	debit = 2,
}

export interface UserBalance {
	userId: string
	timeShardBalance: number
}
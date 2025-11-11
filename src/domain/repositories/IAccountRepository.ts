import type { Account, AccountTransaction, AddCreditDTO } from '@/domain/entities/Account'

export interface IAccountRepository {
  addCredit(data: AddCreditDTO): Promise<AccountTransaction>
  getHistory(customerId: string): Promise<{ transactions: AccountTransaction[] }>
  getByCustomerId(customerId: string): Promise<Account>
}

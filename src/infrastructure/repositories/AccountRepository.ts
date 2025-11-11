import type { Account, AccountTransaction, AddCreditDTO } from '@/domain/entities/Account'
import type { IAccountRepository } from '@/domain/repositories/IAccountRepository'
import { httpClient } from '../http/httpClient'

export class AccountRepository implements IAccountRepository {
  async addCredit(data: AddCreditDTO): Promise<AccountTransaction> {
    return httpClient.post<AccountTransaction>('/accounts/credit', data)
  }

  async getHistory(customerId: string): Promise<{ transactions: AccountTransaction[] }> {
    return httpClient.get<{ transactions: AccountTransaction[] }>(
      `/accounts/history/${customerId}`,
    )
  }

  async getByCustomerId(customerId: string): Promise<Account> {
    return httpClient.get<Account>(`/accounts/customer/${customerId}`)
  }
}

export const accountRepository = new AccountRepository()

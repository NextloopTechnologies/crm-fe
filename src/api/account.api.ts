import api from '@/lib/axios'
import type { CreateAccountRequest, PaginatedResponse } from '@/types/api.types'

  export const createAccount = async (data: CreateAccountRequest) => {
    const response = await api.post(
      '/account/register',
      data
    );
  
    return response.data;
  };

  export const getAllAccounts = async () => {

    const response = await api.get('account/getAllAccounts');
  
    return response.data;
  };

  
  export const getAccountByAccountNumber = async (accountNumber: string) => {
    const response = await api.get(
      `/account/getAccount?accountNoOrMobileOrEmail=${accountNumber}`
    );  
    return response.data;
  };

   export const updateAccount = async (
      accountNumber: string,
      payload: CreateAccountRequest
    ) => {
      const response = await api.patch(
        `account/updateAccountDetails?accountNumber=${accountNumber}`,
        payload
      );
    
      return response.data;
    };
  


import api from '@/lib/axios'
import type { CreateUserRequest } from '@/types/api.types'

  export const registerUser = async (data: CreateUserRequest) => {
    const response = await api.post(
      '/user/register',
      data
    );
  
    return response.data;
  };

  export const getAllUsers = async () => {

    const response = await api.get('user/getAllEmployee');
  
    return response.data;
  };

  
  export const getUserByEmail = async (email: string) => {
    const response = await api.get(
      `user/getUser?userNameOrMobileOrEmail=${email}`
    );  
    return response.data;
  };

   export const updateUser = async (
    id: number,
      payload: CreateUserRequest
    ) => {
      const response = await api.patch(
        `user/updateUserDetails?userId=${id}`,
        payload
      );
    
      return response.data;
    };
  


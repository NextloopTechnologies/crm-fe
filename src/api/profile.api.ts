import api from '@/lib/axios'

  export const myProfile = async () => {
    const response = await api.get(
      'user/getOwnProfileDetail'
    );
    return response.data;
  };

  export const updateProfileDetail = async (profileData: any) => {
    const response = await api.post(
      '/user/updateUserDetails?userId=1',
      profileData 
    );
    return response.data;
  }
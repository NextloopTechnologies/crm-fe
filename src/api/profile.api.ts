import api from '@/lib/axios'

  export const myProfile = async () => {
    const response = await api.get(
      'user/getOwnProfileDetail'
    );
    return response.data;
  };


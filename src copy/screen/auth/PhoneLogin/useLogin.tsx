import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { errorToast } from '../../../utils/customToast';
import { LogiApi } from '../../../Api/apiRequest';

export interface LoginCredentials {
  email: string;
  password: string;
}

const useLogin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  // Govind@yopmail.com 
  // Govind@1245
  const [credentials, setCredentials] = useState<LoginCredentials>({
    // email: 'ustad4556@yopmail.com',
    // password: 'yourpassword',
    // email: 'ustad450@yopmail.com',
    // password: 'yourpassword',
    email: '',
    password: '',
    //     email: 'Govind@yopmail.com ',
    // password: 'Govind@1245',
    //     email: 'Ram12@yopmail.com',
    // password: 'Ram@12345',
  });

  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateFields = () => {
    const validationErrors: Partial<LoginCredentials> = {};
    if (!credentials.email?.trim()) validationErrors.email = 'Email is required';
    if (!credentials.password?.trim()) validationErrors.password = 'Password is required';
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    const param = {
      email: credentials.email.trim(),
      password: credentials.password.trim(),
      dispatch,
      navigation,
    };

    try {
      await LogiApi(param, setIsLoading);
    } catch (error: any) {
      errorToast(error?.message || 'Login error');
    }
  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    navigation,
  };
};

export default useLogin;

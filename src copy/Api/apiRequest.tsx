
import { base_url } from './index';
import { endpoints } from './endpoints';
import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess, logout } from '../redux/feature/authSlice';
import { store } from '../redux/store';
import { errorToast, successToast } from '../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogout = async (dispatch: any) => {
  try {
    dispatch(logout());
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

/** Clear auth state and storage when token is missing or session invalid */
const clearAuthSession = () => {
  try {
    store.dispatch(logout());
  } catch (e) {
    console.error('Error clearing auth session:', e);
  }
};

const saveAuthData = async (userData: any, token: any) => {
  try {
    await AsyncStorage.setItem('authData', JSON.stringify({ userData, token }));
    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};
const getAuthData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('authData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading auth data:', error);
    return null;
  }
};

export interface LoginApiParam {
  email: string;
  password: string;
  dispatch: any;
  navigation: any;
}

const LogiApi = async (
  param: LoginApiParam,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        email: param.email,
        password: param.password,
      }),
    };

    const response = await fetch(`${base_url}/${endpoints.Login}`, requestOptions);
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }

    // Success: 200 with data, or 404 "Merchant not found" but with userData + token (new merchant)
    const data = parsed?.data;
    const userData = data?.userData ?? data;
    const token =
      userData?.token ??
      data?.token ??
      userData?.access_token ??
      userData?.accessToken ??
      data?.access_token ??
      data?.accessToken ??
      '';

    const isSuccessWithData = parsed?.success === true && data;
    const is404WithUserAndToken =
      (parsed?.statusCode === 404 || parsed?.success === false) &&
      data?.userData &&
      token;

    if (isSuccessWithData || is404WithUserAndToken) {
      // Store token in AsyncStorage for API calls (e.g. merchant profile)
      if (token) {
        await AsyncStorage.setItem('token', token);
      }
      await saveAuthData(userData, token);

      if (is404WithUserAndToken) {
        successToast('Login successful. Please complete your merchant profile.');
      } else {
        successToast(parsed?.message ?? 'Login successful');
      }
      param.dispatch(loginSuccess({ userData, token }));

      param.navigation.reset({
        index: 0,
        routes: [{ name: ScreenNameEnum.MerchantDrawer }],
      });
      return parsed;
    }

    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};


export interface MerchantProfileData {
  merchantId?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

type OnUnauthorized = (() => void) | undefined;

const GetMerchantProfileApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<MerchantProfileData | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${base_url}/${endpoints.merchantProfile}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const raw = parsed.data;
      return {
        merchantId: raw?.userId?._id ?? raw?.merchantId ?? raw?._id,
        companyName: raw?.companyName,
        contactName: raw?.contactName,
        phone: raw?.phone,
        address: raw?.address,
        city: raw?.city,
        province: raw?.province,
        postalCode: raw?.postalCode,
      } as MerchantProfileData;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Failed to load profile');
      return undefined;
    }
    return undefined;
  } catch (error) {
    console.error('Merchant profile error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const UpdateMerchantProfileApi = async (
  payload: Partial<MerchantProfileData>,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<MerchantProfileData | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      // errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${base_url}/${endpoints.merchantAdminProfile}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      // errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      successToast(parsed?.message ?? 'Profile updated');
      const raw = parsed.data;
      return {
        merchantId: raw?.userId?._id ?? raw?.merchantId ?? raw?._id,
        companyName: raw?.companyName,
        contactName: raw?.contactName,
        phone: raw?.phone,
        address: raw?.address,
        city: raw?.city,
        province: raw?.province,
        postalCode: raw?.postalCode,
      } as MerchantProfileData;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      // errorToast(parsed?.message ?? 'Failed to update profile');
      return undefined;
    }
    return undefined;
  } catch (error) {
    console.error('Merchant profile update error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Privacy Policy - public GET, returns { content: string } */
const Privacypolicy = async (
  setLoading: (loading: boolean) => void,
): Promise<{ content?: string } | undefined> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.getPrivacy}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const content = parsed.data?.content ?? parsed.data?.description ?? parsed.data?.policy ?? '';
      return { content: typeof content === 'string' ? content : JSON.stringify(parsed.data) };
    }
    return parsed?.data ? { content: parsed.data?.content ?? '' } : undefined;
  } catch (error) {
    console.error('Privacy policy error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Terms and Conditions - public GET, returns { content: string } */
const Termsconditions = async (
  setLoading: (loading: boolean) => void,
): Promise<{ content?: string } | undefined> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.getTerms}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const content = parsed.data?.content ?? parsed.data?.description ?? parsed.data?.terms ?? '';
      return { content: typeof content === 'string' ? content : JSON.stringify(parsed.data) };
    }
    return parsed?.data ? { content: parsed.data?.content ?? '' } : undefined;
  } catch (error) {
    console.error('Terms conditions error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Create merchant order - POST /orders/merchant/create */
export interface CreateMerchantOrderPayload {
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  pickupLat: string;
  pickupLng: string;
  dropAddress: string;
  dropLat: string;
  dropLng: string;
}

const CreateMerchantOrderApi = async (
  payload: CreateMerchantOrderPayload,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${base_url}/${endpoints.ordersMerchantCreate}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true) {
      successToast(parsed?.message ?? 'Order created successfully');
      return parsed?.data ?? parsed;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Failed to create order');
      return undefined;
    }
    return undefined;
  } catch (error) {
    console.error('Create merchant order error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Get orders - GET /orders/all?page=1&limit=3 */
const GetOrdersAllApi = async (
  page: number = 1,
  limit: number = 3,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<{ orders?: any[]; total?: number } | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    console.log("token",token)
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const url = `${base_url}/${endpoints.ordersAll}`;
    // const url = `${base_url}/${endpoints.ordersAll}?page=${page}&limit=${limit}`;
    const response = await fetch(url, { method: 'GET', headers: myHeaders });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true) {
      const orders = parsed?.data?.orders ?? parsed?.data ?? (Array.isArray(parsed?.data) ? parsed.data : []);
      const total = parsed?.data?.total ?? parsed?.total ?? orders?.length ?? 0;
      return { orders: Array.isArray(orders) ? orders : [], total };
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    return { orders: [], total: 0 };
  } catch (error) {
    console.error('Get orders error:', error);
    return { orders: [], total: 0 };
  } finally {
    setLoading(false);
  }
};

/** Import orders CSV - POST /orders/import/csv with FormData */
const ImportOrdersCsvApi = async (
  fileUri: string,
  fileName: string,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const formData = new FormData();
    const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';
    const mimeMap: Record<string, string> = {
      csv: 'text/csv',
      pdf: 'application/pdf',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const mimeType = mimeMap[ext] || 'text/csv';

    formData.append('file', {
      uri: fileUri,
      name: fileName || 'orders.csv',
      type: mimeType,
    } as any);

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    // Do NOT set Content-Type - fetch sets multipart/form-data with boundary automatically

    const response = await fetch(`${base_url}/${endpoints.ordersImportCsv}`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true) {
      successToast(parsed?.message ?? 'File uploaded successfully');
      return parsed?.data ?? parsed;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    errorToast(parsed?.message ?? 'Failed to upload file');
    return undefined;
  } catch (error) {
    console.error('Import CSV error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Help / FAQ list - public GET, returns { data: Array<{ question, answer }> } */
const GethelpApi = async (
  setLoading: (loading: boolean) => void,
): Promise<{ data?: any[] } | undefined> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.getFaq}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const list = Array.isArray(parsed.data) ? parsed.data : parsed.data?.faq ?? parsed.data?.list ?? [];
      return { data: list };
    }
    return parsed?.data ? { data: Array.isArray(parsed.data) ? parsed.data : [] } : undefined;
  } catch (error) {
    console.error('Help/FAQ API error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

export {
  LogiApi,
  GetMerchantProfileApi,
  UpdateMerchantProfileApi,
  CreateMerchantOrderApi,
  GetOrdersAllApi,
  ImportOrdersCsvApi,
  Privacypolicy,
  Termsconditions,
  GethelpApi,
  handleLogout,
  getAuthData,
  saveAuthData,
};  
import axios from 'axios';

const API = axios.create({baseURL: 'http://localhost:5000'});
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  return req;
  });

export const signIn = (formData) => API.post('/user/signin', formData);



export const createArtical = (Articals) => API.post('/articals',Articals);

export const createUser = (users) => API.post('/user',users);

export const fetchArtical = () => API.get('/articals');

export const fetchUser = () => API.get('/user');

export const updateComment = (id, updatedComment) => API.patch(`/articals/comment/${id}`, updatedComment);

export const updateArtical = (id, updatedArtical) => API.patch(`/articals/${id}`, updatedArtical);

export const updatestatus=(id,updatedstatus)=>API.patch(`/articals/status/${id}`, updatedstatus)

export const updateUser = (id, updatedUser) => API.patch(`/user/${id}`, updatedUser);

export const deleteArtical = (_id) =>API.post(`/articals/delete/${_id}`);

export const deleteUser = (_id) =>API.post(`/user/delete/${_id}`);

export const getArtical = async (_id) => {
  _id = _id || '';
  return await API.get(`/articals/${_id}`);
}

export const getUser = async (_id) => {
  _id = _id || '';
  return await API.get(`/user/${_id}`);
}



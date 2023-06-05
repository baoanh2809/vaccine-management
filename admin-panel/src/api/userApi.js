import axiosClient from './axiosClient'

const userEndpoint = 'user'

const userApi = {
    getAll: () => axiosClient.get(userEndpoint),
    create: (params) => axiosClient.post(userEndpoint, params),
    getOne: (id) => axiosClient.get(`${userEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${userEndpoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${userEndpoint}/${id}`),
    vaccinated: (params) => axiosClient.post(`${userEndpoint}/vaccinated`, params)
}

export default userApi
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/v1';

export async function GetUserById(token, id) {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    return axios
        .get(`${API_URL}/user/${id}`, config)
        .then(response => {
            if (response.status === 200) {
                return response.data;
            }
        })
        .catch(error => console.error(error));
}
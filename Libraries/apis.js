import axios from 'axios'

//API url
const instance = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 1000,
});

//Gets all repos of an User
const getAllReposFromApi = async (login) => {
    try {
        let received = await instance.get(`/users/${login}/repos`)
        if (received.data) {
            return received.data.map((repo) => {
                const obj = {
                    name: repo.name,
                }
                return obj
            })
        }
    }
    catch (error) {
        alert(error)
        return false
    }
}

//Get repo information
const getRepoDetailsApi = async (login, repoName) => {
    try {
        let received = await instance.get(`/repos/${login}/${repoName}`)
        if (received.data) {
            let info = {
                name: received.data.name,
                description: received.data.description,
                html_url: received.data.html_url,
                language: received.data.language,
            }
            return info
        }
    }
    catch (error) {
        alert(error)
        return false
    }
}

//Get user information
const getUserFromApi = async (login) => {
    try {
        let data = await instance.get(`/users/${login}`)
        return data.data
    }
    catch (error) {
        alert("Usuário não encontrado. \n" + error)
        return false
    }
}

export {
    getUserFromApi,
    getAllReposFromApi,
    getRepoDetailsApi,
}
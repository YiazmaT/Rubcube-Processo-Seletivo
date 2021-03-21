import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 1000,
    //headers: {'X-Custom-Header': 'foobar'}
});

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

const getUserFromApi = async (login) => {
    try {
        let data = await instance.get(`/users/${login}`)
        return data.data
    }
    catch (error) {
        alert(error)
        return false
    }
}

export {
    getUserFromApi,
    getAllReposFromApi,
    getRepoDetailsApi,
}
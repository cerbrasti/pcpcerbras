import axios from 'axios'
const token = axios.create({
    baseURL: 'http://localhost:3001/login',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})

export async function AutenticarUsuario(usuario: string, senha: string){
    try {
        const response = await token.post('/acesso', { USUARIO: usuario, SENHA: senha })
        return response.data
    }catch(err: any /*eslint-disable-line @typescript-eslint/no-explicit-any */){
        throw new Error(`${err.response.data.message}`)
    }
} 
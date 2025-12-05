'use client';
import axios from 'axios'
import type { grupoDeProdutos } from '../types/grupoDeProdutos';
import type { Linhas } from '../types/Linhas';
import type { grupoLinhaProducao } from '../types/grupoLinhaProducao';

const api = axios.create({
    baseURL: 'http://localhost:3014/api/pcp',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})

export async function getGrupoDeProdutos(): Promise<grupoDeProdutos[]> {
    try {
        const response = await api.get('/grupoDeProdutos')
        return response.data
    }catch(err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */){
        throw new Error(`${err.response.data.message}`)
    }
}

export async function getLinhas(): Promise<Linhas[]> {
    try {
        const response = await api.get('/linhas')
        return response.data
    }catch(err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */){
        throw new Error(`${err.response.data.message}`)
    }
}

export async function postGrupoLinhaProducao(glp: grupoLinhaProducao){
    try {
        const response = await api.post('/grupoLinhaProducao', { glp: glp})
        return response.data
    }catch(err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */){
        throw new Error(`${err.response.data.message}`)
    }
}


export async function getGrupoLinhaProducao(): Promise<grupoLinhaProducao[]> {
    try {
        const response = await api.get('/grupoLinhaProducao')
        return response.data
    }catch(err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */){
        throw new Error(`${err.response.data.message}`)
    }
}
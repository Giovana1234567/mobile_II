import { Produto } from "./useProdutosAxios";

export function useProdutoFetch() {

    const URL = 'https://dummyjson.com/products'

    const carregar = async () => {
        const resposta = await fetch(URL);
        
        if (!resposta.ok) {
            throw new Error('Erro ao carregar produtos!');
        }

        return await resposta.json()
    }

    const criar = async (produto: Produto) => {
        const resposta = await fetch(URL + '/add', {
            method: 'POST',
            body: JSON.stringify(produto),
            headers: {
                "Content-Type": 'application/json'
            }
        })

        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar produto');
        }

        return resposta.json()
    }

    return {
        carregar
    }

}
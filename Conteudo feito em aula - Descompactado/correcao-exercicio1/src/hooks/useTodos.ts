import { Pagina } from "@/types/todo.response";
import { api } from "@/utils/api";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useTodos() {

    const carregarTodos = async (pagina: number, limite: number): Promise<Pagina> => {
        await delay(1500);
        const response = await api.get<Pagina>('/todos',{
            params: {
                skip: (pagina - 1) * limite,
                limit: limite
            }
        });
        return response.data;
    }

    return {
        carregarTodos
    }
}
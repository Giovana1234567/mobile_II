import { Pagina, Todo } from "@/types/todo.response";
import { api } from "@/utils/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useTodos() {
  const carregarTodos = async (
    pagina: number,
    limite: number,
  ): Promise<Pagina> => {
    await delay(1500);
    const response = await api.get<Pagina>("/todos", {
      params: {
        skip: (pagina - 1) * limite,
        limit: limite,
      },
    });
    return response.data;
  };

  const cadastrar = async (todo: Todo) => {
    return await api.post("/todos/add", todo);
  };

  const completar = async (todo: Todo) => {
    return await api.put("/todos/" + todo.id, {
      completed: true,
    });
  };

  const cadastrarFetch = async (todo: Todo) => {
    const resposta = await fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar!");
    }
  };

  return {
    carregarTodos,
    cadastrar,
    completar,
  };
}

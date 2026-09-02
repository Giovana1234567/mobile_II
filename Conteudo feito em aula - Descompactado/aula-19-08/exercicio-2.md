### Exercício — Listagem infinita com React Native

Implementar uma tela de **listagem infinita de tarefas** utilizando **React Native**, **FlatList** e **TanStack Query (`useInfiniteQuery`)**.

Para desenvolvimento, considere o seguindo endpoint da APi <b>DummyJson</b>:
`https://dummyjson.com/todos`

A paginação deverá utilizar os parâmetros `limit` e `skip`.

Exemplo: `https://dummyjson.com/todos?limit=10&skip=0`

Consulte a documentação para maiores informações: [DummyJSON — Todos](https://dummyjson.com/docs/todos#todos-limit_skip)

### Atividade

1. Pesquise rapidamente sobre `useInfiniteQuery`, sua responsabilidade e propriedades;

2. Crie uma tela que:
   - busque as tarefas da API;
   - exiba as tarefas utilizando `FlatList` (Dica: utilize a propriedade `onEndReached`);
   - carregue inicialmente 10 tarefas;
   - carregue automaticamente a próxima página ao chegar próximo ao final da lista;
   - utilize `limit` e `skip` para controlar a paginação.

3. Implemente:
   - indicador de carregamento inicial;
   - indicador de carregamento ao buscar a próxima página;
   - tratamento básico de erro;
   - mensagem ao chegar ao final da lista.

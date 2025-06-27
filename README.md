# Radar UI

Este sistema foi desenvolvido exclusivamente para fins de estudo e testes. Ele depende de dados fornecidos por terceiros através da API [radar_ativos_api](https://github.com/marco-ostaska/radar_ativos_api), que podem mudar a qualquer momento e comprometer seu funcionamento. Não há qualquer garantia sobre a precisão, disponibilidade ou continuidade das informações exibidas. O autor não se responsabiliza por eventuais perdas, danos ou decisões tomadas com base nos dados apresentados. Não utilize este sistema para análises financeiras reais ou decisões de investimento.

Este projeto é o frontend para a API [radar_ativos_api](https://github.com/marco-ostaska/radar_ativos_api). 

## Visão Geral

O Radar UI é um frontend desenvolvido em React, utilizando Vite, TailwindCSS e Radix UI, focado em facilitar o acompanhamento e a gestão de carteiras de investimentos, especialmente ações e fundos imobiliários (FIIs).


## Estrutura de Pastas

- **src/pages**: páginas principais do app (Carteira, Radar, Busca, Lista, Transações, Adição/Remoção de ativos).
- **src/components/ui**: biblioteca de componentes reutilizáveis (alert, badge, button, card, dialog, dropdown, input, label, progress, separator, sheet, sidebar, skeleton, table, tabs, tooltip, etc).
- **src/components/radar**: componentes específicos do radar de ativos.
- **src/api**: funções para acesso/manipulação de dados de carteira e transações.
- **src/hooks**: hooks customizados.
- **src/lib**: utilitários.

## Principais Funcionalidades

- Visualização e gerenciamento de carteira de ações e FIIs.
- Busca e listagem de ativos.
- Radar de oportunidades (ações/FIIs).
- Controle de transações (adicionar, editar, remover).
- Interface responsiva e moderna.



## APIs Internas

Funções para integração com backend ou mock de dados, localizadas em `src/api`:
- **Carteira**: `fetchCarteira`, `fetchCarteiraFiis`, `fetchCarteiraResumo`
- **Transações**: `fetchTransacoesAcoes`, `fetchTransacoesFiis`, `adicionarTransacaoAcoes`, `adicionarTransacaoFiis`, `atualizarTransacaoAcoes`, `atualizarTransacaoFiis`, `deletarTransacaoAcoes`, `deletarTransacaoFiis`

## Dependências e Scripts

Principais dependências:
- React, React DOM, Vite, TailwindCSS, Radix UI, React Router, React Hook Form, TanStack Query/Table, Zod, Lucide React, date-fns.

Scripts disponíveis:
- `dev`: inicia o servidor de desenvolvimento.
- `build`: gera a build de produção.
- `lint`: executa o linter.
- `preview`: visualiza a build de produção localmente.

## Instruções de Uso

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o projeto em modo desenvolvimento:
   ```bash
   npm run dev
   ```
3. Para gerar a build de produção:
   ```bash
   npm run build
   ```
4. Para visualizar a build:
   ```bash
   npm run preview
   ```

## Uso com Docker

O projeto inclui um `Dockerfile` de exemplo para facilitar o deploy em containers.

**Importante:**  
Ao rodar o frontend em container, não utilize `localhost` como endereço da API, pois dentro do container `localhost` se refere ao próprio container, não ao host ou outro serviço.  
É necessário informar o IP real do servidor da API ou usar o nome do serviço na rede Docker.

### Por que não usar localhost?

Quando o frontend está em um container, `localhost` aponta para o próprio container, não para o host ou outro container. Por isso, requisições para `localhost` não chegam à API se ela estiver rodando fora ou em outro container.

### Como definir o endpoint da API

Durante o build do container, defina o endpoint da API usando o argumento `VITE_SERVER_HOST`:

```bash
docker build --build-arg VITE_SERVER_HOST=http://SEU_IP_DA_API:8000 -t nome-da-imagem:tag .
```

Substitua o IP pelo endereço da sua API.

### Recomendações

- Se rodar a API em outro container, crie uma rede Docker customizada e use o nome do serviço como endpoint.
- Consulte o `Dockerfile` deste repositório para detalhes de configuração.

---

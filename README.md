# V.E.R.A — Valor Efetivo de Renda Analisada

V.E.R.A é um acrônimo para **Valor Efetivo de Renda Analisada**, um serviço que processa a renda e o tempo de trabalho de um profissional para embasar análises de crédito. A aplicação foi desenvolvida com uma abordagem componentizada e orientada a dados, projetada para ser performática e de fácil manutenção.

## Technology Stack

- **React** - Biblioteca de JavaScript para criar interfaces de usuário
- **TypeScript** - Tipagem estática para melhorar a experiência de desenvolvimento
- **Vite** - Ferramenta de build rápida para desenvolvimento
- **Tailwind CSS** - Biblioteca CSS para estilização
- **Shadcn/ui** - Biblioteca de componentes baseada em Radix UI
- **pnpm** - Gerenciador de pacotes rápido e eficiente
- **SWR** - Fetching de dados com cache e revalidação
- **React Router** - Gerenciamento de rotas
- **Tanstack Table** - Tabela com ordenação e paginação
- **React Hook Form + Zod** - Formulários com validação
- **Cypress** - Testes end-to-end

## Arquitetura do Projeto

O projeto segue uma arquitetura limpa, seguindo os princípios de separação de responsabilidades (separation of concerns), garantindo que a lógica de negócio `hooks`, a camada de dados `api` e a apresentação `components` estejam desacopladas.

```
src/
├── api/           # Camada de API
├── components/    # Componentes de UI
├── hooks/         # Custom hooks
├── lib/           # Funções utilitárias e configurações
├── pages/         # Componentes de rotas
└── types/         # Definições de tipos TypeScript
```

### Principais Recursos

- **Filtros**: Busca com debounce e critérios múltiplos
- **Ordenação por Colunas**: Todas as colunas com sort asc/desc
- **Design Responsivo**: Abordagem mobile-first com breakpoints
- **Validação de Dados**: Validação client-side com schemas Zod
- **Atualizações Otimistas**: Gerenciamento de cache do SWR para atualizações em tempo real
- **Modo View-Only**: Suporte a dados de mock para visualizar a UI sem backend
- **Testes End-to-End**: Cobertura de testes com Cypress

## Configuração e Instalação

### Pré-requisitos

- Node.js >= 18
- pnpm >= 8

### Instalação

```bash
# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env_example .env

# Inicialize a aplicação
pnpm dev
```

## Modo View-Only (Mock)

A aplicação suporta o modo para visualização de dados sem backend, controlado pela variável de ambiente `VITE_VIEW_ONLY`.

- `VITE_VIEW_ONLY=true`: Apresenta dados de mock.

- `VITE_VIEW_ONLY=false`: Apresenta dados reais.

### Comportamento no Modo View-Only

- **Exibição de Dados**: A tabela mostra 10 registros (mock)
- **Elementos Interativos**: Botões e formulários permanecem funcionais
- **Sem Chamadas de API**: As requisições retornam mock com atrasos realistas
- **Interações de Formulário**: É possível digitar e enviar, com mensagens de sucesso
- **Detalhe Estático**: Páginas de detalhe exibem sempre o mesmo registro (mock)
- **Filtros**: É possível digitar nos filtros, mas não há filtragem real

## Scripts Principais

| Script              | Descrição                                     |
| :------------------ | :-------------------------------------------- |
| `pnpm dev`          | Inicia a aplicação em modo de desenvolvimento |
| `pnpm build`        | Gera a build de produção                      |
| `pnpm preview`      | Serve a build de produção localmente          |
| `pnpm lint`         | Executa o linting do código                   |
| `pnpm cypress:open` | Executa o Cypress Test Runner                 |
| `pnpm cypress:run`  | Executa o Cypress em modo headless            |

## Testes

Para desenvolvimento e debug:

```bash
pnpm cypress:open
```

Para CI/CD e automação:

```bash
pnpm cypress:run
```

## Padrão de trabalho

1. Crie uma branch de funcionalidade
2. Faça suas alterações
3. Adicione testes para nova funcionalidade
4. Certifique-se que todos os testes passam
5. Envie um pull request

## Licença

Este projeto está licenciado sob a Licença MIT.

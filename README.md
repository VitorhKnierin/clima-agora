CLIMA AGORA

Aplicação web desenvolvida em React (Vite) que exibe o clima atual de qualquer cidade, consumindo a API pública do OpenWeatherMap.
Projeto da disciplina Implementação de Software, professor Marcel Camargo (IFSUL – Campus Bagé).

Tecnologias utilizadas

React + Vite

OpenWeatherMap (Weather + Geocoding)

CSS

(Opcional) Provider de fotos da cidade

Como executar o projeto

2.1 Clonar o repositório
$ git clone https://github.com/VitorhKnierin/clima-agora.git

$ cd clima-agora

2.2 Instalar dependências
$ npm install

2.3 Configurar variáveis de ambiente
Crie um arquivo chamado .env na raiz do projeto contendo:
VITE_OWM_API_KEY=sua_chave_aqui
(Existe um modelo de exemplo em .env.example)

2.4 Executar em modo desenvolvimento
$ npm run dev
Abra o endereço mostrado no terminal (ex.: http://localhost:5173
)

2.5 Scripts úteis

npm run dev -> inicia o servidor de desenvolvimento (Vite)

npm run build -> gera o build de produção

npm run preview -> pré-visualiza o build gerado localmente

Estrutura do projeto (resumo)
src/
components/
SearchBar.jsx - busca com autocomplete
WeatherCard.jsx - exibe dados do clima e a foto
hooks/
useWeather.js - lógica de busca/estado/erros
services/
openWeatherProvider.js - chamadas à API de clima
geoProvider.js - geocoding (nome -> lat/lon)
App.jsx
styles.css

Princípios SOLID aplicados (resumo)

SRP (Single Responsibility): cada parte tem uma função clara (SearchBar busca; WeatherCard exibe; useWeather gerencia estado).

OCP (Open/Closed): provedores de serviço ficam em services/; é possível trocar/estender a fonte de dados sem alterar o restante da aplicação.

Depuração (exemplos)

401 (API key ausente/errada): resolvido criando o arquivo .env com VITE_OWM_API_KEY.

Cidade não encontrada: mensagem amigável ao usuário.

Erros de rede: logs no console para diagnóstico (console.error).

Git e segurança (.gitignore recomendado)
Adicionar ao arquivo .gitignore (já incluso no projeto):
.env
.env.local
.env.*.local
node_modules/
dist/

Autores
Vitor Hugo Meira da Costa Knierin - Guilherme Nicolau - João Vitor Morales
IFSUL – Campus Bagé
Curso: Tecnólogo em Análise e Desenvolvimento de Sistemas

Repositório
https://github.com/VitorhKnierin/clima-agora

Licença
Uso acadêmico/educacional.
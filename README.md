# Nest.js Screenshot API

Uma API Nest.js para capturar screenshots de páginas web com base em URLs usando Playwright.

## 📖 Visão Geral

Esta aplicação fornece uma API REST simples para capturar screenshots de páginas web. É construída com:

- **Nest.js** - Framework Node.js progressivo para construção de aplicações server-side
- **Playwright** - Biblioteca para automação de navegador e captura de screenshots
- **TypeScript** - Linguagem de programação tipada

## 🚀 Instalação

### Pré-requisitos

- Node.js (v24 ou superior)
- npm ou pnpm
- Dependências do Playwright (serão instaladas automaticamente)

### Passos de Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nest-js-screenshot.git
cd nest-js-screenshot
```

2. Instale as dependências:

```bash
pnpm install
# ou
npm install
```

3. Inicie o servidor:

```bash
pnpm start:dev
# ou
npm run start:dev
```

## 🎯 Uso da API

### Endpoint Principal

**GET** `/api/screenshot?url={url_da_pagina}`

#### Parâmetros

| Parâmetro | Tipo   | Obrigatório | Descrição                   |
| --------- | ------ | ----------- | --------------------------- |
| url       | string | ✅ Sim      | URL da página para capturar |

#### Exemplo de Requisição

```bash
curl "http://localhost:3000/api/screenshot?url=https://example.com"
```

#### Exemplo de Resposta

A API retorna uma imagem PNG diretamente no corpo da resposta com os seguintes headers:

- `Content-Type: image/png`
- `Content-Disposition: inline; filename="screenshot.png"`

### Validação de URL

A API valida automaticamente as URLs fornecidas:

- ✅ URLs válidas: `http://example.com`, `https://example.com`
- ❌ URLs inválidas: URLs sem protocolo, URLs com protocolos não suportados

## 🔧 Configuração

### Configurações do Playwright

As configurações do navegador podem ser ajustadas no arquivo `src/screenshot/playwright.service.ts`:

```typescript
// Configuração atual
this.browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// Configuração do viewport
const context = await this.browser.newContext({
  viewport: { width: 1280, height: 720 },
});
```

### Opções de Screenshot

As opções de captura podem ser personalizadas:

```typescript
await page.screenshot({
  type: 'png', // Formato da imagem
  fullPage: true, // Captura página completa
  // quality: 80,       // Qualidade (para JPEG)
  // omitBackground: true // Fundo transparente
});
```

## 📦 Estrutura do Projeto

```
src/
├── screenshot/
│   ├── screenshot.controller.ts  # Controlador da API
│   ├── playwright.service.ts     # Serviço de captura de screenshots
│   └── screenshot.module.ts     # Módulo Nest.js
└── main.ts                      # Ponto de entrada da aplicação
```

## 🔄 Ciclo de Vida

A aplicação gerencia automaticamente o ciclo de vida do navegador:

1. **Inicialização**: O navegador é iniciado quando o módulo é carregado
2. **Uso**: Cada requisição cria um novo contexto de página
3. **Finalização**: O navegador é fechado quando a aplicação é encerrada

## 🛡️ Segurança

- Validação estrita de URLs para evitar injeção de código
- Navegador executado em modo headless com sandbox desabilitado (apropriado para ambientes Docker)
- Timeout de 15 segundos para evitar requisições pendentes

## 📈 Exemplos de Uso

### Capturar screenshot de um site

```bash
curl "http://localhost:3000/api/screenshot?url=https://nestjs.com" --output nestjs.png
```

### Integrar com frontend

```javascript
// JavaScript/TypeScript
async function captureScreenshot(url) {
  const response = await fetch(
    `/api/screenshot?url=${encodeURIComponent(url)}`,
  );
  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);

  const img = document.createElement('img');
  img.src = imageUrl;
  document.body.appendChild(img);
}
```

### Usar com Postman

1. Crie uma nova requisição GET
2. URL: `http://localhost:3000/api/screenshot?url=https://example.com`
3. A resposta será uma imagem PNG que pode ser visualizada ou baixada

## 🧪 Testes

Os testes E2E estão disponíveis em `test/app.e2e-spec.ts`. Para executar os testes:

```bash
pnpm test:e2e
# ou
npm run test:e2e
```

## 📝 Notas

- A aplicação usa viewport padrão de 1280x720 pixels
- O timeout padrão para carregamento de páginas é de 15 segundos
- O formato de saída padrão é PNG
- A aplicação captura a página completa (full page) por padrão

## 🔧 Personalização

Para personalizar o comportamento:

1. **Tamanho do viewport**: Modifique as dimensões em `playwright.service.ts`
2. **Timeout**: Ajuste o valor de timeout na chamada `page.goto()`
3. **Formato de saída**: Altere o tipo de screenshot para 'jpeg' ou 'png'

## 📚 Documentação da API

### Respostas de Erro

| Código | Tipo                | Descrição               |
| ------ | ------------------- | ----------------------- |
| 400    | BadRequestException | URL inválida ou ausente |
| 500    | InternalServerError | Erro no servidor        |

### Exemplos de Erro

```json
{
  "statusCode": 400,
  "message": "URL inválida",
  "error": "Bad Request"
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está licenciado sob a Licença MIT.

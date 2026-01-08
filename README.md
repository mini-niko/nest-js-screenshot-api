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

**GET** `/api/screenshot`

#### Parâmetros

| Parâmetro     | Tipo   | Obrigatório | Descrição                          | Valores Válidos         | Padrão        |
| ------------- | ------ | ----------- | ---------------------------------- | ----------------------- | ------------- |
| url           | string | ✅ Sim      | URL da página para capturar        | URL válida (http/https) | -             |
| format        | string | ❌ Não      | Formato da imagem de saída         | `png`, `jpeg`           | `jpeg`        |
| device_width  | number | ❌ Não      | Largura do viewport do dispositivo | 1-3840                  | 1920          |
| device_height | number | ❌ Não      | Altura do viewport do dispositivo  | 1-3840                  | 1080          |
| delay         | number | ❌ Não      | Atraso antes da captura (ms)       | 0-30000                 | 0             |
| clip_x        | number | ❌ Não      | Posição X do recorte (em pixels)   | 0-3840                  | 0             |
| clip_y        | number | ❌ Não      | Posição Y do recorte (em pixels)   | 0-3840                  | 0             |
| clip_width    | number | ❌ Não      | Largura do recorte (em pixels)     | 1-3840                  | device_width  |
| clip_height   | number | ❌ Não      | Altura do recorte (em pixels)      | 1-3840                  | device_height |

#### Exemplos de Requisição

**1. Captura básica com URL:**

```bash
curl "http://localhost:3000/api/screenshot?url=https://example.com" --output screenshot.jpeg
```

**2. Captura com formato PNG e viewport personalizado:**

```bash
curl "http://localhost:3000/api/screenshot?url=https://nestjs.com&format=png&device_width=1280&device_height=720" --output nestjs.png
```

**3. Captura com recorte específico:**

```bash
curl "http://localhost:3000/api/screenshot?url=https://github.com&format=png&device_width=1920&device_height=1080&clip_x=100&clip_y=100&clip_width=800&clip_height=600" --output github-crop.png
```

**4. Captura com atraso (delay) de 1 segundo:**

```bash
curl "http://localhost:3000/api/screenshot?url=https://example.com&delay=1000" --output delayed-screenshot.jpeg
```

**5. Captura combinando todos os parâmetros:**

```bash
curl "http://localhost:3000/api/screenshot?url=https://example.com&format=png&device_width=1280&device_height=720&delay=500&clip_x=100&clip_y=100&clip_width=800&clip_height=600" --output full-params.png
```

#### Exemplo de Resposta

A API retorna uma imagem binária diretamente no corpo da resposta com os seguintes headers:

- `Content-Type: image/png` ou `image/jpeg` (dependendo do formato)
- `Content-Disposition: inline; filename="screenshot.png"`

> **Nota:** O formato padrão é JPEG, mas o header Content-Type será ajustado automaticamente de acordo com o parâmetro `format`.

### Validação de URL

A API valida automaticamente as URLs fornecidas:

- ✅ URLs válidas: `http://example.com`, `https://example.com`
- ❌ URLs inválidas: URLs sem protocolo, URLs com protocolos não suportados

## 🔧 Configuração

### Configurações do Playwright

As configurações do navegador são gerenciadas pelo `BrowserService` em `src/browser/browser.service.ts`. O serviço de screenshot utiliza essas configurações para criar contextos de página.

### Opções de Screenshot

As opções de captura são definidas no controlador (`src/screenshot/screenshot.controller.ts`) e incluem:

- **Viewport padrão**: 1920x1080 pixels
- **Formato padrão**: JPEG
- **Timeout de página**: 15 segundos (networkidle)
- **Captura completa**: Quando nenhum recorte é especificado
- **Recorte personalizado**: Quando parâmetros de recorte são fornecidos

Para personalizar o comportamento padrão, modifique o método `getOptionsByQuery` no controlador.

## 📦 Estrutura do Projeto

```
src/
├── browser/
│   ├── browser.module.ts        # Módulo do navegador
│   └── browser.service.ts       # Serviço de gerenciamento do navegador
├── screenshot/
│   ├── screenshot.controller.ts # Controlador da API
│   ├── screenshot.dto.ts        # DTOs de validação e opções
│   ├── screenshot.module.ts    # Módulo de screenshot
│   └── screenshot.service.ts    # Serviço de captura de screenshots
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

- A aplicação usa viewport padrão de 1920x1080 pixels
- O timeout padrão para carregamento de páginas é de 15 segundos (networkidle)
- O formato de saída padrão é JPEG
- A aplicação captura a página completa quando nenhum recorte é especificado
- Os parâmetros de recorte permitem capturar regiões específicas da página

## 🔧 Personalização

Para personalizar o comportamento:

1. **Tamanho do viewport**: Modifique os valores padrão no método `getOptionsByQuery` em `src/screenshot/screenshot.controller.ts`
2. **Timeout**: Ajuste o valor de timeout na chamada `page.goto()` em `src/screenshot/screenshot.service.ts`
3. **Formato padrão**: Altere o valor padrão do parâmetro `format` no controlador
4. **Validação de parâmetros**: Modifique as regras de validação em `src/screenshot/screenshot.dto.ts`

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

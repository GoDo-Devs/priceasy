# Sistema de Simulação de Seguros

## Contexto

- Sistema desenvolvido como freelancer terceirizado para uma agência de seguros, com o objetivo de substituir parcialmente um CRM de terceiros, reduzindo custos operacionais e aumentando o controle sobre o processo de cotação.
- O projeto envolveu múltiplas regras de negócio e decisões técnicas voltadas à performance, usabilidade e previsibilidade do sistema.

---

## Objetivo

- Centralizar e otimizar o fluxo de cotação de seguros, reduzindo o tempo de atendimento e eliminando atritos operacionais presentes na ferramenta anterior.

---

## Modelagem Inicial

Os primeiros passos do projeto partiram de diagramas para entendimento do fluxo e das regras de negócio.

<p align="center">
  <img src="frontend\assets\diagrama1.png" width="382"/>
  <img src="frontend\assets\diagrama2.png" width="420"/>
</p>

---

## Funcionamento

O sistema é utilizado por atendentes de telemarketing e segue um fluxo único de cotação:

- Consulta de histórico
- Criação de nova simulação
- Seleção do veículo (tipo, marca, modelo, ano, categoria)

A partir disso:

- Tabelas de preço são carregadas conforme o perfil do veículo
- Planos são calculados com base no valor FIPE
- Serviços opcionais podem ser adicionados
- O valor é atualizado em tempo real
- Cupons podem ser aplicados
- Um PDF com a cotação é gerado ao final

---

## Interface

<p align="center">
  <img src="frontend\assets\interface1.png" width="400"/>
  <img src="frontend\assets\interface2.png" width="400"/>
</p>

---

## Desafios e Decisões Técnicas

### Dependência da Tabela FIPE

A API pública da FIPE não atendia aos requisitos de performance e escalabilidade. Em cenários de alta concorrência, ocorriam respostas `429 (Too Many Requests)` devido a rate limiting.

Como o sistema exige múltiplas consultas simultâneas e baixa latência, a dependência externa em tempo real se tornava um gargalo.

Além disso, o uso de APIs pagas foi descartado devido ao custo variável por volume de requisições.

**Solução:**

- Replicação local da base da FIPE
- Script de atualização periódica dos dados
- Consultas realizadas diretamente no banco local

**Resultado:**

- Eliminação de erros de rate limiting
- Redução significativa de latência
- Maior previsibilidade e controle sobre o sistema
- Custo operacional zero por consulta

---

### Otimização de Fluxo

O sistema foi projetado para minimizar o tempo de atendimento.

- Navegação orientada a teclado (TAB + input direto)
- Consolidação de múltiplas etapas em um único fluxo
- Redução de dependências entre telas

---

### Busca por Placa

O preenchimento manual dos dados do veículo foi identificado como gargalo.

**Solução:**

- Implementação de busca por placa
- Preenchimento automático dos dados do veículo

**Impacto:**

- Redução do tempo de entrada de dados
- Menor chance de erro humano
- Fluxo mais fluido durante o atendimento

---

### Armazenamento de PDFs

A geração e download de PDFs exigia uma solução escalável.

**Solução:**

- Armazenamento dos arquivos no AWS S3

**Impacto:**

- Melhor distribuição de carga
- Suporte a múltiplos downloads simultâneos
- Redução de carga no backend

---

## Saída do Sistema (PDF)

<p align="center">
  <img src="frontend\assets\pdf1.png" width="300"/>
  <img src="frontend\assets\pdf2.png" width="300"/>
</p>

---

## Tecnologias

- React
- Node.js
- Express
- Docker
- AWS S3

---

## Aprendizados

- Modelagem de dados orientada a domínio
- Trade-offs entre dependência externa vs. controle local
- Estruturação de aplicações containerizadas
- Importância de performance em sistemas orientados a venda
- Evolução na escrita de código mais previsível e manutenível

---

## Observação

Este repositório documenta a construção de uma solução baseada em um cenário real, com foco nas decisões técnicas, trade-offs e impactos no fluxo de negócio.


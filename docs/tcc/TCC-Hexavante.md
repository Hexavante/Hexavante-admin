<div align="center">

# FUNDAÇÃO INSTITUTO TECNOLÓGICO DE OSASCO

### CURSO TÉCNICO EM INFORMÁTICA PARA INTERNET

---

<br/>

# **HEXAVANTE**

## **Plataforma Integrada para Facilitar Tarefas Digitais na Educação**

### *Desenvolvimento de um Ecossistema Web para Centralizar Ferramentas Educacionais*

<br/>

---

**Autores:**

Ítalo Giaj Levra Tavarone · Nicolas das Virgens Souza · **Nicolas Kirsch Mazzini**
Renato Cordeiro Serrano · João Otávio Lima de Melo · Gabriella Bittencourt Pimentel

<br/>

**Orientador:** Professor Fernando de Almeida Curvelo

<br/>

---

**OSASCO, SP — AGOSTO DE 2026**

</div>

---

<div style="page-break-after: always;"></div>

# FOLHA DE ROSTO

TAVARONE, Ítalo Giaj Levra et al. **Hexavante: Plataforma Integrada para Facilitar Tarefas Digitais na Educação: Desenvolvimento de um Ecossistema Web para Centralizar Ferramentas Educacionais**. 2026. [INSERIR NÚMERO DE PÁGINAS] f. Trabalho de Conclusão de Curso (Técnico em Informática para Internet) — Fundação Instituto Tecnológico de Osasco, Osasco, 2026.

---

<div style="page-break-after: always;"></div>

# RESUMO

O presente trabalho apresenta o desenvolvimento do **Hexavante**, uma plataforma web unificada destinada a centralizar ferramentas educacionais digitais, abordando o problema crescente da **"fadiga de aplicativos"** enfrentada por estudantes e instituições de ensino. A fragmentação de sistemas isolados — como Google Classroom, plataformas de cursos online e ferramentas de simulados — gera sobrecarga cognitiva, dispersão de informações e desperdício de armazenamento em dispositivos dos usuários.

Para mitigar essas questões, o Hexavante foi concebido como um ecossistema integrado composto por **três aplicações** (Web, Desktop e API) que reúne cursos, simulados dinâmicos, aulas ao vivo, gamificação, comunidade social e gestão institucional (módulo **HexaSchool**) em uma única interface.

A metodologia adotada combina abordagens quali-quantitativas, com desenvolvimento ágil utilizando **Scrum**, prototipação no **Figma** e implementação técnica baseada em **Next.js 16** (App Router), **TypeScript 6** e **Tailwind CSS 4** no frontend web; **Electron 33** com **React 18**, **React Router 6** e **Zustand 5** no frontend desktop; **Capacitor 8** para apps Android nativos; e **Node.js 22** com **Fastify 5**, **Prisma 6** ORM, **Better Auth** e **Redis** no backend. O banco de dados é composto por **57 entidades** e **22 enums** modeladas no Prisma, servidas por **MariaDB 10.6+**.

Os testes de usabilidade, realizados com **20 estudantes** do Ensino Médio, revelaram uma taxa de retenção de **75%** ao longo de sete dias, tempo médio de conclusão de simulados de **25 minutos** e índice de satisfação geral de **4,5** em uma escala de 5 pontos, superando as metas estabelecidas. A suíte de testes automatizados contabiliza **83+ testes** (38 no frontend web e 45+ na API), todos passando com cobertura de **78%** nos componentes React.

O Hexavante distingue-se das soluções existentes ao integrar gamificação completa (sistema de XP, moedas, rankings e boosters), simulados com questões de múltipla escolha e dissertativas, módulo institucional, aplicativo desktop nativo para Windows/Linux e API REST documentada com **Swagger**, contribuindo para a literatura acadêmica sobre tecnologia educacional e design centrado no usuário.

> **Palavras-chave:** Hexavante · Plataforma Integrada · Usabilidade · Educação Digital · Fadiga de Aplicativos · Gamificação · Aplicativo Desktop

---

<div style="page-break-after: always;"></div>

# ABSTRACT

This paper presents the development of **Hexavante**, a unified web platform designed to centralize digital educational tools, addressing the growing problem of **"app fatigue"** faced by students and educational institutions. The fragmentation of isolated systems causes cognitive overload, information dispersion, and unnecessary storage consumption on user devices.

To mitigate these issues, Hexavante was conceived as an integrated ecosystem composed of **three applications** (Web, Desktop, and API) that brings together courses, dynamic mock exams, live classes, gamification, social community, and institutional management (**HexaSchool** module) within a single interface.

The adopted methodology combines qualitative and quantitative approaches, with agile development using **Scrum**, prototyping in **Figma**, and technical implementation based on **Next.js 16** (App Router), **TypeScript 6**, and **Tailwind CSS 4** on the web frontend; **Electron 33** with **React 18**, **React Router 6**, and **Zustand 5** on the desktop frontend; **Capacitor 8** for native Android apps; and **Node.js 22** with **Fastify 5**, **Prisma 6** ORM, **Better Auth**, and **Redis** on the backend. The database consists of **57 entities** and **22 enums** modeled in Prisma, served by **MariaDB 10.6+**.

Usability tests, conducted with **20 high school students**, revealed a **75% retention rate** over seven days, an average mock exam completion time of **25 minutes**, and an overall satisfaction index of **4.5** on a 5-point scale, exceeding established goals. The automated test suite comprises **83+ tests** (38 on the web frontend and 45+ on the API), all passing with **78% coverage** on React components.

Hexavante distinguishes itself from existing solutions by integrating comprehensive gamification (XP system, coins, rankings, and boosters), mock exams with multiple-choice and essay questions, an institutional module, a native desktop application for Windows/Linux, and a **Swagger**-documented REST API, contributing to the academic literature on educational technology and user-centered design.

> **Keywords:** Hexavante · Integrated Platform · Usability · Digital Education · App Fatigue · Gamification · Desktop Application

---

<div style="page-break-after: always;"></div>

# SUMÁRIO AUTOMÁTICO

> *O sumário abaixo é gerado automaticamente a partir das seções do documento. As páginas devem ser preenchidas após a formatação final.*

| Seção | Subseção | Pág. |
|:------|:---------|:----:|
| **RESUMO** | | [INSERIR] |
| **ABSTRACT** | | [INSERIR] |
| **LISTA DE FIGURAS** | | [INSERIR] |
| **LISTA DE TABELAS** | | [INSERIR] |
| **LISTA DE CÓDIGOS** | | [INSERIR] |
| **LISTA DE ABREVIATURAS E SIGLAS** | | [INSERIR] |
| **1 INTRODUÇÃO** | | [INSERIR] |
| | 1.1 Contextualização | [INSERIR] |
| | 1.2 Problema de Pesquisa | [INSERIR] |
| | 1.3 Justificativa | [INSERIR] |
| | 1.4 Objetivos | [INSERIR] |
| | 1.5 Estrutura do Trabalho | [INSERIR] |
| **2 REFERENCIAL TEÓRICO** | | [INSERIR] |
| | 2.1 Gamificação na Educação | [INSERIR] |
| | 2.2 Educação a Distância e MOOCs | [INSERIR] |
| | 2.3 Arquitetura de Software | [INSERIR] |
| | 2.4 Metodologias Ágeis | [INSERIR] |
| | 2.5 Fadiga de Aplicativos | [INSERIR] |
| **3 METODOLOGIA** | | [INSERIR] |
| | 3.1 Tipo de Pesquisa | [INSERIR] |
| | 3.2 Etapas do Desenvolvimento | [INSERIR] |
| | 3.3 Limitações | [INSERIR] |
| **4 A PLATAFORMA HEXAVANTE** | | [INSERIR] |
| | 4.1 Visão Geral do Ecossistema | [INSERIR] |
| | 4.2 Aplicação Web (Frontend) | [INSERIR] |
| | 4.3 Aplicação Desktop (Electron) | [INSERIR] |
| | 4.4 API Backend (Fastify) | [INSERIR] |
| | 4.5 Banco de Dados | [INSERIR] |
| | 4.6 Módulo de Gamificação | [INSERIR] |
| | 4.7 Módulo de Simulados | [INSERIR] |
| | 4.8 Módulo de Comunidade | [INSERIR] |
| | 4.9 Módulo de Certificados | [INSERIR] |
| | 4.10 Módulo de Notificações | [INSERIR] |
| | 4.11 Módulo de Mensagens Diretas | [INSERIR] |
| | 4.12 Módulo de Loja e Inventário | [INSERIR] |
| | 4.13 Módulo de Salas Ao Vivo | [INSERIR] |
| | 4.14 Módulo de Moderação | [INSERIR] |
| | 4.15 Módulo de Instrutores | [INSERIR] |
| | 4.16 Camada de Serviços (Frontend) | [INSERIR] |
| | 4.17 Filtro de Linguagem Ofensiva | [INSERIR] |
| | 4.18 Arquitetura do Desktop | [INSERIR] |
| | 4.19 Stack Tecnológica | [INSERIR] |
| | 4.20 Sistema Premium | [INSERIR] |
| | 4.21 Conteúdo e Moderação | [INSERIR] |
| | 4.22 Sistema Social | [INSERIR] |
| | 4.23 Aplicativos Nativos | [INSERIR] |
| | 4.24 Onboarding | [INSERIR] |
| | 4.25 Pacotes de Revisão | [INSERIR] |
| | 4.26 Recomendações | [INSERIR] |
| | 4.27 Instalação e Configuração | [INSERIR] |
| | 4.28 Contas Demonstrativas | [INSERIR] |
| **5 RESULTADOS E DISCUSSÃO** | | [INSERIR] |
| | 5.1 Testes de Usabilidade | [INSERIR] |
| | 5.2 Comparação com Concorrentes | [INSERIR] |
| | 5.3 Testes Automatizados | [INSERIR] |
| | 5.4 Qualidade de Código | [INSERIR] |
| | 5.5 Segurança | [INSERIR] |
| | 5.6 Performance | [INSERIR] |
| | 5.7 Discussão | [INSERIR] |
| **6 CONCLUSÃO** | | [INSERIR] |
| | 6.1 Retomada dos Objetivos | [INSERIR] |
| | 6.2 Contribuições do Projeto | [INSERIR] |
| | 6.3 Limitações | [INSERIR] |
| | 6.4 Trabalhos Futuros | [INSERIR] |
| **REFERÊNCIAS** | | [INSERIR] |
| **ANEXOS** | | [INSERIR] |

---

<div style="page-break-after: always;"></div>

# LISTA DE ABREVIATURAS E SIGLAS

| Abreviatura | Significado |
|:-----------:|:------------|
| ABNT | Associação Brasileira de Normas Técnicas |
| API | Application Programming Interface |
| CSP | Content Security Policy |
| CSS | Cascading Style Sheets |
| EAD | Educação a Distância |
| ENEM | Exame Nacional do Ensino Médio |
| ER | Entidade-Relacionamento |
| GitHub | Plataforma de hospedagem de código |
| GPU | Graphics Processing Unit |
| IA | Inteligência Artificial |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LTS | Long-Term Support |
| MOOC | Massive Open Online Course |
| OAuth | Open Authorization |
| ORM | Object-Relational Mapping |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| SSR | Server-Side Rendering |
| SSG | Static Site Generation |
| UML | Unified Modeling Language |
| VPS | Virtual Private Server |
| XP | Experiência (Experience Points) |
| ZDP | Zona de Desenvolvimento Proximal |

---

<div style="page-break-after: always;"></div>

# 1 · INTRODUÇÃO

## 1.1 Contextualização

A revolução digital transformou profundamente o cenário educacional global ao longo das últimas duas décadas. A emergência da **Educação a Distância (EAD)** e a proliferação dos **MOOCs** (Massive Open Online Courses), representados por plataformas como Coursera, edX e Khan Academy, democratizaram o acesso ao conhecimento ao permitir que milhões de estudantes acessassem conteúdos de instituições de prestígio internacional a partir de qualquer dispositivo conectado à internet (MOOCs, 2023).

No Brasil, o crescimento da educação digital foi particularmente acelerado pela **pandemia de COVID-19**, que forçou a transição abrupta de modelos presenciais para ambientes virtuais de aprendizagem. Segundo o **CGI.BR** (Comitê Gestor da Internet no Brasil), em 2020, aproximadamente **40% dos estudantes brasileiros** enfrentaram dificuldades significativas de acesso à educação durante o isolamento social, evidenciando tanto o potencial quanto as limitações das ferramentas digitais disponíveis (CGI.BR, 2020).

Nesse contexto, a multiplicação de plataformas educacionais digitais gerou um fenômeno até então subestimado: a **"fadiga de aplicativos"** (app fatigue). Estudantes e instituições passaram a utilizar simultaneamente múltiplos sistemas isolados — Google Classroom para gerenciamento de turmas, Alura para cursos online, Khan Academy para práticas, Zoom ou Google Meet para aulas ao vivo — cada um com interface própria, sistema de autenticação independente e lógica de funcionamento distinta. Essa fragmentação resulta em **sobrecarga cognitiva significativa**, pois o estudante deve alternar constantemente entre diferentes ambientes digitais, memorizar múltiplas credenciais de acesso e adaptar-se a padrões de navegação díspares (CHOU, 2015).

A dispersão de informações é outro efeito adverso dessa atomização. Dados de progresso, resultados de simulados, materiais de estudo e interações sociais encontram-se distribuídos em repositórios desconectados, impedindo a construção de uma **visão holística do percurso de aprendizagem**. Adicionalmente, o uso desnecessário de armazenamento em dispositivos pessoais — resultante da instalação de múltiplos aplicativos — representa um obstáculo concreto para estudantes com smartphones de capacidade limitada, uma realidade prevalente em contextos socioeconômicos vulneráveis (UNESCO, 2020).

Diante desse cenário, emerge a necessidade premente de soluções tecnológicas integradas que concentrem as principais ferramentas educacionais em uma única plataforma, reduzindo a sobrecarga cognitiva, otimizando o uso de recursos digitais e promovendo um ambiente de aprendizagem coeso e engajador.

## 1.2 Problema de Pesquisa

O problema de pesquisa que orienta este trabalho pode ser formulado da seguinte maneira:

> **"Como uma plataforma unificada pode reduzir a fadiga de aplicativos e melhorar a experiência de aprendizado de estudantes do Ensino Médio e vestibulandos?"**

Para responder a essa questão, o estudo busca compreender de que modo a centralização de ferramentas educacionais — incluindo cursos, simulados, aulas ao vivo, gamificação e comunidade — em um único ecossistema digital pode mitigar os efeitos negativos da fragmentação de sistemas e contribuir para uma experiência de aprendizagem mais eficiente e motivadora.

## 1.3 Justificativa

A relevância deste projeto justifica-se em múltiplos dimensiones:

**Em termos práticos**, a criação de uma plataforma unificada como o Hexavante atende a uma demanda real identificada no cotidiano de estudantes brasileiros, que frequentemente acumulam de cinco a oito aplicativos educacionais em seus dispositivos, enfrentando inconvenientes como notificações dispersas, login repetitivo e dificuldade de acompanhamento do próprio progresso.

**Do ponto de vista institucional**, o módulo HexaSchool oferece às instituições de ensino uma ferramenta de gestão que reduz custos de infraestrutura tecnológica ao eliminar a necessidade de contratar múltiplos serviços de terceiros. A integração de funcionalidades como emissão de certificados, gestão de instrutores e relatórios de desempenho em uma única solução representa uma economia significativa de recursos financeiros e técnicos.

**No âmbito acadêmico**, o desenvolvimento do Hexavante contribui para a literatura sobre gamificação aplicada à educação, ao validar empiricamente a eficácia de mecânicas como sistema de XP (pontos de experiência), moedas virtuais, rankings competitivos e boosters multiplicadores no engajamento de estudantes.

**Para a comunidade de software**, a disponibilização do código-fonte em repositório público (GitHub) sob licença open source permite que outros desenvolvedores e instituições utilizem, modifiquem e contribuam para a evolução da plataforma, ampliando seu impacto social e tecnológico.

## 1.4 Objetivos

### 1.4.1 Objetivo Geral

Desenvolver o Hexavante como um ecossistema web composto por três aplicações (Web, Desktop e API) destinado a centralizar ferramentas educacionais digitais, proporcionando uma experiência de aprendizagem unificada, engajadora e acessível para estudantes do Ensino Médio, vestibulandos e instituições de ensino.

### 1.4.2 Objetivos Específicos

| # | Objetivo |
|:-:|:---------|
| 1 | Implementar sistema de autenticação unificado utilizando **Better Auth**, com suporte a credenciais tradicionais e provedores OAuth (Google, GitHub) |
| 2 | Desenvolver módulo de simulados dinâmico com questões de múltipla escolha e dissertativas, incluindo cronômetro, correção automática e manual |
| 3 | Estruturar módulo de gamificação completo: níveis (cálculo por raiz quadrada), rankings por ligas (Bronze/Silver/Gold), loja virtual e 12 conquistas |
| 4 | Implementar sistema de aulas ao vivo com salas virtuais integradas e chat público em tempo real |
| 5 | Criar módulo HexaSchool para gestão institucional (turmas, profesores, cursos, relatórios) |
| 6 | Desenvolver sistema de certificados com emissão automática, verificação por código único, PDF e QR Code |
| 7 | Estruturar comunidade social com feed, seguidores, mensagens privadas e reações |
| 8 | Implementar painel administrativo com moderação (ban, mute, aviso) e RBAC |
| 9 | Desenvolver aplicativo desktop nativo para Windows e Linux com **Electron** |
| 10 | Avaliar a usabilidade com testes reais, coletando métricas quantitativas e qualitativas |
| 11 | Documentar todo o processo seguindo normas ABNT |

## 1.5 Estrutura do Trabalho

Este Trabalho de Conclusão de Curso está organizado em **seis capítulos**:

- **Capítulo 1 — Introdução:** Contextualização, problema de pesquisa, justificativa e objetivos.
- **Capítulo 2 — Referencial Teórico:** Fundamentos de gamificação, EAD, arquitetura de software e metodologias ágeis.
- **Capítulo 3 — Metodologia:** Tipo de pesquisa, etapas de desenvolvimento e instrumentos de coleta.
- **Capítulo 4 — A Plataforma Hexavante:** Arquitetura completa do ecossistema, módulos funcionais, código-fonte e stack tecnológica.
- **Capítulo 5 — Resultados e Discussão:** Testes de usabilidade, comparação com concorrentes e métricas de qualidade.
- **Capítulo 6 — Conclusão:** Retomada dos objetivos, contribuições, limitações e trabalhos futuros.

---

<div style="page-break-after: always;"></div>

# 2 · REFERENCIAL TEÓRICO

## 2.1 Gamificação na Educação

### 2.1.1 Definição e Princípios

**Gamificação** refere-se à aplicação de elementos e mecânicas de design de jogos em contextos não lúdicos, com o objetivo de aumentar o engajamento, a motivação e a participação dos indivíduos em atividades específicas (DETERDING et al., 2011). No campo educacional, a gamificação tem se consolidado como uma abordagem promissora para transformar processos de aprendizagem frequentemente percebidos como monótonos em experiências mais dinâmicas e envolventes.

Yu-kai Chou, em sua obra *"Actionable Gamification: Beyond Points, Badges, and Leaderboards"* (2015), propôs o **framework Octalysis**, que identifica oito núcleos de motivação humana:

| # | Núcleo | Descrição |
|:-:|:-------|:----------|
| 1 | Significado Épico | Sentido de propósito e missão |
| 2 | Desenvolvimento e Realização | Progressão e conquista |
| 3 | Empoderamento Criativo | Liberdade de expressão |
| 4 | Propriedade e Posse | Senso de posse sobre bens digitais |
| 5 | Influência Social | Interação e competição |
| 6 | Escassez e Impaciência | Urgência e disponibilidade limitada |
| 7 | Não Saber e Curiosidade | Descoberta e mistério |
| 8 | Perda e Evitação | Medo de perder recompensas |

### 2.1.2 Teorias de Motivação

A eficácia da gamificação na educação sustenta-se em fundamentos teóricos robustos:

**Teoria da Autodeterminação** (DECI e RYAN, 1985): Postula que a motivação humana é impulsionada por três necessidades psicológicas básicas — **autonomia** (percepção de controle), **competência** (sensação de domínio) e **relacionamento** (conexão com outros). Sistemas gamificados bem projetados atendem a essas necessidades ao oferecer escolhas significativas, feedback imediato e interações sociais.

**Hierarquia de Necessidades de Maslow** (1943): Sugere que os indivíduos são motivados por uma progressão de necessidades, desde necessidades fisiológicas até **autorrealização**. O sistema de níveis e conquistas do Hexavante atende diretamente à necessidade de autorrealização.

**Zona de Desenvolvimento Proximal** (VYGOTSKY, 1978): Demonstra que a aprendizagem é otimizada quando o indivíduo é desafiado além de seu nível atual, mas com suporte adequado. Os simulados do Hexavante, com seus diferentes níveis de dificuldade, alinham-se com esse princípio.

### 2.1.3 Exemplos de Sucesso

| Plataforma | Gamificação | Resultado |
|:-----------|:------------|:----------|
| **Duolingo** | XP, ligas, streaks | 500M+ usuários; retenção de 80% (7 dias) |
| **Khan Academy** | Pontos, emblemas, rankings | Melhoria de 23% em avaliações |
| **Brainscape** | Flashcards adaptativos | Otimização de retenção via repetição espaçada |

### 2.1.4 Aplicação no Hexavante

O Hexavante implementa um sistema de gamificação abrangente inspirado no framework Octalysis:

- **Sistema de XP:** Fórmula `Math.floor(Math.sqrt(totalXp / 100))` — cada nível requer progressivamente mais XP
- **Moedas Virtuais:** Recompensas por aulas (+3), módulos (+10), cursos (+25) e questões corretas (+5)
- **Ranking por Ligas:** Bronze (nível 1-9) → Silver (10-24) → Gold (25+)
- **Boosters:** Itens multiplicadores (2x XP por 24h, 3x por 12h)
- **12 Conquistas:** Primeira Aula, Dedicado, Nota Máxima, Lendário, etc.
- **Loja Virtual:** 9 categorias (títulos, bordas, temas, boosters, pets, etc.)

## 2.2 Educação a Distância e MOOCs

### 2.2.1 Histórico e Evolução

A EAD possui uma trajetória que remonta ao século XIX com cursos por correspondência. A revolução digital a partir dos anos 2000 viabilizou cursos online interativos e acessíveis a escala global (MORAN, 2018). Os MOOCs emergiram no final da década de 2000 com Coursera, edX e Udemy, atraindo milhões de matrículas worldwide.

### 2.2.2 Plataformas Existentes

| Plataforma | Tipo | Gamificação | Simulados | Gestão Institucional |
|:-----------|:-----|:------------|:----------|:---------------------|
| Google Classroom | Gestão de turmas | ❌ Não | ❌ Não | ⚠️ Básico |
| Khan Academy | Cursos + exercícios | ⚠️ Limitado | ✅ Sim | ❌ Não |
| Alura | Cursos de tecnologia | ❌ Não | ❌ Não | ❌ Não |
| Coursera | MOOC universitário | ❌ Não | ❌ Não | ❌ Não |

### 2.2.3 Desafios Contemporâneos

- **Exclusão Digital:** 24% dos estudantes brasileiros sem acesso adequado à internet (CGI.BR, 2020)
- **Falta de Engajamento:** Taxas de conclusão de 5% a 15% em cursos online (JORDAN, 2015)
- **Fragmentação de Sistemas:** Múltiplas ferramentas isoladas geram sobrecarga cognitiva
- **Falta de Integração Institucional:** Ausência de ferramentas de gestão para escolas

## 2.3 Arquitetura de Software

### 2.3.1 Frontend Web: Next.js, TypeScript e Tailwind CSS

**Next.js 16** é um framework React que oferece SSR, SSG e sistema de rotas baseado em diretórios (App Router). **TypeScript 6** proporciona verificação estática de tipos. **Tailwind CSS 4** é um framework utilitário para interfaces responsivas. **React Query 5** gerencia estado do servidor com cache inteligente.

### 2.3.2 Frontend Desktop: Electron e React

**Electron 33** permite a execução de aplicações web em ambientes de desktop com acesso a funcionalidades nativas. Utiliza **React 18** com **React Router 6** e **Zustand 5** para gerenciamento de estado. A arquitetura segue o padrão **Main/Preload/Renderer**.

### 2.3.3 Backend: Node.js, Fastify e Prisma

**Node.js 22 LTS** é o runtime. **Fastify 5** é o framework HTTP (performance superior ao Express). **Prisma 6** é o ORM com type-safety e migrações automatizadas. A arquitetura segue **domain-driven design** com 15 módulos.

### 2.3.4 Banco de Dados: MariaDB

**MariaDB 10.6+** é o banco relacional, com 48 entidades, 42 índices e 70+ relacionamentos. Compatível com MySQL, otimizado para cargas de leitura intensiva.

### 2.3.5 Autenticação: Better Auth

**Better Auth 1.6** suporta credenciais e OAuth (Google, GitHub). Implementa RBAC com middleware `permission()`. Sessões com cache em cookie e expiração configurável.

### 2.3.6 Cache: Redis

**Redis 7+** é utilizado para cache de sessões, roles, permissões e rate limiting distribuído, via biblioteca **ioredis**.

### 2.3.7 Containerização: Docker

**Docker** empacota a aplicação com todas dependências. **docker-compose.yml** define os serviços (frontend, backend, banco, Redis).

## 2.4 Metodologias Ágeis

### 2.4.1 Scrum

O desenvolvimento adotou **Scrum** com sprints de 2-4 semanas:

| Sprint | Foco |
|:------:|:-----|
| 1-2 | Autenticação (Better Auth) e estrutura do banco (48 modelos) |
| 3-4 | Módulo de cursos e progressão de aprendizagem |
| 5-6 | Sistema de gamificação (XP, moedas, rankings) |
| 7-8 | Simulados dinâmicos e questões dissertativas |
| 9-10 | Comunidade social e mensagens privadas |
| 11-12 | Loja virtual e itens cosméticos |
| 13-14 | Aulas ao vivo e chat integrado |
| 15-16 | Certificados com PDF e QR Code |
| 17-18 | HexaSchool e módulo de instrutores |
| 19-20 | Painel admin, moderação e RBAC |

### 2.4.2 Kanban

Elementos do Kanban foram incorporados para gerenciar tarefas operacionais com colunas: "A Fazer" → "Em Andamento" → "Revisão" → "Concluído".

## 2.5 Fadiga de Aplicativos

O termo **"fadiga de aplicativos"** (app fatigue) refere-se à exaustão cognitiva causada pelo gerenciamento de múltiplas aplicações. No setor educacional, estudantes acumulam ferramentas isoladas, gerando:

1. **Sobrecarga cognitiva** — alternância constante entre interfaces díspares
2. **Dispersão de informações** — dados fragmentados em múltiplos repositórios
3. **Uso excessivo de armazenamento** — problema em smartphones com capacidade limitada
4. **Diminuição da motivação** — gestão de ferramentas consome tempo de estudo

O Hexavante foi concebido para atacar esses problemas, centralizando ferramentas em uma única interface web e complementando com aplicativo desktop nativo.

---

<div style="page-break-after: always;"></div>

# 3 · METODOLOGIA

## 3.1 Tipo de Pesquisa

### 3.1.1 Abordagem

**Mista (quali-quantitativa):** Combina análise qualitativa de feedback com medições quantitativas de métricas de usabilidade (CRESWELL, 2014).

### 3.1.2 Natureza

**Aplicada:** Desenvolvimento de solução tecnológica para problema prático identificado no contexto educacional (LAKATOS e MARCONI, 2017).

## 3.2 Etapas do Desenvolvimento

### 3.2.1 Pesquisa Bibliográfica

Fontes consultadas: **Google Scholar**, **SciELO**, documentação oficial (Next.js, Prisma, Fastify, Electron, Better Auth), livros-texto de psicologia motivacional e design de jogos. Referências organizadas no **Zotero**.

### 3.2.2 Prototipação

- **Figma:** Wireframes e mockups de alta fidelidade (20 rotas web)
- **Lucidchart:** Diagramas UML (casos de uso, sequência, classes)

### 3.2.3 Desenvolvimento

| Componente | Tecnologias |
|:-----------|:------------|
| Frontend Web | Next.js 16, TypeScript 6, Tailwind CSS 4, React Query 5, Zod 4, Radix UI |
| Frontend Desktop | Electron 33, React 18, React Router 6, TypeScript 5, Zustand 5, Electron Vite |
| Backend API | Node.js 22, Fastify 5, Prisma 6, Better Auth 1.6, Redis, Zod 4, Swagger |
| Banco de Dados | MariaDB 10.6+ (48 entidades, 42 índices, 70+ relacionamentos) |
| Infraestrutura | Docker, GitHub Actions, DigitalOcean VPS |

### 3.2.4 Testes

**Testes de Usabilidade:**
- 20 estudantes do Ensino Médio (12♀, 8♂, 15-18 anos)
- 7 tarefas avaliadas (cadastro, cursos, simulados, ranking, loja, comunidade)
- Métricas: tempo, erros, satisfação (Likert 1-5), retenção (7 dias)

**Testes Automatizados:**
- Frontend: **38 testes** (Vitest + React Testing Library)
- Backend: **10 testes** (Vitest)
- Cobertura: 78% (React), 65% (Backend), 82% (Utilitários)

## 3.3 Limitações

1. Amostra de 20 participantes (não generalizável)
2. Sem integração com Inteligência Artificial
3. Deploy em VPS único (limitações de escalabilidade)
4. Sem suporte a macOS no Desktop

---

<div style="page-break-after: always;"></div>

# 4 · A PLATAFORMA HEXAVANTE

## 4.1 Visão Geral do Ecossistema

O Hexavante é composto por **três aplicações interconectadas**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECOSISTEMA HEXAVANTE                         │
├──────────────────────┬──────────────────────┬───────────────────┤
│   HEXAVANTE WEB      │ HEXAVANTE DESKTOP    │   HEXAVANTE API   │
│   Next.js 16         │ Electron 33          │   Fastify 5       │
│   57 páginas         │ 35 rotas             │   15 módulos      │
│   89 API routes      │ 30 deps              │   57 models       │
│   React 19           │ React 18             │   Prisma 6        │
│   Tailwind 4         │ Zustand + 12 temas   │   Better Auth     │
│   Capacitor/Tauri    │ 28 canais IPC        │   Redis (7 caches)│
├──────────────────────┴──────────────────────┴───────────────────┤
│              MariaDB 10.6+ (57 entidades, 22 enums)             │
│              Redis 7+ (cache/sessões/rate limit)                │
└─────────────────────────────────────────────────────────────────┘
```

## 4.2 Aplicação Web (Frontend)

### 4.2.1 Estrutura de Rotas (App Router) — 57 páginas

**Rotas de Autenticação (`(auth)/`):** `/login`, `/register`, `/recuperar-senha`, `/redefinir-senha`

**Rotas Principais (`(main)/`):** Dashboard, Cursos (`/courses/[slug]/learn/[lessonId]`), Simulados (`/simulados/[slug]/fazer`), Ranking, Estatísticas, Loja, Inventário, Comunidade, Salas Ao Vivo, Certificados, Mensagens, Notificações, Perfil, Configurações, Privacidade, Instructor, Moderação (9 sub-rotas), Pacotes de Revisão

**Páginas standalone:** `/suspenso`, `/manutencao`

**Rotas de API (`api/v1/`):** 89 endpoints server-side (auth, user, courses, exams, ranking, shop, social, community, notifications, messages, conversations, live-rooms, moderation, certificates, premium, search)

**Total:** 57 páginas + 89 rotas de API + 4 layouts + 26 Server Actions

### 4.2.2 Componentes React (22 pastas, 182 arquivos .tsx)

`achievements/` · `auth/` · `brand/` · `certificates/` · `courses/` · `exams/` · `gamification/` · `home/` · `instructor/` · `layout/` · `live/` · `messages/` · `moderation/` · `native/` · `notifications/` · `onboarding/` · `profile/` · `ranking/` · `shop/` · `social/` · `stats/` · `ui/`

Destaques por pasta:

| Pasta | Arquivos | Funcionalidades |
|:------|:--------:|:----------------|
| `ui/` | 21 | Base components (avatar, button, dialog, dropdown, badge, skeleton, etc.) |
| `courses/` | 19 | Course cards, learning flow, sidebar, video player, notes |
| `moderation/` | 18 | Admin panel, terminal, broadcast, spotlight, user management |
| `exams/` | 18 | Exam cards, timer, question renderer, results, history |
| `shop/` | 13 | Store items, inventory, cart, coin display, theme selector |
| `social/` | 11 | Feed, activity cards, reactions, comments, reports |
| `profile/` | 9 | Profile view, showcase, pet companion, badges, journey |
| `gamification/` | 8 | XP bar, achievements, leagues, booster indicator |
| `live/` | 8 | Live room player, chat, participant list, instructor controls |
| `messages/` | 7 | Conversation list, message thread, compose |
| `ranking/` | 7 | Leaderboard table, season rewards, league badges |
| `layout/` | 6 | App shell, sidebar, header, error boundary |
| `auth/` | 6 | Login, register, password reset forms |
| `notifications/` | 4 | Bell, notification list, preferences |
| `home/` | 6 | Dashboard widgets, goals, quick actions |

### 4.2.3 Serviços Frontend (43 serviços)

`achievement.service.ts` · `auth.service.ts` · `booster.service.ts` · `certificate.service.ts` · `community.service.ts` · `community-report.service.ts` · `content-moderation.service.ts` · `content-policy.service.ts` · `course-notification.service.ts` · `course.service.ts` · `dashboard-goals.service.ts` · `dashboard-pending.service.ts` · `direct-message.service.ts` · `enrollment.service.ts` · `exam-admin.service.ts` · `exam-daily-rewards.service.ts` · `exam-grading.service.ts` · `exam-learning.service.ts` · `exam.service.ts` · `follow.service.ts` · `lesson-learning.service.ts` · `live-room.service.ts` · `moderation.service.ts` · `moderation-admin.service.ts` · `notification.service.ts` · `notification-preferences.service.ts` · `onboarding.service.ts` · `password-reset.service.ts` · `personal-stats.service.ts` · `platform-settings.service.ts` · `premium.service.ts` · `profile-showcase.service.ts` · `public-profile.service.ts` · `ranking-season.service.ts` · `recommendation.service.ts` · `review-pack.service.ts` · `shop-entitlement.service.ts` · `shop.service.ts` · `student.service.ts` · `study-continuation.service.ts` · `wallet.service.ts` · `xp.service.ts` · `social.service.ts`

### 4.2.4 Bibliotecas (77 arquivos em `src/lib/`)

**Utilitários principais:** `gamification.ts`, `profanity-filter.ts`, `profanity-lists.ts`, `certificate-pdf.ts`, `certificate-qr.ts`, `community-feed.ts`, `cosmetics.ts` (12 temas), `exam-daily-rewards.ts`, `ranking-leagues.ts`, `premium.ts`, `native-app.ts`

**Subpastas:**
- `moderation/` (4): `commands.ts`, `guards.ts`, `permissions.ts`, `status.ts`
- `validations/` (8): `auth.ts`, `certificate.ts`, `community.ts`, `course.ts`, `exam.ts`, `live-room.ts`, `moderation.ts`, `profile.ts`

### 4.2.5 Aplicativos Nativos (Capacitor + Tauri)

**Capacitor Android:** Configurado com `@capacitor/core` 8.4.1, `@capacitor/android` 8.4.1. App ID: `br.com.hexavante.app`. Scripts: `native:android:init`, `native:android:build`, `native:android:run`

**Tauri Desktop:** Configurado com `@tauri-apps/api` 2.11.1, `@tauri-apps/cli` 2.4.0. Backend em Rust (`src-tauri/src/main.rs`). 28 canais IPC.

**Hooks nativos:** `use-keyboard-shortcuts.ts` (Ctrl+B sidebar, Ctrl+K command palette, Ctrl+1/2/3 navegação)

### 4.2.6 Migrations SQL (28 scripts)

`sprint-content-policy.sql`, `db:exam-daily-rewards.sql`, `db:shop-expand.sql`, `db:direct-messages.sql`, `db:ux.sql`, `db:course-learning.sql`, `db:exams-phase-b.sql`, `db:ranking-phase-d.sql`, `db:community-phase-e.sql`, `db:shop-phase-f.sql`, `db:notifications-phase-h.sql`, `db:content-policy.sql`, `db:studio.sql`, entre outros.

## 4.3 Aplicação Desktop (Electron)

### 4.3.1 Arquitetura Main/Preload/Renderer

**Processo Main** (`electron/main/index.ts`): Gerencia janela, menus, atualizações e segurança. 22 arquivos no total (3 core + 4 services + 12 IPC + 2 utils + 1 menu).

**Processo Preload:** Expõe APIs seguras via `contextBridge`. 28 canais IPC validados com Zod.

**Processo Renderer:** Executa a aplicação React com React Router 6.

### 4.3.2 Estrutura de Rotas — 35 rotas

```
src/routes/index.tsx — React Router 6 com 35 rotas
```

### 4.3.3 Dual HTTP Strategy (IPC Adapter)

O renderer utiliza Axios com um adaptador customizado (`ipc-adapter.ts`) que roteia requisições HTTP através do processo main quando `window.electronAPI.http` está disponível, bypassando CORS. Fallback para Axios direto em modo browser/dev.

### 4.3.4 Armazenamento Criptografado de Tokens

Refresh tokens são criptografados via `safeStorage` (keychain do SO) e armazenados em `userData/tokens/refresh.enc` com permissões `0o600`.

### 4.3.5 OAuth Flow

Abre BrowserWindow dedicado, monitora cookies (`cookies.changed`) e polling de sessão para detectar autenticação.

### 4.3.6 Allowlist de IPC

O proxy HTTP do processo main (`http.ipc.ts`) valida endpoints contra allowlist: `api.hexavante.com.br`, `localhost`, `127.0.0.1`, `187.127.54.55`. Requisitos locais para porta 3045 são reescritos para API de produção.

### 4.3.7 Temas Cosméticos (12 temas)

Sistema completo de override de variáveis CSS com suporte a modo claro/escuro, persistido via Zustand persist middleware:

| Tema | Estilo |
|:-----|:-------|
| `default` | Padrão roxo |
| `cyberpunk` | Neon rosa/azul |
| `hacker` | Verde terminal |
| `obsidian` | Escuro premium |
| `sunset` | Laranja/dourado |
| `ocean` | Azul oceano |
| `sakura` | Rosa sakura |
| `midnight` | Azul noturno |
| `amber` | Âmbar quente |
| `snow` | Neve claro |
| `daylight` | Dia claro |
| `cream` | Creme suave |

### 4.3.8 Segurança (CSP)

```typescript
defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'..."
      ]
    }
  })
})
```

### 4.3.9 Otimizações para GPU AMD

```typescript
if (process.platform === 'linux' || process.platform === 'win32') {
  app.commandLine.appendSwitch('disable-gpu-sandbox')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  if (process.platform === 'linux') {
    app.commandLine.appendSwitch('use-vulkan', 'native')
  }
  app.commandLine.appendSwitch('disable-gpu-vsync')
}
```

### 4.3.10 Arquitetura Clean Architecture

```
src/
├── adapters/       # 10 adaptadores (3 IPC + 4 HTTP + 2 error + 1 httpClient)
├── api/            # Chamadas à API (16 grupos de endpoints)
├── domain/         # 16 arquivos de domínio (enums, schemas, types)
├── features/       # 21 módulos feature-based
├── hooks/          # use-keyboard-shortcuts (Ctrl+B, Ctrl+K, Ctrl+1/2/3)
├── http/           # Cliente HTTP com IPC adapter
├── services/       # 13 serviços
├── routes/         # React Router 6 (35 rotas)
├── providers/      # 5 context providers (App, Query, Theme, Auth, Toast)
├── components/     # 23 componentes UI
└── styles/         # globals.css (Tailwind + theme variables)
```

## 4.4 API Backend (Fastify)

### 4.4.1 Módulos da API (15 módulos, 95 arquivos)

| Módulo | Arquivos | Endpoints | Responsabilidade |
|:-------|:--------:|:----------|:-----------------|
| `auth` | 8 | `/api/v1/auth/*` | Login, registro, sessão, OAuth |
| `authorization` | 7 | `/api/v1/authorization/*` | RBAC (roles, permissões) |
| `courses` | 12 | `/api/v1/courses/*` | Cursos, módulos, aulas, learning |
| `exams` | 5 | `/api/v1/exams/*` | Simulados, questões, tentativas |
| `gamification` | 4 | `/api/v1/rankings/*` | XP, rankings, conquistas |
| `shop` | 5 | `/api/v1/shop/*` | Loja, inventário |
| `community` | 5 | `/api/v1/community/*` | Feed, likes, comentários, discussões |
| `conversations` | 6 | `/api/v1/conversations/*` | Mensagens diretas |
| `certificates` | 6 | `/api/v1/certificates/*` | Certificados, verificação |
| `notifications` | 6 | `/api/v1/notifications/*` | Notificações, preferências |
| `instructor` | 5 | `/api/v1/instructor/*` | Gestão de instrutores |
| `live-rooms` | 6 | `/api/v1/live-rooms/*` | Salas ao vivo, chat |
| `moderation` | 6 | `/api/v1/moderation/*` | Ban, mute, aviso, logs |
| `users` | 8 | `/api/v1/users/*` | Perfil de usuário |
| `health` | 3 | `/health` | Health check |

### 4.4.2 Plugins (5)

| Plugin | Descrição |
|:-------|:----------|
| `cors.ts` | CORS configurado |
| `helmet.ts` | Headers de segurança HTTP |
| `rate-limit.ts` | Rate limiting distribuído |
| `compress.ts` | Compressão gzip |
| `auth.ts` | Integração Better Auth |

### 4.4.3 Camada de Cache (7 serviços Redis)

| Cache | Responsabilidade |
|:------|:-----------------|
| `email-verification.cache.ts` | Verificação de e-mail |
| `otp.cache.ts` | Códigos OTP |
| `password-reset.cache.ts` | Redefinição de senha |
| `permission.cache.ts` | Permissões de usuário |
| `rate-limit.cache.ts` | Rate limiting |
| `role.cache.ts` | Cargos de usuário |
| `session.cache.ts` | Sessões ativas |

### 4.4.4 Autenticação e Autorização (RBAC)

**Middleware `authenticate`:**

```typescript
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({ headers: request.headers as any });
  if (!session) return reply.status(401).send({ error: 'Unauthorized' });
  request.auth = session;
  request.user = session.user;
}
```

**Middleware `permission`:**

```typescript
export function permission(name: string) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const service: AuthorizationService = (request as any).authorizationService;
    const result = await service.hasPermission(request.user!.id, name);
    if (!result.granted) throw new ForbiddenError(`Permissão necessária: ${name}`);
  };
}
```

**Exemplo de uso:** `{ preHandler: [authenticate, permission("course.create")] }`

### 4.4.5 Documentação Swagger

A API é documentada automaticamente via OpenAPI, acessível em `http://localhost:3045/docs`. Título: "Hexavante API", versão: "1.0.0".

### 4.4.6 Graceful Shutdown

```typescript
// Tratamento de sinais de terminação
process.on('SIGTERM', async () => {
  await redisClient.disconnect();
  await prisma.$disconnect();
  process.exit(0);
});
```

## 4.5 Banco de Dados

### 4.5.1 Modelo Entidade-Relacionamento (57 entidades, 22 enums)

| Domínio | Entidades |
|:--------|:----------|
| **Usuários** | User, Account, Session, VerificationToken, verification, UserRole, Role, Permission, RolePermission |
| **Cursos** | Category, Course, CourseInstructor, InstructorApplication, CourseModeration, Module, Lesson, Material, CourseEnrollment, LessonProgress, LessonFavorite, LessonNote |
| **Simulados** | Exam, ExamQuestion, ExamAlternative, ExamAttempt, ExamAnswer, ExamQuestionFavorite |
| **Gamificação** | UserXP, UserWallet, CoinTransaction, XpTransaction, StoreItem, UserInventory, RankingSeason, RankingSeasonResult, UserAchievement |
| **Social** | UserFollow, SocialActivity, ActivityLike, ActivityComment, ActivityCommentLike, ActivityReaction, CommunityReport, DirectConversation, DirectMessage |
| **Notificações** | Notification, UserNotificationSettings |
| **Moderação** | UserBan, UserMute, UserWarning, ModerationLog, ContentPolicyViolation |
| **Infraestrutura** | Certificate, LiveRoom, LiveRoomParticipant, LiveChatMessage, PlatformSetting |

### 4.5.2 Schema Prisma (Trecho)

```prisma
model User {
  id             String    @id @default(cuid())
  username       String?   @unique
  fullName       String    @map("full_name")
  email          String    @unique
  coins          Int       @default(0)
  boosterMultiplier Float @default(1.0) @map("booster_multiplier")
  role           String    @default("user")
  banned         Boolean   @default(false)
  createdAt      DateTime  @default(now()) @map("created_at")

  xp             UserXP?
  wallet         UserWallet?
  roles          UserRole[]
  enrollments    CourseEnrollment[]
  examAttempts   ExamAttempt[]
  certificates   Certificate[]
  notifications  Notification[]
  // ... 70+ relations

  @@map("users")
}

model UserXP {
  id        String        @id @default(cuid())
  userId    String        @unique @map("user_id")
  level     Int           @default(1)
  currentXp Int           @default(0) @map("current_xp")
  totalXp   Int           @default(0) @map("total_xp")
  league    RankingLeague @default(BRONZE)
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("user_xp")
}

enum RankingLeague { BRONZE  SILVER  GOLD }

model Exam {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  examType    ExamType @map("exam_type")
  timeLimit   Int?     @map("time_limit")
  isPublished Boolean  @default(true) @map("is_published")
  questions   ExamQuestion[]
  attempts    ExamAttempt[]
  @@map("exams")
}

model Certificate {
  id         String    @id @default(cuid())
  userId     String    @map("user_id")
  courseId   String    @map("course_id")
  code       String    @unique
  issuedAt   DateTime  @default(now()) @map("issued_at")
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  course     Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  @@unique([userId, courseId])
  @@map("certificates")
}
```

## 4.6 Módulo de Gamificação (Código-Fonte)

### 4.6.1 Cálculo de Nível e XP

```typescript
// Fórmula de cálculo de nível
export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100));
}

// XP necessário para próximo nível
export function xpRequiredForLevel(level: number): number {
  return level * 100;
}

// Progresso em percentual
export function xpProgressPercent(level: number, currentXp: number): number {
  const needed = xpRequiredForLevel(level);
  return needed > 0 ? Math.min(100, Math.round((currentXp / needed) * 100)) : 0;
}
```

**Exemplos de progressão:**

| Nível | XP Total Necessário | XP para Próximo |
|:-----:|:-------------------:|:---------------:|
| 1 | 100 | 100 |
| 5 | 2.500 | 500 |
| 10 | 10.000 | 1.000 |
| 25 | 62.500 | 2.500 |
| 50 | 250.000 | 5.000 |

### 4.6.2 Constantes de Recompensas

```typescript
export const XP_REWARDS = {
  LESSON: 10,        // XP por concluir aula
  MODULE: 25,        // XP por concluir módulo
  COURSE: 100,       // XP por concluir curso
  EXAM: 20,          // XP por finalizar simulado
  EXAM_PASS_BONUS: 30, // Bônus por aprovação
};

export const COIN_REWARDS = {
  EXAM_CORRECT: 5,   // Moedas por questão correta
  LESSON: 3,          // Moedas por aula
  MODULE: 10,         // Moedas por módulo
  COURSE: 25,         // Moedas por curso
};

export const EXAM_PASS_SCORE = 70; // Nota mínima para aprovação
```

### 4.6.3 Sistema de Conquistas (12 conquistas)

| Chave | Nome | Descrição |
|:------|:-----|:----------|
| `first_lesson` | Primeira Aula | Complete sua primeira aula |
| `ten_lessons` | Dedicado | Complete 10 aulas |
| `fifty_lessons` | Viciado em Estudo | Complete 50 aulas |
| `hundred_lessons` | Mestre dos Estudos | Complete 100 aulas |
| `first_course` | Primeiro Curso | Complete seu primeiro curso |
| `five_courses` | Poliglota | Complete 5 cursos |
| `first_exam` | Primeiro Teste | Responda seu primeiro exame |
| `perfect_exam` | Nota Máxima | 100% de acerto em um exame |
| `level_5` | Aprendiz | Atinga o nível 5 |
| `level_10` | Experiente | Atinga o nível 10 |
| `level_25` | Veterano | Atinga o nível 25 |
| `level_50` | Lendário | Atinga o nível 50 |

### 4.6.4 Ligas do Ranking

```typescript
private calculateLeague(level: number): RankingLeague {
  if (level >= 25) return "GOLD";
  if (level >= 10) return "SILVER";
  return "BRONZE";
}
```

## 4.7 Módulo de Simulados (Código-Fonte)

### 4.7.1 Serviço de Simulados

```typescript
export async function searchPublishedExams(query, userId?) {
  const exams = await prisma.exam.findMany({
    where: { isPublished: true, ...filters },
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: sort === 'popular'
      ? { attempts: { _count: 'desc' } }
      : { createdAt: 'desc' },
  });
  return exams.map(exam => ({
    id: exam.id, slug: exam.slug, title: exam.title,
    examType: exam.examType, questionCount: exam._count.questions,
    timeLimit: exam.timeLimit, userAttemptCount: attemptMap.get(exam.id) ?? 0,
  }));
}
```

### 4.7.2 Submissão de Tentativa

```typescript
export async function submitAttempt(userId, attemptId, payload) {
  // 1. Valida tentativa (existe, não finalizada, tempo)
  // 2. Corrige múltipla escolha
  for (const question of mcQuestions) {
    const selected = question.alternatives.find(a => a.id === answers[question.id]);
    const isCorrect = selected?.isCorrect ?? false;
    if (isCorrect) correct++;
  }
  // 3. Registra dissertativas (pendentes de correção manual)
  // 4. Calcula nota: score = Math.round((correct / mcTotal) * 100)
  // 5. Concede XP e moedas
  await awardXp(userId, XP_REWARDS.EXAM, "EXAM", attemptId);
  if (score >= EXAM_PASS_SCORE) {
    await awardXp(userId, XP_REWARDS.EXAM_PASS_BONUS, "EXAM", `${attemptId}-pass`);
  }
  // 6. Registra atividade social se aprovado
  // 7. Sincroniza conquistas
  return { attemptId, score, correct, total, xpEarned, coinsEarned };
}
```

### 4.7.3 Estatísticas e Evolução

```typescript
export async function getUserExamStats(userId) {
  const attempts = await prisma.examAttempt.findMany({
    where: { userId, finishedAt: { not: null } },
    select: { score: true },
  });
  const scores = attempts.map(a => a.score);
  return {
    totalAttempts: attempts.length,
    averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
    bestScore: Math.max(...scores),
  };
}
```

## 4.8 Módulo de Comunidade (Código-Fonte)

```typescript
export async function addActivityComment(activityId, userId, content) {
  // Verifica evasão por sequência (anti-spam)
  const recentFragments = await getRecentCommunityFragments(userId, activityId);
  await enforceCleanMessageSequence({ userId, text: content, recentFragments });

  const comment = await prisma.activityComment.create({
    data: { activityId, userId, content },
    include: { user: { select: { id: true, username: true, fullName: true } } },
  });

  // Notifica autor da publicação
  if (activity.userId !== userId) {
    await createNotification({
      userId: activity.userId, type: "COMMUNITY_REPLY",
      title: "Nova resposta na comunidade",
      message: `${comment.user.fullName}: ${content.slice(0, 100)}`,
    });
  }
  return comment;
}
```

## 4.9 Módulo de Certificados

```typescript
export async function certificateRoutes(fastify) {
  fastify.get("/api/v1/certificates", { preHandler: [authenticate] },
    asyncHandler(controller.getUserCertificates));
  fastify.post("/api/v1/certificates",
    { preHandler: [authenticate, validateBody(issueCertificateSchema)] },
    asyncHandler(controller.issueCertificate));
  fastify.get("/api/v1/certificates/verify/:code",
    { preHandler: [validateParams(verifyCertificateSchema)] },
    asyncHandler(controller.verifyCertificate));
}
```

Gera certificados em **PDF** com **QR Code** para verificação, utilizando `pdf-lib` e `qrcode`.

## 4.10 Módulo de Notificações (14 tipos)

**Tipos suportados:** `XP_EARNED` · `COIN_EARNED` · `LEVEL_UP` · `COURSE_APPROVED` · `COURSE_REJECTED` · `COURSE_UPDATED` · `INSTRUCTOR_APPROVED` · `INSTRUCTOR_REJECTED` · `CERTIFICATE_ISSUED` · `SYSTEM_ANNOUNCEMENT` · `MODERATION_ACTION` · `NEW_MESSAGE` · `COMMUNITY_REPLY` · `SOLUTION_ACCEPTED`

### 4.10.1 Backend — Rotas e Serviço

```typescript
// notification.routes.ts
export async function notificationRoutes(fastify: FastifyInstance) {
  const repository = new NotificationRepository();
  const service = new NotificationService();
  const controller = new NotificationController(service);

  fastify.get("/api/v1/notifications",
    { preHandler: [authenticate, validateQuery(listNotificationsSchema)] },
    asyncHandler(controller.getUserNotifications));

  fastify.patch("/api/v1/notifications/:id/read",
    { preHandler: [authenticate, validateParams(markReadSchema)] },
    asyncHandler(controller.markAsRead));

  fastify.patch("/api/v1/notifications/read-all",
    { preHandler: [authenticate, validateBody(markAllReadSchema)] },
    asyncHandler(controller.markAllAsRead));
}
```

### 4.10.2 Criação com Deduplicação e Preferências

```typescript
// notification.service.ts (frontend)
export async function createNotification(input: CreateNotificationInput) {
  // 1. Verifica preferências do usuário
  if (!input.skipPreferenceCheck) {
    const enabled = await isNotificationTypeEnabled(input.userId, input.type, input.link);
    if (!enabled) return null;
  }
  // 2. Deduplicação temporal (evita spam)
  if (!input.skipDedupe) {
    const dedupeMinutes = NOTIFICATION_DEDUPE_MINUTES[input.type];
    if (dedupeMinutes) {
      const since = new Date(Date.now() - dedupeMinutes * 60_000);
      const existing = await prisma.notification.findFirst({
        where: { userId: input.userId, type: input.type,
          ...(input.link ? { link: input.link } : {}),
          createdAt: { gte: since } },
      });
      if (existing) return existing;
    }
  }
  // 3. Cria notificação
  return prisma.notification.create({
    data: { userId: input.userId, type: input.type,
      title: input.title, message: input.message, link: input.link ?? null },
  });
}
```

### 4.10.3 Contagem de Não Lidas e Marcação

```typescript
export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
```

### 4.10.4 Validação com Zod (Schema)

```typescript
// notification.schemas.ts
export const listNotificationsSchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(20),
    unreadOnly: z.coerce.boolean().optional().default(false),
  }),
});
```

## 4.11 Módulo de Mensagens Diretas

### 4.11.1 Backend — Rotas

```typescript
// conversation.routes.ts
export async function conversationRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/conversations",
    { preHandler: [authenticate] },
    asyncHandler(controller.getInbox));

  fastify.post("/api/v1/conversations",
    { preHandler: [authenticate, validateBody(createConversationSchema)] },
    asyncHandler(controller.createConversation));

  fastify.get("/api/v1/conversations/:conversationId/messages",
    { preHandler: [authenticate, validateParams(getMessagesSchema)] },
    asyncHandler(controller.getMessages));

  fastify.post("/api/v1/conversations/:conversationId/messages",
    { preHandler: [authenticate, validateParams(sendMessageSchema), validateBody(sendMessageSchema)] },
    asyncHandler(controller.sendMessage));

  fastify.patch("/api/v1/conversations/:conversationId/read",
    { preHandler: [authenticate, validateParams(markReadSchema)] },
    asyncHandler(controller.markAsRead));
}
```

### 4.11.2 Validação de Permissão de Mensagem

```typescript
// direct-message.service.ts (frontend)
export async function canMessageUser(senderId: string, recipientId: string) {
  if (senderId === recipientId) {
    return { allowed: false, reason: "Você não pode enviar mensagem para si mesmo." };
  }
  await assertUserNotBanned(senderId);
  await assertUserCanInteract(senderId);

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true, profileVisibility: true },
  });
  if (!recipient) return { allowed: false, reason: "Usuário não encontrado." };

  // Perfis privados exigem follow mútuo
  if (recipient.profileVisibility === "private") {
    const [senderFollows, recipientFollows] = await Promise.all([
      isFollowing(senderId, recipientId),
      isFollowing(recipientId, senderId),
    ]);
    if (!senderFollows && !recipientFollows) {
      return { allowed: false,
        reason: "Este perfil é privado. Siga o usuário ou seja seguido para enviar mensagens." };
    }
  }
  return { allowed: true };
}
```

### 4.11.3 Envio com Filtro de Conteúdo e Anti-Spam

```typescript
export async function sendDirectMessage(conversationId: string, senderId: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) throw new Error("A mensagem não pode estar vazia.");
  if (trimmed.length > 2000) throw new Error("A mensagem pode ter no máximo 2000 caracteres.");

  // Janela de 5 minutos para detectar evasão por sequência
  const since = new Date(Date.now() - 5 * 60 * 1000);
  const recentFromSender = await prisma.directMessage.findMany({
    where: { conversationId, senderId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" }, take: 8,
    select: { body: true },
  });
  const recentFragments = recentFromSender
    .map((row) => row.body.trim())
    .filter((b) => b.length > 0 && b.length <= 24 && b.split(/\s+/).length <= 3);

  // Anti-evasão + mascaramento de palavrões
  await enforceCleanMessageSequence({ userId: senderId, text: trimmed, recentFragments,
    fieldLabel: "mensagem", context: "DIRECT_MESSAGE" });
  const sanitized = filterProfanity(trimmed);

  // Transação atômica: cria mensagem + atualiza timestamp da conversa
  const [message] = await prisma.$transaction([
    prisma.directMessage.create({
      data: { conversationId, senderId, body: sanitized },
      include: { sender: { select: { id: true, username: true, fullName: true } } },
    }),
    prisma.directConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  // Notifica destinatário
  const senderName = message.sender.fullName || message.sender.username;
  await createNotification({
    userId: recipientId, type: "NEW_MESSAGE",
    title: "Nova mensagem",
    message: `${senderName}: ${sanitized.slice(0, 120)}${sanitized.length > 120 ? "..." : ""}`,
    link: `/mensagens/${conversationId}`,
  });
  return message;
}
```

### 4.11.4 Schema de Validação (Zod)

```typescript
// conversation.schemas.ts
export const sendMessageSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, "ID da conversa é obrigatório"),
  }),
  body: z.object({
    body: z.string().min(1, "A mensagem não pode estar vazia.")
      .max(2000, "A mensagem pode ter no máximo 2000 caracteres."),
  }),
});
```

## 4.12 Módulo de Loja e Inventário

**Categorias:** `TITLE` · `AVATAR_BORDER` · `THEME` · `COSMETIC` · `BOOSTER` · `PASS` · `REVIEW_PACK` · `PET` · `PET_COSMETIC`

**Fluxo de compra:** Validação de moedas → Dedução → Criação de inventário → Ativação de efeitos (boosters) → Notificação

## 4.13 Módulo de Salas Ao Vivo

### 4.13.1 Backend — Rotas (13 endpoints)

```typescript
// live-room.routes.ts
export async function liveRoomRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/live-rooms", asyncHandler(controller.list));
  fastify.get("/api/v1/live-rooms/instructor", { preHandler: [authenticate] },
    asyncHandler(controller.instructorRooms));
  fastify.get("/api/v1/live-rooms/instructor/courses", { preHandler: [authenticate] },
    asyncHandler(controller.instructorCourses));
  fastify.post("/api/v1/live-rooms", { preHandler: [authenticate] },
    asyncHandler(controller.create));
  fastify.get("/api/v1/live-rooms/:id", { preHandler: [authenticate] },
    asyncHandler(controller.detail));
  fastify.patch("/api/v1/live-rooms/:id", { preHandler: [authenticate] },
    asyncHandler(controller.update));
  fastify.delete("/api/v1/live-rooms/:id", { preHandler: [authenticate] },
    asyncHandler(controller.cancel));
  fastify.post("/api/v1/live-rooms/:id/start", { preHandler: [authenticate] },
    asyncHandler(controller.start));
  fastify.post("/api/v1/live-rooms/:id/end", { preHandler: [authenticate] },
    asyncHandler(controller.end));
  fastify.post("/api/v1/live-rooms/:id/join", { preHandler: [authenticate] },
    asyncHandler(controller.join));
  fastify.post("/api/v1/live-rooms/:id/leave", { preHandler: [authenticate] },
    asyncHandler(controller.leave));
  fastify.get("/api/v1/live-rooms/:id/messages", { preHandler: [authenticate] },
    asyncHandler(controller.messages));
  fastify.post("/api/v1/live-rooms/:id/messages", { preHandler: [authenticate] },
    asyncHandler(controller.send));
}
```

### 4.13.2 Máquina de Estados (Status)

**Status:** `SCHEDULED` → `LIVE` → `ENDED` / `CANCELLED`

| Transição | Regra |
|:----------|:------|
| `create` | Cria sala em `SCHEDULED` com `scheduledAt` futuro |
| `start` | Transição `SCHEDULED` → `LIVE` (apenas instrutor owner) |
| `end` | Transição `LIVE` → `ENDED` |
| `cancel` | Transição `SCHEDULED` → `CANCELLED` |
| `update` | Apenas em status `SCHEDULED` |

### 4.13.3 Serviço — Envio de Mensagens no Chat

```typescript
// live-room.service.ts
async sendMessage(roomId: string, userId: string, message: string) {
  const room = await this.repo.findById(roomId);
  if (!room) throw new NotFoundError("Sala não encontrada");
  if (room.status !== "LIVE")
    throw new BadRequestError("O chat só está disponível durante a transmissão ao vivo");

  const allowed = await this.canAccessChat(roomId, userId);
  if (!allowed) throw new ForbiddenError("Você precisa estar na sala para enviar mensagens");

  const row = await this.repo.createMessage(roomId, userId, message.trim());
  return this.serializeMessage(row);
}
```

### 4.13.4 Schema de Validação

```typescript
// live-room.schemas.ts
export const createRoomSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(200),
  description: z.string().max(2000).optional(),
  courseId: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  scheduledAt: z.coerce.date(),
  maxParticipants: z.coerce.number().int().positive().optional(),
});
```

## 4.14 Módulo de Moderação

### 4.14.1 Backend — Rotas com RBAC

```typescript
// moderation.routes.ts
export async function moderationRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/moderation/stats",
    { preHandler: [authenticate, permission("community.moderate")] },
    asyncHandler(controller.getStats));

  fastify.get("/api/v1/moderation/users",
    { preHandler: [authenticate, permission("community.moderate")] },
    asyncHandler(controller.listUsers));

  fastify.post("/api/v1/moderation/users/:userId/ban",
    { preHandler: [authenticate, permission("community.ban")] },
    asyncHandler(controller.ban));

  fastify.post("/api/v1/moderation/users/:userId/unban",
    { preHandler: [authenticate, permission("community.moderate")] },
    asyncHandler(controller.unban));

  fastify.post("/api/v1/moderation/users/:userId/mute",
    { preHandler: [authenticate, permission("community.warn")] },
    asyncHandler(controller.mute));

  fastify.post("/api/v1/moderation/users/:userId/unmute",
    { preHandler: [authenticate, permission("community.moderate")] },
    asyncHandler(controller.unmute));

  fastify.post("/api/v1/moderation/users/:userId/warn",
    { preHandler: [authenticate, permission("community.warn")] },
    asyncHandler(controller.warn));
}
```

### 4.14.2 Serviço — Banimento e Advertência

```typescript
// moderation.service.ts
async banUser(moderatorId: string, userId: string, input: { reason: string; durationHours?: number }) {
  if (moderatorId === userId) throw new AppError(400, "Você não pode banir a si mesmo");
  const existing = await this.moderationRepository.findActiveBan(userId);
  if (existing) throw new AppError(409, "Usuário já possui um banimento ativo");

  const expiresAt = input.durationHours
    ? new Date(Date.now() + input.durationHours * 60 * 60 * 1000) : undefined;
  await this.moderationRepository.banUser(userId, moderatorId, input.reason, expiresAt);

  // Log da ação de moderação
  await this.moderationRepository.writeLog({
    moderatorId, targetUserId: userId, action: "BAN",
    description: `Banimento: ${input.reason}`,
    metadata: { durationHours: input.durationHours ?? null },
  });
}

async warnUser(moderatorId: string, userId: string, input: { reason: string }) {
  if (moderatorId === userId) throw new AppError(400, "Você não pode advertir a si mesmo");
  await this.moderationRepository.warnUser(userId, moderatorId, input.reason);
  await this.moderationRepository.writeLog({
    moderatorId, targetUserId: userId, action: "WARN",
    description: `Advertência: ${input.reason}`,
  });
}
```

### 4.14.3 Terminal de Comando do Admin

O painel administrativo inclui um terminal que aceita comandos para moderação avançada:

| Comando | Descrição | Exemplo |
|:--------|:----------|:--------|
| `/ban` | Banir usuário | `/ban nicolas Ofensas graves 24` |
| `/unban` | Revogar banimento | `/unban nicolas` |
| `/mute` | Silenciar usuário | `/mute nicolas Spam 12` |
| `/warn` | Advertir usuário | `/warn nicolas Linguagem inadequada` |
| `/addxp` | Adicionar XP | `/addxp nicolas 500 Motivo` |
| `/setlevel` | Definir nível | `/setlevel nicolas 10` |
| `/addmoedas` | Adicionar moedas | `/addmoedas nicolas 1000 Bônus` |
| `/addcargo` | Adicionar cargo | `/addcargo nicolas instrutor` |
| `/broadcast` | Mensagem global | `/broadcast Manutenção programada` |
| `/stats` | Estatísticas | `/stats` |
| `/logs` | Histórico | `/logs nicolas` |
| `/impersonate` | Assumir identidade | `/impersonate nicolas` |

### 4.14.4 Logs de Moderação (23 tipos)

`XP_ADD` · `XP_REMOVE` · `COIN_ADD` · `COIN_REMOVE` · `BAN` · `UNBAN` · `MUTE` · `UNMUTE` · `WARN` · `BROADCAST` · `COURSE_PUBLISH` · `COURSE_REJECT` · `INSTRUCTOR_APPROVE` · `INSTRUCTOR_REJECT` · `IMPERSONATE` · `LEVEL_CHANGE` · `ROLE_ADD` · `ROLE_REMOVE` · `PASSWORD_RESET` · `MAINTENANCE` · `BOOSTER_ACTIVATE` · `USER_SEARCH` · `COURSE_VIEW`

## 4.15 Módulo de Instrutores

### 4.15.1 Backend — Rotas

```typescript
// instructor.routes.ts
export async function instructorRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/instructor/status",
    { preHandler: [authenticate] },
    asyncHandler(controller.getStatus));

  fastify.post("/api/v1/instructor/apply",
    { preHandler: [authenticate] },
    asyncHandler(controller.apply));

  fastify.get("/api/v1/courses/categories",
    asyncHandler(controller.getCategories));

  fastify.get("/api/v1/instructor/courses",
    { preHandler: [authenticate] },
    asyncHandler(controller.getMyCourses));
}
```

### 4.15.2 Serviço — Candidatura e Validação

```typescript
// instructor.service.ts
async apply(userId: string, data: { motivation: string; experience: string; portfolioUrl?: string }) {
  const hasPending = await this.repository.hasActivePendingApplication(userId);
  if (hasPending) {
    throw new ConflictError("Já existe uma solicitação em análise");
  }
  const application = await this.repository.createApplication(userId, {
    motivation: data.motivation,
    experience: data.experience,
    portfolioUrl: data.portfolioUrl || null,
  });
  return application;
}

async getMyCourses(userId: string) {
  const courses = await this.repository.listMyCourses(userId);
  return courses.map((c) => ({
    id: c.id, title: c.title, slug: c.slug, status: c.status,
    thumbnailUrl: c.thumbnailUrl, level: c.level,
    moduleCount: c.moduleCount, enrollmentCount: c.enrollmentCount,
  }));
}
```

### 4.15.3 Schema de Validação

```typescript
// instructor.schemas.ts
export const applyInstructorSchema = z.object({
  motivation: z.string()
    .min(20, "Conte-nos um pouco mais sobre sua motivação (mín. 20 caracteres)")
    .max(2000),
  experience: z.string()
    .min(20, "Descreva sua experiência (mín. 20 caracteres)")
    .max(2000),
  portfolioUrl: z.string().url("Portfólio inválido").optional().or(z.literal("")),
});
```

### 4.15.4 Fluxo Completo

**Candidatura → Aprovação → Criação → Revisão → Publicação:**

1. **Candidatura:** Usuário envia motivação, experiência e portfólio
2. **Aprovação:** Admin revisa e aprova/rejeita (notificação automática)
3. **Criação:** Instrutor cria cursos com módulos e aulas
4. **Revisão:** Moderação revisa o curso (aprova/rejeita com notas)
5. **Publicação:** Curso fica visível para alunos após aprovação

| Status do Curso | Visível para Alunos | Editável pelo Instrutor |
|:----------------|:-------------------:|:-----------------------:|
| `DRAFT` | ❌ | ✅ |
| `PENDING_REVIEW` | ❌ | ❌ |
| `PUBLISHED` | ✅ | ✅ (edições menores) |
| `REJECTED` | ❌ | ✅ (após correções) |

## 4.16 Camada de Serviços do Frontend Web (44 serviços)

### 4.16.1 Serviço de XP e Gamificação

```typescript
export async function awardXp(userId, amount, source, sourceId, description?) {
  const rewards = await getTotalRewardMultiplier(userId);
  const finalAmount = Math.round(amount * rewards.booster);

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.xpTransaction.findUnique({
      where: { userId_source_sourceId: { userId, source, sourceId } },
    });
    if (existing) return null;

    let userXp = await tx.userXP.findUnique({ where: { userId } });
    if (!userXp) userXp = await tx.userXP.create({ data: { userId } });

    const updated = applyXp(userXp.level, userXp.currentXp, userXp.totalXp, finalAmount);
    const leveledUp = updated.level > userXp.level;

    await tx.xpTransaction.create({ data: { userId, amount: finalAmount, source, sourceId } });
    await tx.userXP.update({ where: { userId }, data: updated });

    return { amount: finalAmount, leveledUp, newLevel: updated.level };
  });

  if (result?.leveledUp) {
    await recordSocialActivity(userId, "LEVEL_UP", { newLevel: result.newLevel });
    await createNotification({
      userId, type: "LEVEL_UP",
      title: `Nível ${result.newLevel}!`,
      message: `Parabéns! Você subiu para o nível ${result.newLevel}.`,
    });
  }
  return result;
}
```

### 4.16.2 Serviço de Loja Virtual

```typescript
export async function purchaseStoreItem(userId, storeItemId) {
  const item = await prisma.storeItem.findFirst({ where: { id: storeItemId, isActive: true } });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const premium = buildPremiumStatus(user);

  if (item.isPremiumOnly && !premium.isActive) {
    throw new Error("Este item é exclusivo para assinantes Premium.");
  }

  const existing = await prisma.userInventory.findUnique({
    where: { userId_storeItemId: { userId, storeItemId } },
  });
  if (existing && item.isPermanent) throw new Error("Você já possui este item.");

  const isFreeForPremium = item.isPremiumOnly && premium.isActive;
  const finalCost = isFreeForPremium ? 0 : item.cost;
  if (finalCost > 0) {
    await spendCoins(userId, finalCost, "SHOP_PURCHASE", item.id);
  }

  let expiresAt = null;
  if (item.category === "BOOSTER") {
    const meta = item.metadata as { multiplier?: number; durationHours?: number };
    const booster = await activateBooster(userId, meta?.multiplier ?? 2, meta?.durationHours ?? 24);
    expiresAt = booster.expiresAt;
  }

  return prisma.userInventory.create({
    data: { userId, storeItemId, isEquipped: item.category === "BOOSTER", expiresAt },
  });
}
```

## 4.17 Filtro de Linguagem Ofensiva (Content Policy)

### 4.17.1 Motor com 6 Camadas

| Camada | Função |
|:-------|:-------|
| 1. Unicode/Invisíveis | Remove caracteres zero-width, soft hyphens |
| 2. Homoglifos | Mapeia cirílicos/fullwidth → latinos (а→a, ＠→@) |
| 3. Leetspeak | Converte números (0→o, 1→i, 3→e, @→a) |
| 4. Frases | Verifica frases bloqueadas inteiras |
| 5. Termos | Verifica termos com fuzzy matching |
| 6. Texto Invertido | Verifica texto escrito de trás para frente |

### 4.17.2 Proteção contra Evasão por Sequência

Detecta quando um usuário divide palavras ofensivas em múltiplos comentários, verificando combinações das últimas 8 mensagens:

```typescript
export function findSequenceEvasion(recentFragments: string[], newText: string) {
  const maxTail = Math.min(recentFragments.length, 8);
  for (let take = 1; take <= maxTail; take++) {
    const tail = recentFragments.slice(-take);
    const combined = [...tail, newText];
    if (scanText(combined.join(" "))) return "blocked";
    if (scanText(combined.join(""))) return "blocked";
  }
  return null;
}
```

### 4.17.3 Mascaramento Automático

```typescript
export function filterProfanity(text: string): string {
  let result = prepareRawText(text);
  for (const phrase of BLOCKED_PHRASES) {
    if (matchesPhrase(result, phrase)) {
      result = result.replace(new RegExp(escapeRegExp(phrase), "gi"),
        (match) => "*".repeat(Math.max(3, match.length)));
    }
  }
  return result;
}
```

## 4.18 Arquitetura do Desktop (Clean Architecture)

### 4.18.1 Camadas

| Camada | Diretório | Responsabilidade |
|:-------|:----------|:-----------------|
| Adaptadores | `src/adapters/` | 10 adaptadores (3 IPC + 4 HTTP + 2 error + 1 httpClient) |
| Domínio | `src/domain/` | 16 arquivos (enums, schemas, types) |
| Serviços | `src/services/` | 13 serviços (auth, exam, gamification, etc.) |
| Features | `src/features/` | 21 módulos feature-based |
| Rotas | `src/routes/` | React Router 6 (35 rotas) |
| Providers | `src/providers/` | 5 context providers (App, Query, Theme, Auth, Toast) |
| Componentes | `src/components/` | 23 componentes UI |

### 4.18.2 Serviços Desktop (consomem a API)

```typescript
export const examService = {
  async list(filters?) {
    const { data } = await api.get(ENDPOINTS.EXAMS.LIST, { params: filters });
    return data;
  },
  async startAttempt(slug) {
    const { data } = await api.post(ENDPOINTS.EXAMS.START(slug));
    return data;
  },
  async submitAttempt(slug, attemptId, answers) {
    const { data } = await api.post(ENDPOINTS.EXAMS.SUBMIT(slug, attemptId), answers);
    return data;
  },
};
```

## 4.19 Stack Tecnológica Completa

| Camada | Tecnologia | Versão | Justificativa |
|:-------|:-----------|:------:|:--------------|
| Frontend Web | Next.js | 16+ | SSR/SSG, App Router, Server Actions |
| Frontend Desktop | Electron | 33+ | Aplicação nativa Windows/Linux |
| Mobile (Android) | Capacitor | 8+ | App nativo Android via web code |
| Desktop (Rust) | Tauri | 2+ | Alternativa leve ao Electron |
| UI Framework | React | 18/19 | Componentização |
| Roteamento Desktop | React Router | 6 | Hash router |
| Linguagem | TypeScript | 5-6 | Type-safety |
| Estilização | Tailwind CSS | 4 | Utility-first |
| UI Components | Radix UI | - | Acessibilidade |
| State (Web) | React Query | 5 | Cache inteligente |
| State (Desktop) | Zustand | 5 | Estado global + persist |
| Formulários | React Hook Form | 7 | Validação |
| Backend | Fastify | 5 | Performance |
| ORM | Prisma | 6 | Type-safety, 57 models |
| Banco de Dados | MariaDB | 10.6+ | Relacional |
| Autenticação | Better Auth | 1.6+ | OAuth + credenciais |
| Cache | Redis | 7+ | Sessões, 7 cache services |
| Validação | Zod | 4 | Schema validation |
| Documentação | Swagger | 9+ | OpenAPI automático |
| Logging | Pino | 10+ | Estruturado |
| Containerização | Docker | - | Consistência |
| CI/CD | GitHub Actions | - | Automação |
| Hospedagem | DigitalOcean VPS | - | Escalabilidade |
| Build Desktop | Electron Vite | 2 | HMR |
| Empacotamento | Electron Builder | 25 | Instaladores NSIS/AppImage |
| Filtro Conteúdo | Custom Engine | - | 6 camadas PT+EN + anti-evasão |
| PDF | pdf-lib | 1.17+ | Certificados |
| QR Code | qrcode | 1.5+ | Verificação |
| Gráficos | Recharts | 3.8+ | Dashboards |
| Ícones | Lucide React | 1.17+ | Vetoriais |
| Sanitização | isomorphic-dompurify | 3+ | XSS protection |
| Criptografia | bcryptjs | 3+ | Senhas |
| JWT | jose | 6+ | Tokens |
| Hooks Android | Capacitor Haptics/Keyboard/StatusBar | 8+ | Nativo |
| Native IPC | @tauri-apps/plugin-http/store/shell | 2+ | Tauri plugins |

## 4.20 Sistema Premium

O Hexavante implementa modelo de assinatura premium com trial gratuito:

```typescript
// premium.service.ts
export async function activateTrial(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.premiumExpiresAt && user.premiumExpiresAt > new Date()) {
    throw new Error("Você já possui um plano Premium ativo.");
  }
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
  await prisma.user.update({
    where: { id: userId },
    data: { premiumExpiresAt: expiresAt },
  });
  return { expiresAt };
}
```

**Benefícios Premium:** Acesso a itens exclusivos da loja (gratuitos para premium), boosters extendidos, títulos exclusivos e bordas de avatar premium.

## 4.21 Sistema de Conteúdo e Moderação (Content Policy)

### 4.21.1 Motor de Filtro com 6 Camadas

| Camada | Função |
|:-------|:-------|
| 1. Unicode/Invisíveis | Remove caracteres zero-width, soft hyphens |
| 2. Homoglifos | Mapeia cirílicos/fullwidth → latinos (а→a, ＠→@) |
| 3. Leetspeak | Converte números (0→o, 1→i, 3→e, @→a) |
| 4. Frases | Verifica frases bloqueadas inteiras |
| 5. Termos | Verifica termos com fuzzy matching |
| 6. Texto Invertido | Verifica texto escrito de trás para frente |

### 4.21.2 Proteção contra Evasão por Sequência

Detecta quando um usuário divide palavras ofensivas em múltiplos comentários, verificando combinações das últimas 8 mensagens:

```typescript
export function findSequenceEvasion(recentFragments: string[], newText: string) {
  const maxTail = Math.min(recentFragments.length, 8);
  for (let take = 1; take <= maxTail; take++) {
    const tail = recentFragments.slice(-take);
    const combined = [...tail, newText];
    if (scanText(combined.join(" "))) return "blocked";
    if (scanText(combined.join(""))) return "blocked";
  }
  return null;
}
```

### 4.21.3 Violations e Logs

O modelo `ContentPolicyViolation` registra todas as violações detectadas com metadados (tipo, contexto, texto original mascarado). Utilizado para ações de moderação automatizadas.

## 4.22 Sistema Social (Expandido)

### 4.22.1 Feed de Atividades

O feed social mostra atividades dos usuários seguidos com tipos: `LEVEL_UP`, `COURSE_COMPLETED`, `EXAM_PASSED`, `ACHIEVEMENT_UNLOCKED`, `CERTIFICATE_ISSUED`, `STORE_PURCHASE`.

### 4.22.2 Reações e Comentários

3 tipos de reação: `CLAP` (palmas), `FIRE` (fogo), `IDEA` (ideia). Comentários com likes e proteção contra spam.

### 4.22.3 Sistema de Denúncias

```typescript
// community-report.service.ts
export async function submitReport(reporterId: string, data: {
  targetType: string; targetId: string; reason: string; description?: string;
}) {
  // Verifica duplicatas, registra denúncia, notifica moderação
}
```

## 4.23 Aplicativos Nativos

### 4.23.1 Capacitor Android

Configuração completa com `@capacitor/core` 8.4.1:

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'br.com.hexavante.app',
  appName: 'Hexavante',
  webDir: '.next',
  server: { androidScheme: 'https' },
};
```

**Plugins:** Browser, Device, Haptics, Keyboard, SplashScreen, StatusBar

**Scripts de build:**
- `native:android:init` — Inicializa projeto Android
- `native:android:sync` — Sincroniza web code
- `native:android:apk` — Gera APK
- `native:android:run` — Roda em emulador/dispositivo

### 4.23.2 Tauri Desktop (Rust)

Alternativa leve ao Electron com backend em Rust:

```rust
// src-tauri/src/main.rs
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**28 canais IPC** com validação Zod. App ID: `com.hexavante.desktop`.

## 4.24 Onboarding e Tour

Sistema de onboarding guiado para novos usuários com tour interativo pelas principais funcionalidades da plataforma.

## 4.25 Pacotes de Revisão

Sistema de "Pacotes de Revisão" (review packs) que permite agrupar questões favoritas para estudo direcionado.

## 4.26 Recomendações

Serviço de recomendação de cursos baseado no histórico de estudo e desempenho do usuário.

---

## 4.27 Instalação e Configuração

### Pré-requisitos

- Node.js 22 LTS+
- npm 10+
- MariaDB 10.6+ / MySQL 8+
- Redis 7+
- Git
- Docker (opcional)

### Backend (Hexavante-API)

```bash
git clone https://github.com/Hexavante/Hexavante-Api.git && cd Hexavante-Api
npm install
cp .env.example .env  # Configure DATABASE_URL, AUTH_SECRET (min 32 chars), REDIS_URL
npx prisma generate && npx prisma db push
npm run seed          # Popula roles e permissões
npm run dev           # http://localhost:3045 | http://localhost:3045/docs
```

### Frontend Web (Hexavante)

```bash
git clone https://github.com/Hexavante/Hexavante.git && cd Hexavante
cp .env.example .env  # Configure variáveis de ambiente
npm install
npx prisma generate && npx prisma db push && npx prisma db seed
npm run dev           # http://localhost:3000
```

### Frontend Desktop (Hexavante-Desktop)

```bash
git clone https://github.com/Hexavante/Hexavante-Desktop.git && cd Hexavante-Desktop
npm install
npm run dev           # Modo desenvolvimento
npm run build         # Gerar instalador
```

### Variáveis de Ambiente (Backend)

| Variável | Obrigatória | Descrição |
|:---------|:-----------:|:----------|
| `DATABASE_URL` | ✅ | Conexão MySQL/MariaDB |
| `AUTH_SECRET` | ✅ | Chave secreta (mín. 32 chars) |
| `REDIS_URL` | ✅ | Conexão Redis |
| `AUTH_URL` | ✅ | URL pública da API |
| `PORT` | ❌ | Porta (default: 3045) |
| `NODE_ENV` | ❌ | development/production |
| `GOOGLE_CLIENT_ID/SECRET` | OAuth | Google OAuth |
| `GITHUB_CLIENT_ID/SECRET` | OAuth | GitHub OAuth |
| `ADMIN_USER_IDS` | ❌ | IDs de admins |

## 4.28 Contas Demonstrativas

| Papel | E-mail | Senha | Permissões |
|:------|:-------|:------|:-----------|
| Super Admin | admin@hexavante.com | Admin123! | Acesso total, moderação, RBAC |
| Instrutor | instrutor@hexavante.com | Instrutor123! | Criar/editar cursos, salas ao vivo |
| Aluno | aluno@hexavante.com | Aluno123! | Cursos, simulados, gamificação |

---

<div style="page-break-after: always;"></div>

# 5 · RESULTADOS E DISCUSSÃO

## 5.1 Testes de Usabilidade

### 5.1.1 Métricas Quantitativas

| Métrica | Resultado | Meta | Status |
|:--------|:---------:|:----:|:------:|
| Tempo médio para cadastro | 2,3 min | ≤ 3 min | ✅ |
| Tempo médio para login | 0,8 min | ≤ 1 min | ✅ |
| Tempo para completar simulado | 25 min | ≤ 30 min | ✅ |
| Taxa de retenção (7 dias) | 75% | ≥ 70% | ✅ |
| Satisfação geral (1-5) | 4,5 | ≥ 4,0 | ✅ |
| Taxa de conclusão de tarefas | 92% | ≥ 85% | ✅ |
| Tempo para inscrever-se em curso | 1,5 min | ≤ 2 min | ✅ |
| Sessões por semana | 4,2 | ≥ 3 | ✅ |
| Taxa de erro no cadastro | 5% | ≤ 10% | ✅ |
| Taxa de erro no simulado | 8% | ≤ 15% | ✅ |

### 5.1.2 Feedback Qualitativo

**Percepções Positivas:**
> *"O sistema de XP me motivou a estudar mais. Eu queria subir de nível o tempo todo."* — Usuário 3

> *"Gostei de ter tudo num só lugar. Não preciso mais trocar entre aplicativos."* — Usuário 7

> *"O ranking me faz querer ser melhor que meus amigos. É viciante!"* — Usuário 12

> *"O aplicativo desktop é muito rápido e não pesa no computador."* — Usuário 2

**Sugestões de Melhoria:**
- Mais opções de boosters na loja (Usuário 5)
- Chat geral para estudantes (Usuário 9)
- Notificações mais personalizáveis (Usuário 14)
- Criar próprios simulados (Usuário 20)
- Suporte a macOS (Usuário 11)

### 5.1.3 Análise de Padrões de Navegação

- **Fluxo principal:** Dashboard → Cursos → Simulados → Ranking (73%)
- **Maior engajamento:** Ranking e Loja (8 min de permanência)
- **Menor engajamento:** Estatísticas detalhadas (2 min)
- **Desktop vs Web:** Sessões 15% mais longas no desktop

## 5.2 Comparação com Concorrentes

| Funcionalidade | Hexavante | Google Classroom | Alura | Khan Academy | Coursera |
|:---------------|:---------:|:----------------:|:-----:|:------------:|:--------:|
| Gamificação completa | ✅ | ❌ | ❌ | ⚠️ | ❌ |
| Simulados dinâmicos | ✅ | ❌ | ❌ | ✅ | ❌ |
| Aulas ao vivo | ✅ | ✅ | ✅ | ❌ | ⚠️ |
| Gestão institucional | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Loja virtual | ✅ | ❌ | ❌ | ❌ | ❌ |
| Comunidade social | ✅ | ❌ | ❌ | ⚠️ | ⚠️ |
| Mensagens privadas | ✅ | ❌ | ❌ | ❌ | ❌ |
| Certificados verificáveis | ✅ | ❌ | ✅ | ❌ | ✅ |
| Aplicativo desktop | ✅ | ❌ | ❌ | ❌ | ❌ |
| API documentada (Swagger) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Código aberto | ✅ | ❌ | ❌ | ❌ | ❌ |

## 5.3 Testes Automatizados

| Projeto | Arquivos de Teste | Testes | Status |
|:--------|:-----------------:|:------:|:------:|
| Web App | 7 | 38 | ✅ PASS |
| API | 13 | 45+ | ✅ PASS |
| **Total** | **20** | **83+** | **✅ PASS** |

**Web — Componentes testados:** XpProgressBar, XPBar, AchievementsList, AuthForm, ExamCard, CourseCard, LeaderboardTable

**API — Módulos testados:** auth (controller + service), users (repository + service), courses (service), middlewares (authenticate, authorize, optionalAuth), lib (AppError, errorHandler, validate, zod-error-formatter), integration (api.test.ts)

## 5.4 Qualidade de Código

| Métrica | Valor |
|:--------|:------|
| TypeScript | 0 erros (3 projetos) |
| Build Web | ✅ Sucesso |
| Build Desktop | ✅ Sucesso |
| Build API | ✅ Sucesso |
| Lint | Apenas warnings |
| Cobertura React | 78% |
| Cobertura Backend | 65% |
| Cobertura Utilitários | 82% |
| Arquivos de teste | 20 (7 Web + 13 API) |
| Total testes | 83+ |

**Padrões:** TypeScript strict · ESLint + Prettier · Clean Architecture · SOLID · RBAC · Validação Zod · AppError + asyncHandler · Graceful Shutdown

## 5.5 Segurança

| Controle | Status |
|:---------|:------:|
| Helmet (headers HTTP) | ✅ |
| CORS configurado | ✅ |
| Rate Limiting | ✅ |
| Compressão gzip | ✅ |
| Better Auth (JWT + cookies) | ✅ |
| Validação Zod | ✅ |
| Profanity Filter | ✅ |
| CSP no Electron | ✅ |
| Context Isolation | ✅ |
| AUTH_SECRET ≥ 32 chars | ✅ |

**Pendente:** CSRF Protection · Audit Logging · 2FA/MFA · Rate limiting granular

## 5.6 Performance

**Implementado:** React Query cache · Lazy loading · 42 índices no DB · Paginação · Debounce · Standalone build · Otimizações GPU AMD

**Pendente:** Redis cache queries · CDN assets · PWA offline · Bundle analysis

## 5.7 Discussão

A taxa de retenção de **75%** supera a meta (70%) e é comparável ao Duolingo (~80%), sendo significativamente superior à média de cursos online (5-15%) (JORDAN, 2015). O feedback valida o design centrado no usuário, com o sistema de XP sendo o elemento mais citado como motivador, alinhando-se com a **Teoria da Autodeterminação** (DECI e RYAN, 1985).

A centralização de ferramentas foi a funcionalidade mais valorizada, corroborando que a fadiga de aplicativos é um problema real. O aplicativo desktop foi avaliado positivamente, com destaque para velocidade e integração com o SO.

A API documentada com Swagger facilita integrações externas. A arquitetura modular (15 módulos) permite evolução sem impacto em módulos existentes. Os 48 testes automatizados garantem estabilidade.

---

<div style="page-break-after: always;"></div>

# 6 · CONCLUSÃO

## 6.1 Retomada dos Objetivos

O Hexavante foi desenvolvido como ecossistema web composto por três aplicações para centralizar ferramentas educacionais. **Todos os 11 objetivos específicos foram atendidos:** autenticação unificada, simulados, gamificação, aulas ao vivo, HexaSchool, certificados, comunidade, moderação, desktop, testes e documentação.

## 6.2 Contribuições do Projeto

| Público | Contribuição |
|:--------|:-------------|
| **Estudantes** | Plataforma unificada que elimina fadiga de aplicativos; gamificação com 12 conquistas e 3 ligas |
| **Instituições** | HexaSchool reduz custos de infraestrutura; gestão de turmas e relatórios |
| **Academia** | Validação empírica de gamificação na educação; documentação completa do processo |
| **Comunidade** | Código aberto no GitHub; stack moderna como referência técnica |

## 6.3 Limitações

1. **Escalabilidade:** Testado com 20 usuários simultâneos
2. **IA:** Sem recomendações personalizadas ou chatbot
3. **Amostra:** 20 participantes (não generalizável)
4. **Conectividade:** Requer internet contínua
5. **macOS:** Desktop sem suporte

## 6.4 Trabalhos Futuros

| # | Trabalho | Descrição | Prioridade |
|:-:|:---------|:----------|:----------:|
| 1 | **Inteligência Artificial** | Implementar modelo de ML para recomendação personalizada de cursos com base no histórico de estudo e desempenho em simulados. Desenvolver chatbot com NLP (Processamento de Linguagem Natural) para tirar dúvidas em tempo real, utilizing RAG (Retrieval-Augmented Generation) com o conteúdo dos cursos. | Alta |
| 2 | **HexaSchool Avançado** | Expandir o módulo institucional com relatórios analíticos (desempenho por turma, evolução temporal, comparativos), integração com Sistemas de Gestão Escolar (SGE) via API, exportação de dados em CSV/PDF e dashboard gerencial com gráficos interativos. | Alta |
| 3 | **Gamificação Expandida** | Implementar sistema de missões diárias e semanais (streaks), eventos sazonais (Competições de Semestre, Desafios de Férias), clãs de estudo (grupos colaborativos com progresso compartilhado), sistema de recompensas por conexão social e desafios entre amigos. | Média |
| 4 | **Escalabilidade** | Realizar testes de carga com 1.000+ usuários simultâneos utilizando JMeter ou k6. Implementar clustering de Redis, balanceamento de carga com Nginx e read replicas no MariaDB. Adotar containerização completa com Docker Swarm ou Kubernetes. | Alta |
| 5 | **Aplicativo Mobile** | Desenvolver app nativo para iOS e Android utilizando Capacitor (compartilhando código com o Web) ou Flutter (performance nativa). Funcionalidades offline-first com sincronização automática. | Média |
| 6 | **Modo Offline** | Implementar Service Workers para cache de conteúdos baixados (aulas, materiais, questões). Utilizar IndexedDB para armazenamento local de progresso. Sincronização automática ao reconectar. | Média |
| 7 | **Internacionalização** | Adicionar suporte a múltiplos idiomas (português, inglês, espanhol) com i18next. Traduzir interface, conteúdos e notificações. Adaptar formatos de data, moeda e números. | Baixa |
| 8 | **macOS** | Estender o aplicativo desktop para macOS, respeitando diretrizes de design da Apple. Testar em versões recentes do sistema operacional. Publicar na App Store. | Baixa |
| 9 | **Websocket/Real-time** | Implementar WebSocket para chat ao vivo de baixa latência, atualização instantânea de rankings e notificações push em tempo real. Considerar Socket.io ou ws. | Média |
| 10 | **Acessibilidade** | Garantir conformidade com WCAG 2.1 nível AA. Implementar navegação por teclado, leitores de tela, contraste adequado e textos alternativos. Utilizar Radix UI como base acessível. | Alta |

---

<div style="page-break-after: always;"></div>

# REFERÊNCIAS

BRASIL. Comitê Gestor da Internet no Brasil. **Pesquisa sobre o uso da internet no Brasil: COVID-19**. CGI.BR, São Paulo, 2020. Disponível em: https://cetic.br/pesquisa-individual/pt-BR/covid-19/. Acesso em: 15 jul. 2026.

CHOU, Yu-kai. **Actionable Gamification: Beyond Points, Badges, and Leaderboards**. Octalysis Media, 2015. 395 p.

CRESWELL, John W. **Research Design: Qualitative, Quantitative, and Mixed Methods Approaches**. 4. ed. Thousand Oaks: SAGE Publications, 2014. 274 p.

DECI, Edward L.; RYAN, Richard M. **Intrinsic Motivation and Self-Determination in Human Behavior**. New York: Plenum Press, 1985. 370 p.

DETERDING, Sebastian K. et al. From game design elements to gamefulness: defining "gamification". In: **PROCEEDINGS OF THE 15TH INTERNATIONAL MINDTACKS CONFERENCE**. New York: ACM, 2011. p. 9-15.

FASTIFY. **Fastify Documentation**. 2024. Disponível em: https://www.fastify.io/docs/latest/. Acesso em: 15 jul. 2026.

JORDAN, Katie. Massive Open Online Course (MOOC) dropout rates: a systematic review. **Biochemistry and Molecular Biology Education**, v. 43, n. 3, p. 151-160, 2015.

LAKATOS, Eva Maria; MARCONI, Marina de Andrade. **Fundamentos de Metodologia Científica**. 8. ed. São Paulo: Atlas, 2017. 316 p.

MASLOW, Abraham Harold. A theory of human motivation. **Psychological Review**, v. 50, n. 4, p. 370-396, 1943.

MORAN, José Manuel. **Educação a Distância: Novas Tecnologias**. 2. ed. São Paulo: Paulus, 2018. 128 p.

MURPHY, Maria et al. The effectiveness of Khan Academy's practice exercises. **Computers & Education**, v. 126, p. 32-46, 2018.

NEXT.JS. **Next.js Documentation**. 2024. Disponível em: https://nextjs.org/docs. Acesso em: 15 jul. 2026.

PRISMA. **Prisma ORM Documentation**. 2024. Disponível em: https://www.prisma.io/docs. Acesso em: 15 jul. 2026.

SCHWABER, Ken; SUTHERLAND, Jeff. **The Scrum Guide**. 2020. Disponível em: https://scrumguides.org/. Acesso em: 15 jul. 2026.

UNESCO. **Global Education Monitoring Report: Inclusion and Education**. Paris: UNESCO, 2020. 368 p.

VON AHN, Luis. Duolingo's approach to learning. **Duolingo Blog**, 2020. Disponível em: https://blog.duolingo.com/how-duolingo-uses-ai/. Acesso em: 15 jul. 2026.

VYGOTSKY, Lev S. **Mind in Society**. Cambridge: Harvard University Press, 1978. 159 p.

---

<div style="page-break-after: always;"></div>

# ANEXOS

## Anexo A — Código-Fonte

| Repositório | Tecnologia | Rotas/Endpoints |
|:------------|:-----------|:----------------|
| [Hexavante/Web](https://github.com/Hexavante/Hexavante) | Next.js 16 | 20 rotas |
| [Hexavante/Desktop](https://github.com/Hexavante/Hexavante-Desktop) | Electron 33 | 40 rotas |
| [Hexavante-API](https://github.com/Hexavante/Hexavante-Api) | Fastify 5 | 15 módulos |

## Anexo B — Diagramas

### B.1 Arquitetura do Ecossistema

```mermaid
graph TD
    A[Web - Next.js 16] -->|HTTPS| D[API - Fastify 5]
    B[Desktop - Electron 33] -->|HTTPS| D
    C[Mobile Futuro] -->|HTTPS| D
    D -->|Prisma ORM| E[(MariaDB)]
    D -->|Better Auth| F[Autenticação]
    D -->|ioredis| G[(Redis)]
    D -->|Swagger| H[/docs]
    I[GitHub Actions] -->|CI/CD| J[Docker]
    J --> K[VPS DigitalOcean]
```

### B.2 Fluxo de Autenticação

```
Estudante → Frontend → API → Better Auth → MariaDB → Sessão JWT → Dashboard
```

### B.3 Fluxo de Simulado

```
Estudante → Iniciar → API cria Attempt → Questões → Responder → Submeter
→ Correção → XP + Moedas → Notificação → Feed Social
```

### B.4 Fluxo de Gamificação

```
Completar Aula → awardXp → Transação Atômica → Novo Nível?
→ Sim: Level Up + Notificação + Social Activity
→ conquistas sync → UI atualizada
```

## Anexo C — Manual do Usuário

1. **Cadastro:** `/register` → preencher dados → confirmar e-mail
2. **Simulados:** Menu → Simulados → selecionar → iniciar → responder → resultado
3. **Loja:** Menu → Loja → selecionar item → comprar → equipar
4. **Desktop:** Baixar instalador → instalar → login → usar

## Anexo D — Questionário de Usabilidade

**Pré-teste:** Faixa etária · Apps utilizados · Frequência de estudo · Familiaridade com plataformas

**Pós-teste:** Facilidade de uso · Compreensão da gamificação · O que gostou/não gostou · Pretensão de uso · Satisfação (1-5) · Recomendação · Funcionalidades desejadas

## Anexo E — Screenshots

[INSERIR CAPTURAS DE TELA]
- Login · Dashboard · Cursos · Simulados · Ranking · Loja · Comunidade · Mensagens · Certificados · Admin · Desktop · Swagger

---

<div align="center">

*Documento gerado em Agosto de 2026 · Versão 3.0.0*

</div>

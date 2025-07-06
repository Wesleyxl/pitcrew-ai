# 🏎️ PitCrew AI — Virtual Race Engineer for F1 Games (MVP)

**PitCrew AI** é um projeto open-source que simula um engenheiro de pista virtual inteligente para os jogos da série **F1** da Codemasters, como **F1 24** e **F1 23**.

O app captura dados de telemetria em tempo real via UDP, analisa métricas cruciais e emite alertas de voz automáticos para o piloto durante a corrida — como um engenheiro real faria.

---

## 📌 Objetivo do MVP (Versão Inicial)

1. Capturar pacotes UDP nativos do F1 24.
2. Processar pacotes de telemetria e status do carro:
   - **ERS (energia da bateria)**
   - **Temperaturas dos pneus**
   - **Combustível**
   - **DRS (sistema de asa móvel)**
   - **Eventos críticos** (colisões, penalidades, etc.)
3. Emitir alertas automáticos por voz (TTS) de forma educativa.
4. Projeto modular, com arquitetura escalável e limpa.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia                  | Função                                          |
| --------------------------- | ----------------------------------------------- |
| **NestJS + TypeScript**     | Framework backend modular e escalável           |
| **f1-telemetry-client**     | Parser oficial para os pacotes UDP do F1 24     |
| **say.js**                  | Text-to-Speech para alertas de voz locais       |
| **dotenv + @nestjs/config** | Gerenciamento de variáveis de ambiente          |
| **chalk**                   | Logs coloridos no terminal para facilitar debug |

---

## 📦 Arquitetura do Projeto (Clean Architecture)

pitcrew-ai/
│
├── src/
│ ├── telemetry/ # Lógica de telemetria UDP
│ │ ├── telemetry.module.ts
│ │ ├── udp.service.ts # Listener UDP + roteamento de pacotes
│ │ ├── parsers/ # Parsers para cada tipo de pacote UDP
│ │ │ ├── telemetry.parser.ts
│ │ │ ├── status.parser.ts
│ │ │ └── event.parser.ts
│ │ └── alerts/ # Regras e alertas automáticos
│ │ ├── ers.alert.ts
│ │ ├── tyre.alert.ts
│ │ ├── drs.alert.ts
│ │ └── fuel.alert.ts
│ │
│ ├── common/ # Utilitários gerais
│ │ ├── tts.util.ts # Função de voz (Text-to-Speech)
│ │ └── logger.util.ts # Logs formatados e coloridos
│ │
│ ├── app.module.ts
│ └── main.ts # Bootstrap principal do NestJS
│
├── .env.example # Configurações de ambiente (IP e Porta UDP)
├── README.md # Documentação inicial
└── package.json

## 🧠 Pacotes UDP Processados no MVP

| Pacote        | ID  | Função                                                     |
| ------------- | --- | ---------------------------------------------------------- |
| Car Telemetry | 6   | Dados de velocidade, DRS, temperatura de pneus, aceleração |
| Car Status    | 7   | ERS, combustível, assistências, modos de pilotagem         |
| Car Damage    | 10  | Desgaste e danos nos pneus e partes do carro               |
| Event         | 3   | Eventos críticos como colisões, penalidades e DRS ativado  |
| Lap Data      | 2   | Dados de voltas, pit stops, posição e tempo de volta       |

---

## 🎯 Principais Alertas Automáticos

- **ERS (m_ersStoreEnergy)** → Alerta para gerenciamento da bateria
- **Temperatura dos Pneus (m_tyresSurfaceTemperature)** → Alerta de superaquecimento
- **Combustível (m_fuelInTank, m_fuelRemainingLaps)** → Alerta de baixo combustível
- **DRS (m_drs, m_drsAllowed, m_drsActivationDistance)** → Alerta de ativação de DRS
- **Eventos Críticos (eventos como DRSE, COLL, PENA, etc.)** → Alerta instantâneo

---

## ✅ MVP — Foco Inicial

- Captura UDP
- Alertas automáticos de ERS, pneus, combustível, DRS e eventos
- Logs no terminal + Voz (TTS)
- 100% offline (sem interface gráfica por enquanto)

---

## 🔥 Roadmap Futuro (Pós-MVP)

| Fase | Funcionalidade                                |
| ---- | --------------------------------------------- |
| 2    | Painel Web ou App Mobile (monitoramento live) |
| 3    | Comandos de voz para consulta do status       |
| 4    | Banco de dados para histórico de sessões      |
| 5    | IA para recomendações e análises preditivas   |

---

## ⚙️ Variáveis de Ambiente (.env)

```env
UDP_IP=192.168.1.10
UDP_PORT=20777



---

Se quiser, posso:
- Gerar o arquivo `README.md` completo no seu projeto;
- Adaptar o texto (mais técnico, casual, ou comercial);
- Traduzir para inglês ou deixar bilíngue.

Quer que eu já gere esse arquivo pronto para você colar no repositório?
```

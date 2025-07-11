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

## 📦 UDP Packet IDs & Módulos

No protocolo UDP do F1 23/24/25, cada _Packet ID_ corresponde a um tipo de dado.
Abaixo está a lista dos principais IDs, uma breve descrição de cada um

| ID  | Nome                 | Descrição                                                                                             | Módulo Sugerido                  | Arquivo de Parser          |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------- |
| 0   | Motion               | Posição, velocidade e vetores de força G para todos os carros.                                        | `telemetry/motion`               | `motion.parser.ts`         |
| 1   | Session              | Estado da sessão: clima, tempo restante, setores, zona de box, regras, forecast de tempo.             | `telemetry/session`              | `session.parser.ts`        |
| 2   | Lap Data             | Tempos de volta e deltas: última volta, volta atual, distância, posição, status de piloto.            | `telemetry/lap`                  | `lap.parser.ts`            |
| 3   | Event                | Eventos disparados (fastest lap, DRS on/off, safety car, flashback, overtakes, colisões etc.)         | `telemetry/event`                | `event.parser.ts`          |
| 4   | Participants         | Lista de pilotos/carros na sessão, controle AI/humano, nome, equipe, telemetry pública/restrita.      | `telemetry/participants`         | `participants.parser.ts`   |
| 5   | Car Setups           | Ajustes de carro: asa dianteira/traseira, suspensão, cambagem, pressão de pneus, carga de combustível | `telemetry/car-setup`            | `setup.parser.ts`          |
| 6   | Car Telemetry        | Telemetria em tempo real: aceleração, freio, embreagem, marcha, RPM, DRS, temperatura e pressão.      | `telemetry/telemetry`            | `telemetry.parser.ts`      |
| 7   | Car Status           | Estado do carro: fuel mix, ERS, DRS allow, life do combustível, condições de falha/entrada de pit.    | `telemetry/car-status`           | `status.parser.ts`         |
| 8   | Final Classification | Classificação final ao fim da corrida: posição, pontos, tempo total, melhores voltas e penalidades.   | `telemetry/final-classification` | `classification.parser.ts` |
| 9   | Lobby Info           | Info de lobby multiplayer: jogadores, status de ready, AI, plataforma, número do carro.               | `telemetry/lobby`                | `lobby.parser.ts`          |
| 10  | Car Damage           | Nível de desgaste e dano: pneus, asas, freios, motor, ERS, gearbox.                                   | `telemetry/car-damage`           | `damage.parser.ts`         |
| 11  | Session History      | Histórico de voltas e stint de pneus para cada carro ao longo da sessão.                              | `telemetry/session-history`      | `history.parser.ts`        |
| 12  | Tyre Sets            | Detalhes de cada conjunto de pneus: desgaste, vida útil, disponível, recomendado.                     | `telemetry/tyre-sets`            | `tyres.parser.ts`          |
| 13  | Motion Ex            | Dados estendidos de motion (suspensão, velocidade das rodas, forças nos pneus, chassis yaw etc.)      | `telemetry/motion-ex`            | `motion-ex.parser.ts`      |
| 14  | Time Trial           | Dados específicos de Time Trial: melhores tempos, personal best, rival, configurações de assist.      | `telemetry/time-trial`           | `time-trial.parser.ts`     |

---

## 📦 Arquitetura do Projeto (Clean Architecture)

```plaintext
src/
├─ core/
│   ├ udp.service.ts            # socket UDP e raw$
│   └ core.module.ts
│
├─ simulators/
│   ├─ f1-24/
│   │   ├ f1-24.module.ts       # importa Adapter, Services, Gateways, Rules
│   │   │
│   │   ├ adapter/
│   │   │   ├ f1-24.adapter.ts  # implements SimulatorAdapter
│   │   │   └ parser-factory.ts # mapeia packetId → parser
│   │   │
│   │   ├ parsers/              # todos os lap.parse.ts, event.parse.ts…
│   │   │
│   │   ├ services/
│   │   │   ├ f1-telemetry.service.ts  # filtra raw$, chama adapter.parse
│   │   │   ├ lap.service.ts            # só para F1-24
│   │   │   ├ rule-engine.service.ts    # regras específicas (DRS, overheat…)
│   │   │   └ alert.service.ts          # alertas/TTS de F1
│   │   │
│   │   ├ gateways/
│   │   │   ├ telemetry.gateway.ts      # ws /telemetry/f1
│   │   │   └ alerts.gateway.ts         # ws /alerts/f1
│   │   │
│   │   └ rules/                        # config YAML/JSON e definições RxJS
│   │
│   └─ automobilista2/  (mesmo padrão)
│
├─ app.module.ts                # importa CoreModule + todos os simulator modules
└─ main.ts
```

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

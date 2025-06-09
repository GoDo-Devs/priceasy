"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "services",
      [
        { name: "Roubo e Furto qualificado", category_id: 1 },
        { name: "Incêndio", category_id: 1 },
        { name: "Perda Total", category_id: 1 },
        { name: "Colisão - Parcial e Total", category_id: 1 },
        {
          name: "Fenômenos da natureza (Raio e suas consequências, chuva de granizo, queda de árvores oriundos de vendavais)",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos em veículos causados pelo associado de até R$3.000,00",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos em veículos causados pelo associado de até R$5.000,00",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos causados pelo associado em objetos e/ou por animais e buracos de até R$5.000,00",
          category_id: 1,
        },
        { name: "Motorista AMIGO - 1 por ano", category_id: 1 },
        { name: "Motorista AMIGO - 2 por ano", category_id: 1 },
        { name: "Motorista AMIGO - 3 por ano", category_id: 1 },
        { name: "Funeral Individual - 3.000,00", category_id: 1 },
        { name: "Funeral Familiar - 5.000,00", category_id: 1 },
        { name: "Carro Reserva - 07 dias", category_id: 1 },
        { name: "Carro Reserva - 15 dias", category_id: 1 },
        { name: "Carro Reserva - 30 dias", category_id: 1 },
        { name: "Carro Reserva - 120 dias", category_id: 1 },
        { name: "Vidros - para-brisa | 50%-50%", category_id: 1 },
        { name: "Vidros - para-brisa e laterais | 50%-50%", category_id: 1 },
        {
          name: "Vidros - para-brisas, frontal e traseiro, laterais, faróis, lanternas e lentes dos espelhos retrovisores | 50%-50%",
          category_id: 1,
        },
        {
          name: "Vidros - para-brisas, frontal e traseiro, laterais, faróis, lanternas e lentes dos espelhos retrovisores | 30%-70%",
          category_id: 1,
        },
        { name: "Atendimento VIP", category_id: 1 },
        { name: "Apoio Revisão Preventiva", category_id: 1 },
        {
          name: "Auxílio financeiro R$30,00/dia em caso de colisão até 30 dias",
          category_id: 1,
        },
        {
          name: "Auxílio financeiro R$80,00/dia em caso de colisão até 30 dias",
          category_id: 1,
        },
        {
          name: "Pacote Adimplência (Assistência para colisão ilimitado, para-brisa frontal(30/70))",
          category_id: 1,
        },
        {
          name: "Auxílio Destombamentos (1 Destombamento Completo Ao Ano + 1 Destombamento 2.500,00 Ao Ano)",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos causados pelo associado em objetos e/ou por animais e buracos de até R$4.000,00",
          category_id: 1,
        },
        {
          name: "Auxílio financeiro R$120,00/dia em caso de colisão até 30 dias",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos em veículos causados pelo associado de até R$20.000,00",
          category_id: 1,
        },
        { name: "Carro Reserva para Terceiro - 7 dias", category_id: 1 },
        {
          name: "Proteção estendida para danos em veículos causados pelo associado de até R$10.000,00",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos em veículos causados pelo associado de até R$75.000,00",
          category_id: 1,
        },
        {
          name: "Proteção estendida para danos em veículos causados pelo associado de até R$100.000,00",
          category_id: 1,
        },
        {
          name: "Reboque panes - 200 km (100 ida - 100 volta)",
          category_id: 2,
        },
        {
          name: "Reboque panes e colisão - 600 km (300 ida - 300 volta)",
          category_id: 2,
        },
        {
          name: "Reboque panes e colisão - 400 km (200 ida - 200 volta)",
          category_id: 2,
        },
        {
          name: "Reboque panes - 300 km (150 ida - 150 volta)",
          category_id: 2,
        },
        {
          name: "Reboque panes - 400 km (200 ida - 200 volta)",
          category_id: 2,
        },
        {
          name: "Reboque panes - 600 km (300 ida - 300 volta)",
          category_id: 2,
        },
        {
          name: "Reboque panes - 1000 km (500 ida - 500 volta)",
          category_id: 2,
        },
        { name: "Reboque colisão - ilimitado", category_id: 2 },
        { name: "Hospedagem em Hotel", category_id: 2 },
        { name: "Substituição de Pneu Furado", category_id: 2 },
        { name: "Táxi/App de Mobilidade", category_id: 2 },
        { name: "Meio de Transporte Alternativo – MTA", category_id: 2 },
        { name: "Recarga de Bateria", category_id: 2 },
        { name: "Chaveiro", category_id: 2 },
        { name: "Transporte para retirada do veículo", category_id: 2 },
        { name: "Reboque em caso de pneu furado", category_id: 2 },
        { name: "Reboque em caso de falta de combustível", category_id: 2 },
        {
          name: "Recuperação veículo em caso de Furto e Roubo",
          category_id: 2,
        },
        { name: "Assistência Residencial", category_id: 2 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "services",
      {
        category_id: [1, 2],
      },
      {}
    );
  },
};

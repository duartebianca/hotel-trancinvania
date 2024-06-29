import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../src/app'; 
import { prismaMock } from '../../setupTests'; 
import { Hotelier } from '../../src/controllers/hotelier.controller';
import { HttpConflictError } from '../../src/utils/errors/http.error';

const feature = loadFeature('tests/features/hotelier.feature');

const mockHotelierData = {
  id: 1,
  name: 'Mavis',
  email: 'mavis.dracula@gmail.com',
  username: 'mavis',
  password: '@Vampiresca1',
  cnpj: '12.215.333/0001-33',
  adress: 'Rua das Sextas, 13',
  hotel: 'Hotel Transilvânia',
};

defineFeature(feature, (test) => {
  let response: request.Response;
  let payload: Hotelier;

  beforeEach(() => {
      jest.clearAllMocks();
  });

  test('Cadastro Bem-Sucedido de Usuário Hoteleiro', ({ given, when, then }) => {
      given('que eu sou um novo usuário', () => {
          prismaMock.hotelier.create.mockResolvedValue(mockHotelierData);
      });

      when(
          /^eu envio uma solicitação de cadastro com o nome "(.*)", email "(.*)", username "(.*)", cnpj "(.*)", adress "(.*)", hotel "(.*)" e password "(.*)"$/,
          async (name, email, username, cnpj, adress, hotel, password) => {
              payload = { name, email, username, cnpj, adress, hotel, password } as Hotelier;
              response = await request(app).post('/hotelier/create').send(payload);
          },
      );

      then('o cadastro deve ser realizado com sucesso', () => {
          expect(response.status).toBe(201);
      });

      then('eu devo receber uma mensagem de confirmação:', (expectedResponse) => {
        //   const expected = JSON.parse(expectedResponse);
          expect(response.body.user).toMatchObject({
              id: mockHotelierData.id,
              name: payload.name,
              email: payload.email,
              username: payload.username,
              cnpj: payload.cnpj,
              adress: payload.adress,
              hotel: payload.hotel,
              password: mockHotelierData.password
          });
          expect(response.body.user.id).toBeDefined();
      });
  });

  test('Cadastro Mal-Sucedido de Usuário Hoteleiro por E-mail já Cadastrado', ({
      given,
      when,
      then,
  }) => {
      given('que o email "mavis.dracula@gmail.com" já está cadastrado', () => {
          prismaMock.hotelier.findUniqueOrThrow.mockImplementation(() => {
              throw new HttpConflictError({ msg: 'E-mail ou nome de usuário já existe.' });
          });
      });

      when(
          /^eu envio uma solicitação de cadastro com o nome "(.*)", email "(.*)", username "(.*)", cnpj "(.*)", adress "(.*)", hotel "(.*)" e password "(.*)"$/,
          async (name, email, username, cnpj, adress, hotel, password) => {
              payload = { name, email, username, cnpj, adress, hotel, password } as Hotelier;
              response = await request(app).post('/hotelier/create').send(payload);
          },
      );

      then('o cadastro não deve ser realizado', () => {
          expect(response.status).toBe(409); // Conflict status
      });

      then('eu devo receber uma mensagem de erro indicando que o e-mail já está em uso:', (expectedResponse) => {
          const expected = JSON.parse(expectedResponse);
          expect(response.body.msg).toBe(expected.error);
      });
  });

  test('Cadastro Mal-Sucedido de Usuário Hoteleiro por Usuário já Cadastrado', ({
      given,
      when,
      then,
  }) => {
      given('que o username "mavis" já está cadastrado', () => {
          prismaMock.hotelier.findUniqueOrThrow.mockImplementation(() => {
              throw new HttpConflictError({ msg: 'E-mail ou nome de usuário já existe.' });
          });
      });

      when(
          /^eu envio uma solicitação de cadastro com o nome "(.*)", email "(.*)", username "(.*)", cnpj "(.*)", adress "(.*)", hotel "(.*)" e password "(.*)"$/,
          async (name, email, username, cnpj, adress, hotel, password) => {
              payload = { name, email, username, cnpj, adress, hotel, password } as Hotelier;
              response = await request(app).post('/hotelier/create').send(payload);
          },
      );

      then('o cadastro não deve ser realizado', () => {
          expect(response.status).toBe(409); // Conflict status
      });

      then('eu devo receber uma mensagem de erro indicando que o nome de usuário já está em uso:', (expectedResponse) => {
          const expected = JSON.parse(expectedResponse);
          expect(response.body.msg).toBe(expected.error);
      });
  });

  test('Cadastro Mal-Sucedido de Usuário Hoteleiro por Senha Inválida', ({ given, when, then }) => {
      given('que eu sou um novo usuário', () => {
          // Não é necessário mockar o serviço neste caso, pois a validação falha antes de chamar o serviço
      });

      when(
          /^eu envio uma solicitação de cadastro com o nome "(.*)", email "(.*)", username "(.*)", cnpj "(.*)", adress "(.*)", hotel "(.*)" e password "(.*)"$/,
          async (name, email, username, cnpj, adress, hotel, password) => {
              payload = { name, email, username, cnpj, adress, hotel, password } as Hotelier;
              response = await request(app).post('/hotelier/create').send(payload);
          },
      );

      then('o cadastro não deve ser realizado', () => {
          expect(response.status).toBe(400);
      });

      then('eu devo receber uma mensagem de erro indicando que a senha é inválida:', (expectedResponse) => {
          const expected = JSON.parse(expectedResponse);
          expect(response.body.message[0]).toBe(expected.error);
      });
  });
});
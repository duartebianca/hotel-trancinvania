import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../src/app';
import { HttpUnauthorizedError, HttpNotFoundError } from '../../src/utils/errors/http.error';
import prisma from '../../src/database'

const feature = loadFeature('tests/features/login.feature');

const mockClientData = {
  name: 'Bárbara Alencar',
  email: 'barbara.alencar@gmail.com',
  username: 'barbaralencar',
  password: '@AmoBolo123',
  cpf: '021.957.235-12',
  phone: '(81) 99342-3591',
  birthDate: '1984/09/12',
};

const mockToken = '#is_placeholder';

defineFeature(feature, (test) => {
  let response: request.Response;
  let payload: { username: string; password: string };

  beforeEach(async () => {
    await prisma.user.deleteMany(); // Clear the database before each test
    await prisma.user.create({ data: mockClientData }); // Add mock data
  });

  test('Login Bem-Sucedido', ({ given, when, then }) => {
    given(/^Eu estou cadastrado no Sistema com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
    //   await prisma.client.create({
    //     data: mockClientData
    //   })
    });

    when(/^eu envio uma solicitação de login com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
      payload = { username, password };
      response = await request(app).post('/auth/client/login').send(payload);
    });

    then('eu devo receber uma mensagem de confirmação com o token:', (expectedResponse) => {
      const expected = JSON.parse(expectedResponse);
      expect(response.status).toBe(200);
      expect(response.body.token).toBe(expected.token);
    });
  });

  test('Login Mal-Sucedido por Senha Incorreta', ({ given, when, then }) => {
    given(/^Eu estou cadastrado no Sistema com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
        // await prisma.client.create({
        //     data: mockClientData
        //   })
    });

    when(/^eu envio uma solicitação de login com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
      payload = { username, password };
      response = await request(app).post('/auth/client/login').send(payload);
    });

    then('eu devo receber uma mensagem de erro:', (expectedResponse) => {
      const expected = JSON.parse(expectedResponse);
      expect(response.status).toBe(401); // Unauthorized for incorrect password
      expect(response.body.message).toBe(expected.message);
    });
  });

  test('Login Mal-Sucedido por Usuário não-cadastrado', ({ given, when, then }) => {
    given(/^Não há “username” “(.*)” cadastrado no sistema$/, async (username) => {
      await prisma.user.deleteMany(); // Ensure no user is in the database
    });

    when(/^eu envio uma solicitação de login com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
      payload = { username, password };
      response = await request(app).post('/auth/client/login').send(payload);
    });

    then('eu devo receber uma mensagem de erro:', (expectedResponse) => {
      const expected = JSON.parse(expectedResponse);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(expected.message);
    });
  });

  test('Login Mal-Sucedido por Senha em Branco', ({ given, when, then }) => {
    given(/^Eu estou cadastrado no Sistema com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
        // await prisma.client.create({
        //     data: mockClientData
        //   })
    });

    when(/^eu envio uma solicitação de login com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
      payload = { username, password };
      response = await request(app).post('/auth/client/login').send(payload);
    });

    then('eu devo receber uma mensagem de erro:', (expectedResponse) => {
      const expected = JSON.parse(expectedResponse);
      expect(response.status).toBe(400); // Should be 400 for missing credentials
      expect(response.body.message).toBe(expected.message);
    });
  });

  test('Login Mal-Sucedido por Nome de Usuário em Branco', ({ given, when, then }) => {
    given(/^Eu estou cadastrado no Sistema com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
    // await prisma.client.create({
    //     data: mockClientData
    //     })
    });

    when(/^eu envio uma solicitação de login com o "username" "(.*)" e a "password" "(.*)"$/, async (username, password) => {
      payload = { username, password };
      response = await request(app).post('/auth/client/login').send(payload);
    });

    then('eu devo receber uma mensagem de erro:', (expectedResponse) => {
      const expected = JSON.parse(expectedResponse);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(expected.message);
    });
  });
});

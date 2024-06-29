import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../src/app';
import { prismaMock } from '../../setupTests';
import { Customer } from '../../src/controllers/client.controller';

const feature = loadFeature('tests/features/client.feature');

const mockClientData = {
    id: 1,
    name: 'Bárbara Alencar',
    email: 'barbara.alencar@gmail.com',
    username: 'barbaralencar',
    password: '@AmoBolo123',
    cpf: '021.957.235-12',
    phone: '(81) 99342-3591',
    birthDate: '1984/09/12',
};

defineFeature(feature, (test) => {
    let response: request.Response;
    let payload: Customer;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Cadastro Bem-Sucedido de Usuário Cliente', ({ given, when, then, and }) => {
        given('que eu sou um novo usuário', () => {
            prismaMock.client.create.mockResolvedValue(mockClientData);
        });

        when(
            /^eu envio uma requisição POST para '\/client\/create' com o name "(.*)", email "(.*)", username "(.*)", cpf "(.*)", phone "(.*)", birthDate "(.*)" e password "(.*)"$/,
            async (name, email, username, cpf, phone, birthDate, password) => {
                payload = { name, email, username, cpf, phone, birthDate, password } as Customer;
                response = await request(app).post('/client/create').send(payload);
                console.log('response body', response.body);
            }
        );

        then('o cadastro deve ser realizado com sucesso', () => {
            expect(response.status).toBe(201);
        });

        and(/^o status da resposta deve ser "(.*)"$/, (statusCode) => {
            expect(response.status).toBe(parseInt(statusCode, 10));
        });

        and('eu devo receber uma mensagem de confirmação:', (expectedResponse) => {
            const expected = JSON.parse(expectedResponse);
            expect(response.body).toMatchObject({
                message: "Cadastro realizado com sucesso",
                user: {
                    name: payload.name,
                    email: payload.email,
                    username: payload.username,
                    cpf: payload.cpf,
                    phone: payload.phone,
                    birthDate: payload.birthDate,
                    id: expect.any(Number),
                },
            });
        });
    });

    test('Cadastro Mal-Sucedido de Usuário Cliente por E-mail já Cadastrado', ({ given, when, then }) => {
        given('que o e-mail "barbara.alencar@gmail.com" já está cadastrado', () => {
            prismaMock.client.create.mockResolvedValueOnce(mockClientData);
            prismaMock.client.findUnique.mockResolvedValueOnce(mockClientData)
        });

        when(
            /^eu envio uma requisição POST para '\/client\/create' com o name "(.*)", email "(.*)", username "(.*)", cpf "(.*)", phone "(.*)", birthDate "(.*)" e password "(.*)"$/,
            async (name, email, username, cpf, phone, birthDate, password) => {
                payload = { name, email, username, cpf, phone, birthDate, password } as Customer;
                response = await request(app).post('/client/create').send(payload);
            }
        );

        then('o cadastro não deve ser realizado', () => {
            expect(response.status).toBe(409);
        });

        then(
            'eu devo receber uma mensagem de erro indicando que o e-mail já está em uso:',
            (expectedResponse) => {
                const expected = JSON.parse(expectedResponse);
                expect(response.body.error).toBe(expected.error);
            }
        );
    });

    test('Cadastro Mal-Sucedido de Usuário Cliente por Usuário já Cadastrado', ({ given, when, then }) => {
        given('que o name de usuário "barbaralencar" já está cadastrado', () => {
            prismaMock.client.findUnique.mockResolvedValueOnce(mockClientData);
        });

        when(
            /^eu envio uma solicitação de cadastro com o name "(.*)", email "(.*)", username "(.*)", cpf "(.*)", phone "(.*)", birthDate "(.*)" e password "(.*)"$/,
            async (name, email, username, cpf, phone, birthDate, password) => {
                payload = { name, email, username, cpf, phone, birthDate, password } as Customer;
                response = await request(app).post('/client/create').send(payload);
            }
        );

        then('o cadastro não deve ser realizado', () => {
            expect(response.status).toBe(409);
        });

        then(
            'eu devo receber uma mensagem de erro indicando que o name de usuário já está em uso:',
            (expectedResponse) => {
                const expected = JSON.parse(expectedResponse);
                expect(response.body.error).toBe(expected.error);
            }
        );
    });

    test('Cadastro Mal-Sucedido de Usuário Cliente por Senha Inválida', ({ given, when, then }) => {
        given('que eu sou um novo usuário', () => {
            // No setup needed for this step
        });

        when(
            /^eu envio uma requisição POST para '\/client\/create' com o name "(.*)", email "(.*)", username "(.*)", cpf "(.*)", phone "(.*)", birthDate "(.*)" e password "(.*)"$/,
            async (name, email, username, cpf, phone, birthDate, password) => {
                payload = { name, email, username, cpf, phone, birthDate, password } as Customer;
                response = await request(app).post('/client/create').send(payload);
            }
        );

        then('o cadastro não deve ser realizado', () => {
            expect(response.status).toBe(400);
        });

        then(
            'eu devo receber uma mensagem de erro indicando que a senha é inválida:',
            (expectedResponse) => {
                const expected = JSON.parse(expectedResponse);
                expect(response.body.error).toBe(expected.error);
            }
        );
    });
});

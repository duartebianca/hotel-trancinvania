import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../src/app'; 
import { prismaMock } from '../../setupTests';
import { Customer } from '../../src/controllers/client.controller';
import { Hotelier } from '../../src/controllers/hotelier.controller';

const feature = loadFeature('tests/features/update-login.feature');

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

const mockHotelierData = {
    id: 2,
    name: 'Mavis',
    email: 'mavis.dracula@gmail.com',
    username: 'mavis',
    password: '@Vampiresca1',
    hotel: 'Hotel Transilvânia',
    adress: 'Rua das Sextas, 13',
    cnpj: '12.215.333/0001-33',
};

defineFeature(feature, (test) => {
    let response: request.Response;
    let payload: Customer | Hotelier;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Obtenção de Token para Recuperação de Senha Bem-Sucedida', ({ given, when, then }) => {
        given('Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"', () => {
            prismaMock.client.findUnique.mockResolvedValue(mockClientData);
        });

        when('Eu envio uma solicitação de recuperação de senha com o "email" "barbara.alencar@gmail.com"', async () => {
            response = await request(app).post('/client/recover-password').send({ email: 'barbara.alencar@gmail.com' });
        });

        then('eu devo receber uma mensagem de confirmação "Password reset email sent"', () => {
            expect(response.body.message).toBe('Password reset email sent');
        });

        then('o status da resposta deve ser "200"', () => {
            expect(response.status).toBe(200);
        });
    });

    test('Redefinição de Senha Bem-Sucedida', ({ given, when, then }) => {
        given('Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"', () => {
            prismaMock.client.findUnique.mockResolvedValue(mockClientData);
        });

        when('Eu envio uma solicitação de redefinição de senha com o "token" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzE4NjAzNjU1LCJleHAiOjE3MTg2MDcyNTV9.jSklDZsvHee3TtPzE_WjKrjioOoZ36_24E_ury2EYco"', async () => {
            response = await request(app).post('/client/reset-password').send({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzE4NjAzNjU1LCJleHAiOjE3MTg2MDcyNTV9.jSklDZsvHee3TtPzE_WjKrjioOoZ36_24E_ury2EYco', password: '@NewPassword123' });
        });

        then('eu devo receber uma mensagem de confirmação "Password has been reset"', () => {
            expect(response.body.message).toBe('Password has been reset');
        });

        then('o status da resposta deve ser "200"', () => {
            expect(response.status).toBe(200);
        });
    });

    test('Atualização do Login, E-mail e Senha Bem-Sucedida por usuário Cliente', ({ given, when, then }) => {
        given('Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"', () => {
            prismaMock.client.findUnique.mockResolvedValue(mockClientData);
        });

        given('Eu estou logado no Sistema com o "username" "barbaralencar" e o "password" "@AmoBolo123"', async () => {
            response = await request(app).post('/client/login').send({ username: 'barbaralencar', password: '@AmoBolo123' });
        });

        when('Eu envio uma requisição PATCH para \'auth/client/update/:id\' com o "username" "barbara", o "email" "barbara@gmail.com" e o "password" "@AmoB123"', async () => {
            payload = { username: 'barbara', email: 'barbara@gmail.com', password: '@AmoB123' };
            response = await request(app).patch(`/client/update/${mockClientData.id}`).send(payload);
        });

        then('eu devo receber uma mensagem de confirmação:', (expectedResponse) => {
            const expected = JSON.parse(expectedResponse);
            expect(response.body.user).toMatchObject({
                id: mockClientData.id,
                name: mockClientData.name,
                email: payload.email,
                username: payload.username,
                cpf: mockClientData.cpf,
                phone: mockClientData.phone,
                birthDate: mockClientData.birthDate,
                password: expect.any(String)
            });
            expect(response.status).toBe(200);
        });
    });

    test('Atualização do Login, E-mail e Senha Bem-Sucedida por usuário Hoteleiro', ({ given, when, then }) => {
        given('Eu estou cadastrado no Sistema com o "username" "mavis", o "email" "mavis.dracula@gmail.com" e o "password" "@Vampiresca1"', () => {
            prismaMock.hotelier.findUnique.mockResolvedValue(mockHotelierData);
        });

        given('Eu estou logado no Sistema com o "username" "barbaralencar" e o "password" "@AmoBolo123"', async () => {
            response = await request(app).post('/hotelier/login').send({ username: 'mavis', password: '@Vampiresca1' });
        });

        when('Eu envio uma requisição PATCH para \'auth/hotelier/update/:id\' com o "username" "barbara", o "email" "barbara@gmail.com" e o "password" "@AmoB123"', async () => {
            payload = { username: 'barbara', email: 'barbara@gmail.com', password: '@AmoB123' };
            response = await request(app).patch(`/hotelier/update/${mockHotelierData.id}`).send(payload);
        });

        then('eu devo receber uma mensagem de confirmação:', (expectedResponse) => {
            const expected = JSON.parse(expectedResponse);
            expect(response.body.user).toMatchObject({
                id: mockHotelierData.id,
                name: mockHotelierData.name,
                email: payload.email,
                username: payload.username,
                password: expect.any(String),
                hotel: mockHotelierData.hotel,
                adress: mockHotelierData.adress,
                cnpj: mockHotelierData.cnpj
            });
            expect(response.status).toBe(200);
        });
    });

    test('Exclusão de Cadastro de Usuário Cliente Bem-Sucedida', ({ given, when, then }) => {
        given('Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"', () => {
            prismaMock.client.findUnique.mockResolvedValue(mockClientData);
        });

        given('Eu estou logado no Sistema com o "username" "barbaralencar" e o "password" "@AmoBolo123"', async () => {
            response = await request(app).post('/client/login').send({ username: 'barbaralencar', password: '@AmoBolo123' });
        });

        when('Eu envio uma requisição DELETE para \'auth/client/delete/:id\'', async () => {
            response = await request(app).delete(`/client/delete/${mockClientData.id}`);
        });

        then('o status da resposta deve ser "204"', () => {
            expect(response.status).toBe(204);
        });
    });

    test('Exclusão de Cadastro de Usuário Hoteleiro Bem-Sucedida', ({ given, when, then }) => {
        given('Eu estou cadastrado no Sistema com o "username" "mavis", o "email" "mavis.dracula@gmail.com" e o "password" "@Vampiresca1"', () => {
            prismaMock.hotelier.findUnique.mockResolvedValue(mockHotelierData);
        });

        given('Eu estou logado no Sistema com o "username" "mavis", o "email" "mavis.dracula@gmail.com" e o "password" "@Vampiresca1"', async () => {
            response = await request(app).post('/hotelier/login').send({ username: 'mavis', password: '@Vampiresca1' });
        });

        when('Eu envio uma requisição DELETE para \'auth/hotelier/delete/:id\'', async () => {
            response = await request(app).delete(`/hotelier/delete/${mockHotelierData.id}`);
        });

        then('o status da resposta deve ser "204"', () => {
            expect(response.status).toBe(204);
        });
    });
});

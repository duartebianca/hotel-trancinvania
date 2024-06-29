Feature: Criar cadastro de clientes
As a Usuário "Hoteleiro"
I want to cadastrar-me na plataforma de reserva de hoteis “hotel trancinvânia”
So that eu possa realizar ações no sistema de acordo com meu tipo de usuário

  Scenario: Cadastro Bem-Sucedido de Usuário Hoteleiro
    Given que eu sou um novo usuário
    When eu envio uma solicitação de cadastro com o nome "Mavis", email "mavis.dracula@gmail.com", username "mavis", cnpj "12.215.333/0001-33", adress "Rua das Sextas, 13", hotel "Hotel Transilvânia" e password "@Vampiresca1"
    Then o cadastro deve ser realizado com sucesso
    And eu devo receber uma mensagem de confirmação:
    """
    {
      "message": "Cadastro realizado com sucesso",
      "user": {
        "id": #is_placeholder",
        "name": "Mavis",
        "email": "mavis.dracula@gmail.com",
        "username": "mavis",
        "password": "#is_placeholder",
        "hotel": "Hotel Transilvânia",
        "adress": "Rua das Sextas, 13",
        "cnpj": "12.215.333/0001-33"
      }
    }
    """

  Scenario: Cadastro Mal-Sucedido de Usuário Hoteleiro por E-mail já Cadastrado
    Given que o email "mavis.dracula@gmail.com" já está cadastrado
    When eu envio uma solicitação de cadastro com o nome "Mavis", email "mavis.dracula@gmail.com", username "mavis", cnpj "12.215.333/0001-33", adress "Rua das Sextas, 13", hotel "Hotel Transilvânia" e password "@Vampiresca1"
    Then o cadastro não deve ser realizado
    And eu devo receber uma mensagem de erro indicando que o e-mail já está em uso:
    """
    {
      "error": "E-mail ou nome de usuário já existe."
    }
    """

  Scenario: Cadastro Mal-Sucedido de Usuário Hoteleiro por Usuário já Cadastrado
    Given que o username "mavis" já está cadastrado
    When eu envio uma solicitação de cadastro com o nome "Mavis", email "mavis.dracula@gmail.com", username "mavis", cnpj "12.215.333/0001-33", adress "Rua das Sextas, 13", hotel "Hotel Transilvânia" e password "@Vampiresca1"
    Then o cadastro não deve ser realizado
    And eu devo receber uma mensagem de erro indicando que o nome de usuário já está em uso:
    """
    {
      "error": "E-mail ou nome de usuário já existe."
    }
    """

  Scenario: Cadastro Mal-Sucedido de Usuário Hoteleiro por Senha Inválida
    Given que eu sou um novo usuário
    When eu envio uma solicitação de cadastro com o nome "Mavis", email "mavis.dracula@gmail.com", username "mavis", cnpj "12.215.333/0001-33", adress "Rua das Sextas, 13", hotel "Hotel Transilvânia" e password "@Va"
    Then o cadastro não deve ser realizado
    And eu devo receber uma mensagem de erro indicando que a senha é inválida:
    """
    {
      "error": "A senha deve ter mais de 6 dígitos"
    }
    """

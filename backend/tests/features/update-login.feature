Feature: Atualizar Cadastro
  As a Usuário "Hoteleiro" ou "Cliente"
  I want to atualizar minhas informações de cadastro
  So that eu possa manter meus dados atualizados e garantir a segurança da minha conta

Scenario: Obtenção de Token para Recuperação de Senha Bem-Sucedida
  Given Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"
  When Eu envio uma solicitação de recuperação de senha com o "email" "barbara.alencar@gmail.com"
  Then eu devo receber uma mensagem de confirmação "Password reset email sent"
  And o status da resposta deve ser "200"
  And Eu recebo um email com um token para redefinição de senha

Scenario: Redefinição de Senha Bem-Sucedida
  Given Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"
  When Eu envio uma solicitação de redefinição de senha com o "token" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzE4NjAzNjU1LCJleHAiOjE3MTg2MDcyNTV9.jSklDZsvHee3TtPzE_WjKrjioOoZ36_24E_ury2EYco"
  Then eu devo receber uma mensagem de confirmação "Password has been reset"
  And o status da resposta deve ser "200"

Scenario: Atualização do Login, E-mail e Senha Bem-Sucedida por usuário Cliente
  Given Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"
  And Eu estou logado no Sistema com o "username" "barbaralencar" e o "password" "@AmoBolo123"
  When Eu envio uma requisição PATCH para 'auth/client/update/:id' com o "username" "barbara", o "email" "barbara@gmail.com" e o "password" "@AmoB123"
  Then eu devo receber uma mensagem de confirmação:
   """
    {
      "user": {
        "name": "Bárbara Alencar",
        "email": "barbara@gmail.com",
        "username": "barbara",
        "cpf": "021.957.235-12",
        "phone": "(81) 99342-3591",
        "birthDate": "1984/09/12",
        "id": "#is_placeholder",
        "password" "@AmoB123"
      }
    }
    """
    And o status da resposta deve ser "200"

  Scenario: Atualização do Login, E-mail e Senha Bem-Sucedida por usuário Hoteleiro
  Given Eu estou cadastrado no Sistema com o "username" "mavis", o "email" "mavis.dracula@gmail.com" e o "password" "@AmoBolo123"
  And Eu estou logado no Sistema com o "username" "barbaralencar" e o "password" "@AmoBolo123"
  When Eu envio uma requisição PATCH para 'auth/hotelier/update/:id' com o "username" "barbara", o "email" "barbara@gmail.com" e o "password" "@AmoB123"
  Then eu devo receber uma mensagem de confirmação:
   """
    {
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
    And o status da resposta deve ser "200"

  Scenario: Exclusão de Cadastro de Usuário Cliente Bem-Sucedida
    Given Eu estou cadastrado no Sistema com o "username" "barbaralencar", o "email" "barbara.alencar@gmail.com" e o "password" "@AmoBolo123"
    And Eu estou logado no Sistema com o "username" "barbaralencar" e o "password" "@AmoBolo123"
    When Eu envio uma requisição DELETE para 'auth/client/delete/:id'
    Then o status da resposta deve ser "204"
   Scenario: Exclusão de Cadastro de Usuário Hoteleiro Bem-Sucedida
    Given Eu estou cadastrado no Sistema com o "username" "mavis", o "email" "mavis.dracula@gmail.com" e o "password" "@Vampiresca1"
    And Eu estou logado no Sistema com o "username" "mavis", o "email" "mavis.dracula@gmail.com" e o "password" "@Vampiresca1"
    When Eu envio uma requisição DELETE para 'auth/hotelier/delete/:id'
    Then o status da resposta deve ser "204"

#Scenario: Falha na Atualização do Usuário por Senha em Branco
  #Given Eu estou na página “Meu Perfil”
  #And Eu estou logado no Sistema com o “E-mail”  “barbara.alencar@gmail.com”
  #And a “Senha” “@AmoBolo123”
  #When eu seleciono a opção “Editar minhas informações”
  #And preencho o campo “E-mail” com “julia.sabino@gmail.com”
  #And a senha “”
  #Then Eu recebo uma mensagem de erro “Operação não concluída devido a ausência de preenchimento de campos obrigatórios.
  #And continuo em “Meu Perfil”

#Scenario: Falha na Atualização do Usuário por E-mail em Branco
  #Given Eu estou na página “Meu Perfil”
 # And Eu estou logado no Sistema com o “E-mail”  “barbara.alencar@gmail.com”
  #And a “Senha” “@AmoBolo123”
  #When eu seleciono a opção “Editar minhas informações”
  #And preencho o campo “E-mail” com “”
  #And a senha  “@AmoBolo123”
  #Then Eu recebo uma mensagem de erro “Operação não concluída devido a ausência de preenchimento de campos obrigatórios”.
  #And continuo em “Meu Perfil”

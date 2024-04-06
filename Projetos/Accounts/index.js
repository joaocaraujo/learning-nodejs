import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair do sistema",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      switch (action) {
        case "Criar conta":
          createAccount();
          break;
        case "Depositar":
          // Código para depositar
          break;
        case "Consultar saldo":
          // Código para consultar saldo
          break;
        case "Sacar":
          // Código para sacar
          break;
        case "Sair do sistema":
          console.log(chalk.bgBlue.black("Obrigado por usar o Accounts, até mais!"));
          process.exit();
          break;
        default:
          // Código para ação desconhecida
          break;
      }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Essa conta já existe, escolha outro nome.")
        );
        buildAccount();
        return;
      }

      if (!accountName) {
        console.log(
          chalk.bgRed.black(
            "O nome da conta não pode estar vazio. Por favor, insira um nome válido."
          )
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Conta criada com sucesso!"));
      operation();
    })
    .catch((err) => console.log(err));
}

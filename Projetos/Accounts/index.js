import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

operation();

function errorMessage(message) {
  return chalk.bgRed.black(message);
}

function successMessage(message) {
  return chalk.green(message);
}

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
          deposit();
          break;
        case "Consultar saldo":
          getAccountBalance();
          break;
        case "Sacar":
          // Código para sacar
          break;
        case "Sair do sistema":
          console.log(
            chalk.bgBlue.black("Obrigado por usar o Accounts, até mais!")
          );
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
  console.log(successMessage("Defina as opções da sua conta a seguir"));
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
        console.log(errorMessage("Essa conta já existe, escolha outro nome."));
        buildAccount();
        return;
      }

      if (!accountName) {
        console.log(
          errorMessage(
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

      console.log(successMessage("Conta criada com sucesso!"));
      operation();
    })
    .catch((err) => console.log(err));
}

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da conta de destino: ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Digite o valor do depósito: ",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          addAmount(accountName, amount);

          operation();
        });
    });
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(errorMessage("Essa conta não existe."));
    return false;
  }

  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(errorMessage("O valor do depósito não pode ser vazio."));
    return deposit();
  }

  accountData.balance = parseFloat(accountData.balance) + parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(successMessage(`Depósito de R$${amount} realizado com sucesso!`));
}

function getAccount(accountName) {
  const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(accountJson);
}

function getAccountBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }

      const accountData = getAccount(accountName);

      console.log(chalk.bgBlue.black(`Seu saldo é R$${accountData.balance}`));
      operation();
    })
    .catch((err) => console.log(err));
}

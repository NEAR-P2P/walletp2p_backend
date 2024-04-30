import { Wallet } from "../entities/wallets.entity";
import GoogleAuthUtils from "../utils/google_auth.utils";
import walletUtils from "../utils/wallet.utils";
import emailUtils from "../utils/email.utils";
import encryp from "../utils/encryp";
import { configNear } from "../config/nearConfig";
// const myContractWasm  = require("../services/code/metadao_dao.wasm");

/*
let textEncryp = encryp.encryp("este texto se encryptara");
  console.log(textEncryp);
  let testDcryp = encryp.decryp(textEncryp);
  console.log(testDcryp);
*/
//funcion de delay
/* function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
} */

class WalletService {
  async sendCode(email: string) {
    const verifyEmail = await Wallet.findOne({ where: { email: email } });

    if (!verifyEmail) {
      throw new Error("El correo no esta registrado, debe crear una cuenta");
    }

    const result = await emailUtils.sendCode(email);

    return result;
  }

  async sendCodeVerifyEmail(email: string) {
    const verifyEmail = await Wallet.findOne({ where: { email: email } });

    if (verifyEmail) {
      throw new Error(
        "El correo proporcionado ya esta registrado, use un correo diferente"
      );
    }

    const result = await emailUtils.sendCode(email);

    return result;
  }

  async verifyCode(code: string, email: string) {
    const result = await emailUtils.verifyCode(code, email);

    return result;
  }

  async verifyGoogle(token: string) {
    let response: any;

    await GoogleAuthUtils.verifyAccesGoogle(token).then(async (result: any) => {
      if (!result.payload["email_verified"])
        throw new Error("Error eL email no esta verificado");

      response = await walletUtils.emailRegistered(result.payload["email"]);
    });

    return response;
  }

  async emailWalletImport(code: string, email: string) {
    await this.verifyCode(code, email);

    //const response = "funcion deprecada"

    const response = await walletUtils.emailRegistered(email);

    return response;
  }

  async emailCreateNickname(code: string, email: string, nickname: string) {
    try {
      await this.verifyCode(code, email);

      const wallet = await Wallet.findOneBy({ email: email });

      if (!wallet) {
        throw new Error("Email is not registered");
      } else {
        // const response = await walletUtils.createNickname(nickname, email, cedula);
        // await Wallet.update({email:email}, {seedPhrase: encryp.encryp(response.seedPhrase), nickname: true})
        // response.isExists = true;

        return {};
      }
    } catch (err: any) {
      throw new Error(err.toString());
    }
  }

  async createNickname(nickname: string, email: string, cedula: string) {
    const result = await walletUtils.createNickname(nickname, email, cedula);

    return result;
  }
}

async function pruebaDeploy() {
  console.log("entro");
  //const myContractWasm: any = require("./code/metadao_dao.wasm");

  const fs = require("fs");
  const myContractWasm = fs.readFileSync("metadao_dao.wasm", "utf8");
  const bs58 = require("bs58");
  const crypto = require("crypto");

  function wasmToBase58Hash(filePath: any) {
    // Read the WASM file as a Buffer
    const wasmBuffer = fs.readFileSync(filePath, "utf8");

    // Create a SHA-256 hash of the WASM file
    const hash = crypto.createHash("sha256").update(wasmBuffer).digest();

    // Convert the hash to Base58
    const base58Hash = bs58.encode(hash);

    return base58Hash;
  }

  const base58Hash = wasmToBase58Hash("metadao_dao.wasm");
  console.log(base58Hash);

  const privateKey =
    "ed25519:TAbyTLkbGbjr1Y6oKpT1SMnTV2nd83BxSNofdVTd51w9Brn8wGy4JMDePFAPeXHydpsams5AtaTao4898YvaqQa";
  const address = "factoryv4.metademocracia.testnet";

  console.log("paso 1: ");
  const nearAPI = require("near-api-js");
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  const keyPairNew = nearAPI.KeyPair.fromString(privateKey);
  await keyStore.setKey(process.env.Network, address, keyPairNew);
  const near = await nearAPI.connect(configNear(keyStore));
  const account = await near.account(address);
  console.log("paso 2");

  /* const response = await account.functionCall({
    contractId: "factoryv4.metademocracia.testnet",
    methodName: "update",
    args: {
      account_id: "pruebas.factoryv4.metademocracia.testnet",
      code_hash: base58Hash,
    },
    gas: "300000000000000",
    attachedDeposit: undefined,
  }); */

  const response = await account.functionCall({
    contractId: "factoryv4.metademocracia.testnet",
    methodName: "remove_contract_self", // "set_default_code_hash" "get_code",
    args: {
      code_hash: "8JmQmJcCVW2tqVRXA5NXHzhjoT6xrb3V5d3kRsV2pn8e",
      // "8JmQmJcCVW2tqVRXA5NXHzhjoT6xrb3V5d3kRsV2pn8e"
    },
    gas: "300000000000000",
    attachedDeposit: undefined,
  });

  console.log("aqui paso: ", response);
}

pruebaDeploy();

async function algo() {
  console.log("aqui va");
  const myContractWasm: any = require("./code/metadao_dao.wasm");

  console.log(myContractWasm);
}

export default WalletService;

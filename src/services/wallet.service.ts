import { Wallet } from "../entities/wallets.entity";
import GoogleAuthUtils from "../utils/google_auth.utils";
import walletUtils from "../utils/wallet.utils";
import emailUtils from "../utils/email.utils";
import encryp from "../utils/encryp";
import { configNear } from "../config/nearConfig";
import { Not, In } from "typeorm"
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

async function encryptBD() {
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  await delay(5000);
  Wallet.find().then((wallets) => {
    wallets.forEach(async (element) => {
      await Wallet.update({ id: element.id }, { 
        email: encryp.encryp(element.email),
        cedula: encryp.encryp(element.cedula),
        name: encryp.encryp(element.name), 
        walletname: encryp.encryp(element.walletname) 
      });
    });
  });

}

// encryptBD()

class WalletService {
  /* async sendCode(email: string) {
    
    const verifyEmail = await Wallet.findOne({ where: { email: email } });

    if (!verifyEmail) {
      throw new Error("El correo no esta registrado, debe crear una cuenta");
    }

    const result = "deprecado";//await emailUtils.sendCode(email);

    return result;
  } */

  async sendCodeVerifyEmail(email: string, cedula: string, ip: string) {
    const emailLowerCase = email.trim().toLocaleLowerCase();
    
    const cedulaEncrypt = encryp.encryp(cedula);
    const emailEncrypt = encryp.encryp(emailLowerCase);

    const verifyEmail = await Wallet.findOne({ where: { email: emailEncrypt } });
    const verifyCedula = await Wallet.findOne({ where: { cedula: cedulaEncrypt } });

    if (verifyEmail) {
      throw new Error(
        "El correo proporcionado ya esta registrado, use un correo diferente"
      );
    }

    if (verifyCedula) {
      throw new Error(
        "La cedula ya esta registrado, use una cedula diferente"
      );
    }

    const result = await emailUtils.sendCode(email, cedula, ip);

    return result;
  }

  async verifyCode(code: string, email: string) {
    const result = await emailUtils.verifyCode(code, email);

    return result;
  }

  /* async verifyGoogle(token: string) {
    let response: any;

    await GoogleAuthUtils.verifyAccesGoogle(token).then(async (result: any) => {
      if (!result.payload["email_verified"])
        throw new Error("Error eL email no esta verificado");

      response = await walletUtils.emailRegistered(result.payload["email"]);
    });

    return response;
  } */

  /* async emailWalletImport(code: string, email: string) {
    await this.verifyCode(code, email);

    //const response = "funcion deprecada"

    const response = await walletUtils.emailRegistered(email);

    return response;
  } */

  /* async emailCreateNickname(code: string, email: string, nickname: string) {
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
  } */

  async createNickname(nickname: string, email: string, cedula: string) {

    const result = await walletUtils.createNickname(nickname, email, cedula);

    return result;
  }


  async updateWalleData(email: string, cedula: string, name: string, walletname: string) {

    const result = await walletUtils.verifyAndUpdateOrInsert(email, cedula, name, walletname)

    return result;
  }

  async verifyWalletName(walletname: string) {
    const walletNameEncrypt = encryp.encryp(walletname);
    const wallet = await Wallet.findOne({ where: { walletname: walletNameEncrypt } });

    if (wallet) {
      return wallet;
    } else {
      return {};
    }
  }

  async verifyAllWallets() {
    const wallets = await Wallet.find();
  
    if (wallets.length > 0) {
      return wallets;
    } else {
      return [];
    }
  }

}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

/* async function algo() {
 await delay(3000);

  const verifyEmail = await Wallet.find({ order: {id: 'ASC'} });

  verifyEmail.forEach(async (element) => {
    await delay(5000);
    // console.log(encryp.decryp(element.seedPhrase));
    // console.log("aqui: ", element.seedPhrase)
    const walletData = await walletUtils.parseFromSeedPhrase(encryp.decryp(element.seedPhrase));
    // const walletName = await walletUtils.getNearId(walletData.publicKey);
    console.log("seedPhrase: ", walletData.seedPhrase);
    console.log("address: ", walletData.address);
    // const accountIds = await walletUtils.listAccountsByPublicKey(walletData.publicKey);

    // console.log("accounts: ", accountIds, walletData.address);

  //  console.log(element.email, " ---------- ", walletName);
    Wallet.update({id: element.id}, {walletname: walletData.address});
   // await element.save();
  })
} */

// algo();

export default WalletService;

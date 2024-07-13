import { Wallet } from "../entities/wallets.entity";
import GoogleAuthUtils from "../utils/google_auth.utils";
import walletUtils from "../utils/wallet.utils";
import emailUtils from "../utils/email.utils";
import encryp from "../utils/encryp";
import { configNear } from "../config/nearConfig";
import { Not, In } from "typeorm"
import { PreRegistration } from "../entities/preRegistration.entity";
// const myContractWasm  = require("../services/code/metadao_dao.wasm");


//funcion de delay
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

//funcion buscar email encryptado en la base de datos
async function searchEmail(email: string) {
  await delay(3000);
  const emailEncrypt = encryp.encryp(email);
  const preRegistro = await PreRegistration.find({ where: { email: email } });
  const wallet = await Wallet.findOne({ where: { email: emailEncrypt } });
  

  console.log("---------------------------------------------")
  console.log("Pre-registro:")
  console.log(preRegistro)
  console.log("Wallet:")
  console.log(wallet)
  console.log("---------------------------------------------")
}

//searchEmail("hrpmicarelli@gmail.com")

// funcion para eliminar registro de pre-registro y wallet usando el email
async function deleteEmail(email: string) {
  await delay(3000);
  const emailEncrypt = encryp.encryp(email);
  const preRegistro = await PreRegistration.findOne({ where: { email: email } });
  const wallet = await Wallet.findOne({ where: { email: emailEncrypt } });

  if (preRegistro) {
    await PreRegistration.remove(preRegistro);
  }

  if (wallet) {
    await Wallet.remove(wallet);
  }

  console.log("---------------------------------------------")
  console.log("Pre-registro:")
  console.log(preRegistro)
  console.log("Wallet:")
  console.log(wallet)
  console.log("---------------------------------------------")
}

// deleteEmail("hrpmicarelli@gmail.com")

async function encryptBD() {
  console.log("---------------------------------------------")
  console.log("inicio encryptado")
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  await delay(5000);
  Wallet.find().then((wallets) => {
    wallets.forEach(async (element) => {
      console.log("element: ", element)
      await Wallet.update({ id: element.id }, { 
        email: encryp.encrypDES(element.email),
        cedula: encryp.encrypDES(element.cedula),
        name: encryp.encrypDES(element.name),
        walletname: encryp.encrypDES(element.walletname)
      });
    });
  });

  console.log("fin encryptado")
  console.log("---------------------------------------------")

}

// encryptBD()

// decryptBD()

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
    const emailLowerCase = email.trim().toLowerCase();
    
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
    for (let i = 0; i < 5; i++) {
      try {
        const result = await walletUtils.createNickname(nickname, email, cedula);
        return result;
      } catch (error: any) {
        console.log("error: ", error);
        if (i === 4) {
          throw new Error(`400 - ${error}`);
        }
        await delay(1000);
      }
    }
    // const result = await walletUtils.createNickname(nickname, email, cedula);
  }


  async updateWalleData(email: string, cedula: string, name: string, walletname: string) {

    const result = await walletUtils.verifyAndUpdateOrInsert(email, cedula, name, walletname)

    return result;
  }

  async verifyWalletName(walletname: string) {
    await delay(3000);
    const walletNameEncrypt = encryp.encryp(walletname);
    const wallet = await Wallet.findOne({ where: { walletname: walletNameEncrypt } });
    // console.log("wallet: ", walletNameEncrypt, wallet)
    if (wallet) {
      return wallet;
    } else {
      return {};
    }
  }

  //funcion consultar wallet desencryptando la informacion
  /* async verifyWallet(walletname: string) {
    await delay(3000);
    const walletNameEncrypt = encryp.encrypDES(walletname);
    const wallet = await Wallet.find();

    if (wallet) {
      const walletData = wallet.map((element) => {
        try {
          return {
            email2: element.email,
            email: encryp.decryp(element.email),
            cedula: encryp.decryp(element.cedula),
            name: element?.name ? encryp.decryp(element.name) : "",
            walletname: element?.walletname ? encryp.decryp(element.walletname) : ""
          }  
        } catch (error) {
          return {
            email2: element.email,
            email: element.email,
          }
        }
        
      })
      
      const emailOccurrences = walletData.reduce((acc:any, curr:any) => {
        if (curr.email in acc) {
          acc[curr.email]++;
        } else {
          acc[curr.email] = 1;
        }
        return acc;
      }, {});
      
      // Filtrar el objeto para encontrar los correos electrónicos que aparecen más de una vez
      const duplicateEmails = Object.keys(emailOccurrences).filter(email => emailOccurrences[email] > 1);
      
      console.log('Duplicate emails:', duplicateEmails);


      const dataUser = walletData.filter((element) => ['igabcm@gmail.com',
      'johanjesusrivero@gmail.com',
      'jhondeibis58@gmail.com',
      'mariaparisproduccion@gmail.com'].includes(element.email))
      // console.log("walletData: ", walletData)
      console.log("dataUser: ", dataUser)
      // console.log("wallet: ", walletNameEncrypt, encryp.decrypDES(walletNameEncrypt))
      //console.log("wallet: ", encryp.encryp(dataUser?.walletname))
      return walletData;
    } else {
      return {};
    }
  } */

  async verifyAllWallets() {
    const wallets = await Wallet.find();
  
    if (wallets.length > 0) {
      return wallets;
    } else {
      return [];
    }
  }

}

// WalletService.prototype.verifyWalletName("andresdom.near") // ("andresdom.near") 



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

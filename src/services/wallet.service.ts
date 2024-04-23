import { Wallet } from "../entities/wallets.entity";
import GoogleAuthUtils from "../utils/google_auth.utils";
import walletUtils from "../utils/wallet.utils";
import emailUtils from "../utils/email.utils";
import encryp from "../utils/encryp";

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

  async sendCode(email:string) {
    const verifyEmail = await Wallet.findOne({where: {email: email}});

    if(!verifyEmail) {
      throw new Error("El correo no esta registrado, debe crear una cuenta")
    }

    const result = await emailUtils.sendCode(email)

    return result
  }

  async sendCodeVerifyEmail(email:string) {
    const verifyEmail = await Wallet.findOne({where: {email: email}});

    if(verifyEmail) {
      throw new Error("El correo proporcionado ya esta registrado, use un correo diferente")
    }

    const result = await emailUtils.sendCode(email)

    return result
  }
  

  async verifyCode(code: string, email: string) {
    const result = await emailUtils.verifyCode(code, email)

    return result
  }


  async verifyGoogle(token: string) {
    let response:any
    
    await GoogleAuthUtils.verifyAccesGoogle(token).then(async (result:any) => { 
      if(!result.payload['email_verified']) throw new Error ("Error eL email no esta verificado");
      
      response = await walletUtils.emailRegistered(result.payload['email'])
    });

    return response
    
  }


  async emailWalletImport(code: string, email: string) {
    await this.verifyCode(code, email)
    
    //const response = "funcion deprecada"

    const response = await walletUtils.emailRegistered(email)

    return response
    
  }


  async emailCreateNickname(code: string, email: string, nickname: string) {
    try {
      await this.verifyCode(code, email)

      const wallet = await Wallet.findOneBy({email: email});
      
      if(!wallet) {
        throw new Error ("Email is not registered")
      } else {
        // const response = await walletUtils.createNickname(nickname, email, cedula);
        // await Wallet.update({email:email}, {seedPhrase: encryp.encryp(response.seedPhrase), nickname: true})
        // response.isExists = true;

        return {}
      }
    } catch (err:any) {
      throw new Error (err.toString())
    }

  }



  async createNickname(nickname: string, email: string, cedula: string) {
      
    const result = await walletUtils.createNickname(nickname, email, cedula)
    
    return result;
  }

  async updateWalleData(email: string, cedula: string, name: string, walletname: string) {
      
    const result = await walletUtils.verifyAndUpdateOrInsert(email, cedula, name, walletname)
    
    return result;
  }

  async verifyWalletName(walletname: string) {
    const wallet = await Wallet.findOne({ where: { walletname } });
  
    if (wallet) {
      return wallet;
    } else {
      return {};
    }
  }


}


export default WalletService;
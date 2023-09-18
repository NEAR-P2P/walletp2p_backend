import { Wallet } from "../entities/wallets.entity";
import GoogleAuthUtils from "../utils/google_auth.utils";
import walletUtils from "../utils/wallet.utils";
import emailUtils from "../utils/email.utils";




 //funcion de delay
 /* function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
} */
class WalletService {

  async sendCode(email:string) {
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
        const response = await walletUtils.createNickname(nickname);
        await Wallet.update({email:email}, {seedPhrase: response.seedPhrase, nickname: true})
        response.isExists = true;

        return response
      }
    } catch (err:any) {
      throw new Error (err.toString())
    }

  }



  async createNickname(nickname: string) {
      
    const result = await walletUtils.createNickname(nickname)
    
    return result;
  }

}


export default WalletService;
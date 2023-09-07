import axios from "axios";
import { transporter } from "../config/emailConfig"
import moment from "moment";
import { Action, createTransaction, functionCall } from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";
import { Wallet } from "../entities/wallets.entity";
import { OtpList } from "../entities/otp.entity";
const nearSeedPhrase = require('near-seed-phrase');
const nearAPI = require("near-api-js");
const { utils, AccountService, NearUtils, KeyPair, keyStores, Near, connect } = nearAPI;
import {configNear} from '../config/nearConfig';
const otpGenerator = require('otp-generator')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();


 //funcion de delay
 /* function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
} */

const sendCode = async (email:string) => {
  const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  let userRegister = false

  await Wallet.findOneBy({email: email }).then((response) => {
    userRegister = true;
  })
  
  await OtpList.findOne({where: {email: email }}).then((response) => {
    OtpList.delete({email: email});
  })

  const otpList = new OtpList();
  otpList.email = email
  otpList.code = otp
  
  const save = await otpList.save();

  if(!save) throw new Error ("Error al generar codigo");

  await transporter.sendMail({
    from: '"verificación 👻" <hpalencia@dvconsultores.com>', // sender address
    to: "hrpmicarelli@gmail.com", // list of receivers
    subject: "Codigo de verificación Hello ✔", // Subject line
    text: "Codigo de verificación", // plain text body
    html: "<p>Su codigo es: <b>"+otp+"</b> </p>", // html body
  });

  return { userRegister: userRegister }
}


const verifyCode = async (code: string, email: string) => {
  const optlist = await OtpList.findOne({where: {email: email }});

  if(!optlist) throw new Error ("Error al verificar codigo, porfavor vuelva a solicitar el codigo")

  if(optlist.code == code){
    let creationDate = new Date(optlist.creation_date);
    let currentDate = new Date();
    let minutosDiff = (currentDate.getTime() - creationDate.getTime()) / 1000 / 60;

    if(minutosDiff > Number(process.env.TIME_ESPIRATE_SECOND)) {
      throw new Error ("Su codigo ha caducado, solicite un nuevo codigo");
    }
    
    return true

  } else {
    throw new Error ("El codigo no coincide")
  }

}


const verifyGoogle = async (token: string) => {
  let response:any
  
  await verifyAccesGoogle(token).then(async (result:any) => { 
    if(!result.payload['email_verified']) throw new Error ("Error eL email no esta verificado");
    
    response = await emailRegistered(result.payload['email'])
  });

  return response
  
}


async function emailWalletImport(code: string, email: string) {
  await verifyCode(code, email)
  
  const response = await emailRegistered(email)

  return response
  
}


async function emailCreateNickname(code: string, email: string, nickname: string) {
  try {
    await verifyCode(code, email)

    const wallet = await Wallet.findOneBy({email: email});
    
    if(!wallet) {
      throw new Error ("Email is not registered")
    } else {
      const response = await createNickname(nickname);
      await Wallet.update({email:email}, {seedPhrase: response.seedPhrase, nickname: true})
      response.isExists = true;

      return response
    }
  } catch (err:any) {
    throw new Error (err.toString())
  }

}



async function createNickname(nickname: string) {
    
  const privateKey = process.env.CREATE_NICKNAME_PRIVATEKEY;
  const address =  process.env.CREATE_NICKNAME_ADDRESS;
  

  // creates a public / private key pair using the provided private key
  // adds the keyPair you created to keyStore
  const myKeyStore = new keyStores.InMemoryKeyStore();
  const keyPairOld = KeyPair.fromString(privateKey);
  await myKeyStore.setKey(process.env.NETWORK, address, keyPairOld);

  const nearConnection = await connect(configNear(myKeyStore));
  const account = await nearConnection.account(address);
  
  
  // const creatorAccount = await nearConnection.account(address);
  const {seedPhrase, secretKey} = nearSeedPhrase.generateSeedPhrase();
  const keyPairNew = KeyPair.fromString(secretKey);;// KeyPair.fromRandom("ed25519");
  const publicKey = keyPairNew.publicKey.toString();
  await myKeyStore.setKey(process.env.NETWORK, nickname, keyPairNew);


  const response2 = await account.functionCall({
    contractId: process.env.NETWORK,
    methodName: "create_account",
    args: {
      new_account_id: nickname,
      new_public_key: publicKey,
    },
    gas: "300000000000000",
    attachedDeposit: "10000000000000000000",
  });

  if(response2.receipts_outcome[1].outcome.status.Failure === undefined) {
    const result: any = {
      seedPhrase: seedPhrase, 
      publicKey: publicKey, 
      secretKey: keyPairNew.secretKey,
      address: nickname,
      isExists: true,
    };
  
    return result;

  } else {
    throw new Error ("Error: " + response2.receipts_outcome[1].outcome.status.Failure.toString())
  }
}





async function emailRegistered(email: string) {
  const wallet = await Wallet.findOneBy({email: email});
  if(!wallet) {
    const dataWallet = await generateSeedPhrase()

    const createWallet = new Wallet();
    createWallet.email = email
    createWallet.seedPhrase = dataWallet.seedPhrase
    
    const save = await createWallet.save();

    if(!save) throw new Error ("Error al registrar su correo")
  
    return dataWallet
  } else {
    const dataWallet = await parseFromSeedPhrase(wallet.seedPhrase)
    return dataWallet
  }
}


async function verifyAccesGoogle(token:string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID_GOOGLE,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
      payload: payload,
      userid: payload['sub'],
    }
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  } catch (error:any) {
    throw new Error ("Error token invalido")
  }
}


async function generateSeedPhrase() {
  const {seedPhrase, publicKey, secretKey} = await nearSeedPhrase.generateSeedPhrase();
  const keyPair = KeyPair.fromString(secretKey);
  const implicitAccountId = Buffer.from(keyPair.getPublicKey().data).toString("hex");

  const result: any = {
    seedPhrase: seedPhrase, 
    publicKey: publicKey, 
    secretKey: secretKey,
    address: implicitAccountId,
    isExists: false,
  };

  return result;
}

async function parseFromSeedPhrase(seedPhrase: string) {
    const walletSeed = await nearSeedPhrase.parseSeedPhrase(seedPhrase);
    const keyPairNew = KeyPair.fromString(walletSeed.secretKey);
    const publicKey = keyPairNew.publicKey.toString();
    let implicitAccountId = Buffer.from(publicKey).toString("hex");
    
    await axios.get(process.env.URL_API_INDEXER + "/publicKey/" + publicKey +'/accounts')
      .then((response) => {

        if(response.data.length > 0) {
          implicitAccountId = response.data[0].toString()
        }
    })

    const result: any = {
      seedPhrase: seedPhrase, 
      publicKey: publicKey, 
      secretKey: walletSeed.secretKey,
      address: implicitAccountId,
      isExists: true,
    };
    console.log(result)
    return result;
}


async function isAddress(address: string): Promise<boolean> {
  const keyStore = new keyStores.InMemoryKeyStore();
  const near = new Near(NearUtils.ConfigNEAR(keyStore));
  const account = new AccountService(near.connection, address);
  const is_address = await account
    .state()
    .then((response: any) => {
      console.log(response);
      return true;
    })
    .catch((error: any) => {
      console.log(error);
      return false;
    });
  return is_address;
}


export default {
  sendCode,
  verifyCode,
  emailWalletImport,
  emailCreateNickname,
  createNickname,
  verifyGoogle
}
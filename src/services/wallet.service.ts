import axios from "axios";
import { transporter } from "../config/emailConfig"
import moment from "moment";
import { Action, createTransaction, functionCall } from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";
import { Wallet } from "../entities/wallets.entity";
import { OtpList } from "../entities/otp.entity";
const nearSeedPhrase = require('near-seed-phrase');
const nearAPI = require("near-api-js");
const { utils, AccountService, NearUtils, KeyPair, keyStores, Near } = nearAPI;
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

    const result = await emailRegistered(email)
    
    return result

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



async function emailRegistered(email: string) {
  const wallet = await Wallet.findOneBy({email: email});
  if(!wallet) {
    const dataWallet = await generateSeedPhrase()

    const createWallet = new Wallet();
    createWallet.email = email
    createWallet.name = email.split("@")[0]
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
    const keyPair = KeyPair.fromString(walletSeed.secretKey);
    const publicKey = keyPair.getPublicKey(); // keyPair.publicKey.toString();
    const implicitAccountId = Buffer.from(keyPair.getPublicKey().data).toString("hex");

    const result: any = {
      seedPhrase: seedPhrase, 
      publicKey: publicKey, 
      secretKey: walletSeed.secretKey,
      address: implicitAccountId,
      isExists: true,
    };

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
  verifyGoogle
}
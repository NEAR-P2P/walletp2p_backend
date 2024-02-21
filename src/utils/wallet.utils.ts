import axios from "axios";
const nearAPI = require("near-api-js");
const { utils, AccountService, NearUtils, KeyPair, keyStores, Near, connect } = nearAPI;
import {configNear} from '../config/nearConfig';
import { Wallet } from "../entities/wallets.entity";
import encryp from "./encryp";
const nearSeedPhrase = require('near-seed-phrase');



async function emailRegistered(email: string) {
  const wallet = await Wallet.findOneBy({email: email.trim()});
  if(!wallet) throw new Error("Correo no registrado") /* {
    const dataWallet = await generateSeedPhrase()

    const createWallet = new Wallet();
    createWallet.email = email;
    createWallet.seedPhrase = encryp.encryp(dataWallet.seedPhrase);
    
    const save = await createWallet.save();

    if(!save) throw new Error ("Error al registrar su correo")
  
    return dataWallet
  } else { */
  const dataWallet = await parseFromSeedPhrase(encryp.decryp(wallet.seedPhrase));
  return dataWallet
  //}
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
    let implicitAccountId = Buffer.from(keyPairNew.getPublicKey().data).toString("hex");
    //let address = Buffer.from().toString("hex");
    
    /* await axios.get(process.env.URL_API_INDEXER + "/publicKey/" + publicKey +'/accounts')
      .then((response) => {

        if(response.data.length > 0) {
          implicitAccountId = response.data[0].toString()
        }
    }).catch((error) => {
      console.log(error)
    }) */

    await axios.get(process.env.URL_API_INDEXER + "/keys/" + publicKey )
      .then((response) => {
        if(response.data?.keys?.length > 0) {
          if(response.data?.keys[0]?.account_id) {
            implicitAccountId = response.data?.keys[0]?.account_id
          }
        }
    }).catch((error) => {
      console.log(error)
    })

    const result: any = {
      seedPhrase: seedPhrase, 
      publicKey: publicKey, 
      secretKey: walletSeed.secretKey,
      address: implicitAccountId,
      isExists: true,
    };

    return result;
}


async function createNickname(nickname: string, email: string, cedula: string) {
    
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
    contractId: process.env.NETWORK == "testnet" ? process.env.NETWORK : "near",
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

    try {
      const createWallet = new Wallet();
      createWallet.email = email;
      createWallet.seedPhrase = encryp.encryp(seedPhrase);
      createWallet.cedula = cedula;
      
      await createWallet.save();
    } catch (error) {
      console.log("insert wallet funcion createNickname: ", error)   
    }
  
    return result;

  } else {
    throw new Error ("Error: " + response2.receipts_outcome[1].outcome.status.Failure.toString())
  }
}



export default {
  emailRegistered,
  generateSeedPhrase,
  parseFromSeedPhrase,
  createNickname,
}
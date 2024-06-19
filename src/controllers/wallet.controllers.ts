import { Request, Response } from "express";
import WalletService from "../services/wallet.service";
import { PreRegistration } from "../entities/preRegistration.entity";

const service = new WalletService();

const sendCode = async (req: Request, res: Response) => {
  try {
    console.log("ip: ", req.headers['x-forwarded-for'], req.connection.remoteAddress)
    const {email} = req.body;
    res.send({
      data: await service.sendCode(email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const sendCodeVerifyEmail = async (req: Request, res: Response) => {
  try {
    const {email, cedula} = req.body;
    
    if( email.toLowerCase().split("@").includes("gmail.com") ) throw new Error("400 - solo se permiten correos GMAIL");

    const ip: string | undefined = req.ip || req.connection.remoteAddress;
    if(!ip) throw new Error("400 - no se pudo obtener la direccion ip del cliente");

    res.send({
      data: await service.sendCodeVerifyEmail(email, cedula, ip)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message || error);
  }
};

const verifyCode = async (req: Request, res: Response) => {
  try {
    const {code, email} = req.body;
    
    if( email.toLowerCase().split("@").includes("gmail.com") ) throw new Error("400 - solo se permiten correos GMAIL");

    res.send({
      data: await service.verifyCode(code, email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

/* const emailWalletImport = async (req: Request, res: Response) => {
  try {
    const {code, email} = req.body;
    res.send({
      data: await service.emailWalletImport(code, email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
}; */


const emailCreateNickname = async (req: Request, res: Response) => {
  try {
    const {code, email, nickname} = req.body;
    res.send({
      data: "deprecate" //await service.emailCreateNickname(code, email, nickname)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const createNickname = async (req: Request, res: Response) => {
  try {
    const {nickname, email, cedula} = req.body;

    if( email.toLowerCase().split("@").includes("gmail.com") ) throw new Error("400 - solo se permiten correos GMAIL");

    const verifyPreRegistration = await PreRegistration.findOneBy({ email: email });
    if(!verifyPreRegistration) throw new Error("Error: No existe pre registro");
    if(verifyPreRegistration.proccess || verifyPreRegistration.registered) throw new Error("Error: El email ya ha sido registrado");
    if(verifyPreRegistration.ip != req.ip) throw new Error("Error: La direccion ip no coincide con la registrada al validar el codigo OTP");
    

    res.send({
      data: await service.createNickname(nickname, email, cedula)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};


/* const verifyGoogle = async (req: Request, res: Response) => {
  try {
    const {token} = req.body;
    res.send({
      data: await service.verifyGoogle(token)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
}; */

const updateAndVerifyWallet = async (req: Request, res: Response) => {
  try {
    const {email, cedula, name, walletname} = req.body;
    res.send({
      data: await service.updateWalleData(email, cedula, name, walletname)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const verifyWalletName = async (req: Request, res: Response) => {
  try {
    const {walletname} = req.body;
    res.send({
      data: await service.verifyWalletName(walletname)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const verifyAllWalletName = async (req: Request, res: Response) => {
  try {
    res.send({
      data: await service.verifyAllWallets()
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

export default { 
  sendCode,
  sendCodeVerifyEmail,
  verifyCode,
  // emailWalletImport,
  emailCreateNickname,
  createNickname,
  // verifyGoogle,
  updateAndVerifyWallet,
  verifyWalletName ,
  verifyAllWalletName
}






















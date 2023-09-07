import { Request, Response } from "express";
import walletService from "../services/wallet.service";


const sendCode = async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    res.send({
      data: await walletService.sendCode(email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const verifyCode = async (req: Request, res: Response) => {
  try {
    const {code, email} = req.body;
    res.send({
      data: await walletService.verifyCode(code, email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const emailWalletImport = async (req: Request, res: Response) => {
  try {
    const {code, email, seedPhraseNicname} = req.body;
    res.send({
      data: await walletService.emailWalletImport(code, email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};


const emailCreateNickname = async (req: Request, res: Response) => {
  try {
    const {code, email, nickname} = req.body;
    res.send({
      data: await walletService.emailCreateNickname(code, email, nickname)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const createNickname = async (req: Request, res: Response) => {
  try {
    const {nickname} = req.body;
    res.send({
      data: await walletService.createNickname(nickname)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};


const verifyGoogle = async (req: Request, res: Response) => {
  try {
    const {token} = req.body;
    res.send({
      data: await walletService.verifyGoogle(token)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};


export default { sendCode, verifyCode, emailWalletImport, emailCreateNickname, createNickname, verifyGoogle }






















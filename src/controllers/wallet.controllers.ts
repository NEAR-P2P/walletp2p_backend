import { Request, Response } from "express";
import WalletService from "../services/wallet.service";

const service = new WalletService();

const sendCode = async (req: Request, res: Response) => {
  try {
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
    const {email} = req.body;
    res.send({
      data: await service.sendCodeVerifyEmail(email)
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
    res.send({
      data: await service.verifyCode(code, email)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const emailWalletImport = async (req: Request, res: Response) => {
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
};


const emailCreateNickname = async (req: Request, res: Response) => {
  try {
    const {code, email, nickname} = req.body;
    res.send({
      data: await service.emailCreateNickname(code, email, nickname)
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
    res.send({
      data: await service.createNickname(nickname, email, cedula)
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
      data: await service.verifyGoogle(token)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};


export default { sendCode, sendCodeVerifyEmail, verifyCode, emailWalletImport, emailCreateNickname, createNickname, verifyGoogle }






















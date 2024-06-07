import { Request, Response } from "express";
import WalletService from "../services/walletbot.service";

const service = new WalletService();




const updateAndVerifyWallet = async (req: Request, res: Response) => {
  try {
    const {idtelegram, walletname} = req.body;
    res.send({
      data: await service.updateWalleData(idtelegram, walletname)
    });
  } catch (error: any) {
    console.log(error)
    let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
    res.status(statusCode).send(error.message);
  }
};

const deleteWalletName = async (req: Request, res: Response) => {
    try {
        const {idtelegram, walletname} = req.body;
        res.send({
        data: await service.deleteWalletName(idtelegram, walletname)
        });
    } catch (error: any) {
        console.log(error)
        let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
        res.status(statusCode).send(error.message);
    }
}

const listWalletBots = async (req: Request, res: Response) => {
  try {
      const {idtelegram, walletname} = req.body;
      res.send({
      data: await service.listWalletBots(idtelegram, walletname)
      });
  } catch (error: any) {
      console.log(error)
      let statusCode = error.message.split("-").length > 0 ? Number(error.message.split("-")[0]) ? Number(error.message.split("-")[0]) : 500 : 500;
      res.status(statusCode).send(error.message);
  }
}



export default { 
  updateAndVerifyWallet,
  deleteWalletName,
  listWalletBots
}






















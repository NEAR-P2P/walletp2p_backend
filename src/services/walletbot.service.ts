import { WalletBot } from "../entities/bot.entity";
import walletUtils from "../utils/walletbot.utils";


class WalletService {

  async updateWalleData(idtelegram: string, walletname: string) {

    const result = await walletUtils.verifyAndUpdateOrInsert(idtelegram, walletname)

    return result;
  }

  async deleteWalletName(idtelegram: string, walletname: string) {
    
    const result = await walletUtils.deleteWalletName(idtelegram, walletname)
    
    return result;
  }

  async listWalletBots(idtelegram: string, walletname: string) {
      const result = await walletUtils.listWalletBots(idtelegram, walletname)
      return result;
  }

}


export default WalletService;

import { WalletBot } from "../entities/bot.entity";


async function verifyAndUpdateOrInsert(pidtelegram: string, pwalletname: string) {
  if (!pidtelegram) {
    throw new Error('Telegram is required');
  }
  // console.log(`Searching for wallet with cedula: ${cedula}`);
  let walletname = await WalletBot.findOne({
      where: {
        walletname: pwalletname.trim().toLocaleLowerCase(),
        idtelegram: pidtelegram.trim().toLocaleLowerCase()
      }
    });
  // console.log('wallet', wallet)
  if (walletname) {
    // console.log('Actualizando wallet')
    // If email exists, update cedula and name
    walletname.idtelegram = pidtelegram;
    walletname.walletname = pwalletname.trim().toLocaleLowerCase();
    await walletname.save();
  } else {
    // If wallet doesn't exist, insert new record
    walletname = new WalletBot();
    walletname.idtelegram = pidtelegram;
    walletname.walletname = pwalletname.trim().toLocaleLowerCase();
  }
    await walletname.save();
  return walletname;
}

async function deleteWalletName(pidtelegram: string, pwalletname: string) {
  // Find the WalletBot by id
  const walletBot = await WalletBot.findOne({
    where: {
      walletname: pwalletname.trim().toLocaleLowerCase(),
      idtelegram: pidtelegram.trim().toLocaleLowerCase()
    }
  });

  if (!walletBot) {
    throw new Error(`WalletBot with name ${pwalletname} not found`);
  }


  // Delete the WalletBot
  await WalletBot.remove(walletBot);

  return walletBot;
}

async function listWalletBots(idtelegram: string, walletname: string) {
  // Find all WalletBots with the provided idtelegram and/or walletname
  const walletBots = await WalletBot.find({ where: { idtelegram, walletname } });

  return walletBots;
}



export default {
  verifyAndUpdateOrInsert,
  deleteWalletName,
  listWalletBots
}
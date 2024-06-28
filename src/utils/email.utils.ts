import { transporter } from "../config/emailConfig";
import { Wallet } from "../entities/wallets.entity";
import { OtpList } from "../entities/otp.entity";
const otpGenerator = require("otp-generator");
import { PreRegistration } from "../entities/preRegistration.entity";

const sendCode = async (email: string, cedula: string, ip: string) => {
  const otp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  let userRegister = false;

  await Wallet.findOneBy({ email: email }).then(() => {
    userRegister = true;
  });

  // const verifyPreRegistrationIp = await PreRegistration.findOneBy({ ip: ip, registered: true });
  
  // if(verifyPreRegistrationIp?.ip) throw new Error("Ud. Ya tiene una wallet registrada");

  const verifyPreRegistration = await PreRegistration.findOneBy({ email: email });

  if(verifyPreRegistration) {
    if(verifyPreRegistration.proccess || verifyPreRegistration.registered) throw new Error("El email ya ha sido registrado");
    
    await PreRegistration.update({ email: email }, { cedula: cedula, ip: ip, validOtp: false});
  } else {
    const createPreRegistration = new PreRegistration();
    createPreRegistration.cedula = cedula;
    createPreRegistration.email = email.toLocaleLowerCase();
    createPreRegistration.ip = ip;

    const createPreRegistrationSave = await createPreRegistration.save();

    if (!createPreRegistrationSave) throw new Error("Error al generar pre registro");
  }

  await OtpList.findOne({ where: { email: email } }).then(() => {
    OtpList.delete({ email: email });
  });

  const otpList = new OtpList();
  otpList.email = email.toLocaleLowerCase();
  otpList.code = otp;

  const save = await otpList.save();

  if (!save) throw new Error("Error al generar codigo");

  const network = process.env.NETWORK || "";
  await transporter.sendMail({
    //from: '"verificación 👻" <developer@dvconsultores.com>', // sender address
    //from: '"verificación" <hrpmdevelop@gmail.com>', // sender address
    from: (network == "testnet" ? '"verificación" <hrpmdevelop@gmail.com>' : '"verificación" <developer@dvconsultores.com>'), // sender address
    to: email, // list of receivers
    subject: "Codigo de verificación Hello ✔", // Subject line
    text: "Codigo de verificación", // plain text body
    html: "<p>Su codigo es: <b>" + otp + "</b> </p>", // html body
  });


  return { userRegister: userRegister };
};



const verifyCode = async (code: string, email: string) => {
  const optlist = await OtpList.findOne({ where: { email: email } });

  if (!optlist)
    throw new Error(
      "Error al verificar codigo, porfavor vuelva a solicitar el codigo"
    );

  if (optlist.code == code) {
    let creationDate = new Date(optlist.creation_date);
    let currentDate = new Date();
    let minutosDiff = (currentDate.getTime() - creationDate.getTime()) / 1000 / 60;

    if (minutosDiff > Number(process.env.TIME_ESPIRATE_SECOND)) {
      throw new Error("Su codigo ha caducado, solicite un nuevo codigo");
    }

    await PreRegistration.update({ email: email }, { validOtp: true });

    return true;
  } else {
    throw new Error("El codigo no coincide");
  }
};

export default {
  sendCode,
  verifyCode,
};

import { PaymentMethodOffer } from "../entities/payment_method_offer.entity";
import { PaymentMethodUser } from "../entities/payment_method_user.entity";
import { OfferType } from "../entities/types.entity";
import apiService from "../services/api.service";


export interface dataOffer {
  typeOffer: OfferType,
  ownerId: string,
  assetId: number,
  amount: number,
  minAmount: number,
  maxAmount: number,
  exchangeRate: number,
  fiatId: number,
  termConditions: string,
  autoMessage: string,
  durationTime: number,
  paymentMethods: [number],
  paymentMethodsUser?: [number],
  price: number,
  automatic_rate: boolean,
}

/*interface UserDetalle {
  userid: string,
  nickname: string,
  avatar: string,
  email: string,
  total_orders: number,
  confirmed_orders: number,
  total_orders_merchant: number,
  confirmed_orders_merchant: number,
  upvotes: number,
  downvotes: number,
  upvotes_merchant: number,
  downvotes_merchant: number,
  is_merchant: boolean,
}*/

interface UserDetalle {
  userid: string,
  nickname: string,
  avatar: string,
  email: string,
  total_orders_merchant: number,
  percent_completacion: number,
  percent_valoracion: number
  is_merchant: boolean,
}


interface PaymentMethodShortVar{
  payment_method_id: number
}

interface OfferFormatBig {
  id: number,
  type_offer: OfferType,
  asset_id: number,
  amount: number,
  remaning_amount: number,
  min_amount: number,
  max_amount: number,
  exchange_rate: number,
  fiat_id: number,
  term_conditions: string,
  auto_message: string,
  duration_time: number,
  is_active: boolean,
  status: number,
  creation_date: Date,
  payment_method_offer: PaymentMethodShortVar[],
  payment_method_user: PaymentMethodShortVar[],
  price: number,
  automatic_rate: boolean,
  owner_id: UserDetalle,
}


export async function mapOfferFullDetails(data: any) {
  let idsUsers: any = [];
  let listDataUsers: any = [];
  let listDataMap: OfferFormatBig[] = [];
  let dataFinal: any = [];

  //obtener los id de usuario en una lista , para pasarselo al apiServices y poder obtener mas detalles del usuario
  for (let i in data[0]) {
    const item = data[0][i];

    if (idsUsers.find((element: any) => element.id == item.owner_id.userid))
      continue;

    idsUsers.push({ id: item.owner_id.userid });
  }


  //consultar los datos de usuarios registrado en la lista idsUsers
  await apiService
    .dataUsers(idsUsers)
    .then((response: any) => {
      listDataUsers = response.data;
    })
    .catch((error: any) =>
      console.log("Error al consultar datos perfil user: ", error)
    );

  //mapeando la consulta 
  for (let i in data[0]) {
    const item = data[0][i];
    const dataUser: any = listDataUsers.filter(
      (element: any) => element.id == Number(item.owner_id.userid)
    );

    const percent_completacion: number = (item.owner_id.confirmed_orders_merchant / item.owner_id.total_orders_merchant) * 100;
    const percent_valoracion: number = (item.owner_id.upvotes_merchant / (item.owner_id.upvotes_merchant + item.owner_id.downvotes_merchant)) * 100;

    listDataMap.push({
      id: item.id,
      type_offer: item.type_offer,
      asset_id: item.asset_id,
      amount: item.amount,
      remaning_amount: item.remaning_amount,
      min_amount: item.min_amount,
      max_amount: item.max_amount,
      exchange_rate: item.exchange_rate,
      fiat_id: item.fiat_id,
      term_conditions: item.term_conditions,
      auto_message: item.auto_message,
      duration_time: item.duration_time,
      is_active: item.is_active,
      status: item.status,
      creation_date: item.creation_date,
      payment_method_offer: item.payment_method_offer.map(
        (data: PaymentMethodOffer) => {
          return { payment_method_id: data.payment_method_id };
        }
      ),
      payment_method_user: item.payment_method_user.map(
        (data: PaymentMethodUser) => {
          return { payment_method_id: data.payment_method_id };
        }
      ),
      price: item.automatic_rate
        ? item.exchange_rate * item.conversion_rate.rate
        : item.price,
      automatic_rate: item.automatic_rate,
      owner_id: {
        userid: item.owner_id.userid,
        nickname: dataUser.length > 0 ? dataUser[0].nickname : "",
        avatar: dataUser.length > 0 ? dataUser[0].avatar : "",
        email: dataUser.length > 0 ? dataUser[0].email : "",
        //total_orders: item.owner_id.total_orders,
        //confirmed_orders: item.owner_id.confirmed_orders,
        total_orders_merchant: item.owner_id.total_orders_merchant,
        percent_completacion: !isNaN(percent_completacion) ? Number(percent_completacion.toFixed(2)) : 0.00,
        percent_valoracion: !isNaN(percent_valoracion) ? Number(percent_valoracion.toFixed(2)) : 0.00,
        //confirmed_orders_merchant: item.owner_id.confirmed_orders_merchant,
        //upvotes: item.owner_id.upvotes,
        //downvotes: item.owner_id.downvotes,
        //upvotes_merchant: item.owner_id.upvotes_merchant,
        //downvotes_merchant: item.owner_id.downvotes_merchant,
        is_merchant: item.owner_id.is_merchant,
      },
    });
  }

  //finalmente se arma un arrego con la data mapeada y el total de registro que contiene la consulta
  dataFinal.push(listDataMap);
  dataFinal.push(data[1]);

  return dataFinal;
}
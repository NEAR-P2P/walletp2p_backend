import { Orders } from "../entities/orders.entity";
import { OrdersUsers } from "../entities/orders_users.entity";
import { PaymentMethodOffer } from "../entities/payment_method_offer.entity";
import { PaymentMethodUser } from "../entities/payment_method_user.entity";
import apiService from "../services/api.service";

export interface dataOrder {
  preorderid: number,
  amount: number,
  paymentmethodid?: number
  paymentmethoduserid?: number
}


export async function mapOrders(listaOrders: any, userId: string) {
  let idsUsers: any = [];

  for (let i in listaOrders[0]) {
    const element: Orders = listaOrders[0][i];

    if (idsUsers.find((item: any) => item.id == element.owner_id.userid) == undefined) {
      idsUsers.push({ id: element.owner_id.userid });
    }
    if (idsUsers.find((item: any) => item.id == element.signer_id.userid) == undefined) {
      idsUsers.push({ id: element.signer_id.userid });
    }
  }

  let listDataUsers: any = [];

  //consultar los datos de usuarios registrado en la lista idsUsers
  await apiService
    .dataUsers(idsUsers)
    .then((response: any) => {
      listDataUsers = response.data;
    })
    .catch((error: any) => console.log("Error al consultar datos perfil user"));


  //mapeo de los resultados obtenidos
  const listDataMap = listaOrders[0].map((item: Orders) => {
    const orderUser = item.user.filter((itemtypeuser: OrdersUsers) => itemtypeuser.user.userid == userId).shift();
    
    const dataOwner: any = listDataUsers.filter(
      (element: any) => element.id == Number(item.owner_id.userid)
    );
    const dataSigner: any = listDataUsers.filter(
      (element: any) => element.id == Number(item.signer_id.userid)
    );
    
    return {
      id: item.id,
      type_order: orderUser?.type_order,
      type_origin: item.type_order,
      type_user: orderUser?.type_user,
      amount: item.amount,
      exchange_rate: item.exchange_rate,
      payment_method_id: item.payment_method_id,
      payment_method_user_id: item.payment_method_user_id,
      payment_methods: item.offer_id.payment_method_offer.map(
        (data: PaymentMethodOffer) => {
          return { payment_method_id: data.payment_method_id };
        }
      ),
      payment_methods_user: item.offer_id.payment_method_user.map(
        (data: PaymentMethodUser) => {
          return { payment_method_id: data.payment_method_id };
        }
      ),
      term_conditions: item.term_conditions,
      duration_time: item.duration_time,
      signer_confirmation: item.signer_confirmation,
      owner_confirmation: item.owner_confirmation,
      status: item.status,
      asset_id: item.offer_id.asset_id,
      fiat_id: item.offer_id.fiat_id,
      referencial_ID: item.referencial_ID,
      dispute_log: item.dispute_log,
      signer_vote: item.signer_vote,
      owner_vote: item.owner_vote,
      creation_date: item.creation_date,
      confirmation_date: item.confirmation_date,
      price: item.price,
      owner_id: {
        userid: item.owner_id.userid,
        nickname: dataOwner.length > 0 ? dataOwner[0].nickname : "",
        avatar: dataOwner.length > 0 ? dataOwner[0].avatar : "",
        email: dataOwner.length > 0 ? dataOwner[0].email : "",
        is_merchant: item.owner_id.is_merchant,
      },
      signer_id: {
        userid: item.signer_id.userid,
        nickname: dataSigner.length > 0 ? dataSigner[0].nickname : "",
        avatar: dataSigner.length > 0 ? dataSigner[0].avatar : "",
        email: dataSigner.length > 0 ? dataSigner[0].email : "",
        is_merchant: item.signer_id.is_merchant,
      },
    };
  });

  let dataFinal: any = [];
  dataFinal.push(listDataMap);
  dataFinal.push(listaOrders[1]);

  return dataFinal;
}

export async function mapOrdersFullDetails(listaOrders: any, userId: string) {
  let idsUsers: any = [];

  for (let i in listaOrders[0]) {
    const element: Orders = listaOrders[0][i];

    if (idsUsers.find((item: any) => item.id == element.owner_id.userid) == undefined) {
      idsUsers.push({ id: element.owner_id.userid });
    }
    if (idsUsers.find((item: any) => item.id == element.signer_id.userid) == undefined) {
      idsUsers.push({ id: element.signer_id.userid });
    }
  }

  let listDataUsers: any = [];

  //consultar los datos de usuarios registrado en la lista idsUsers
  await apiService
    .dataUsers(idsUsers)
    .then((response: any) => {
      listDataUsers = response.data;
    })
    .catch((error: any) => console.log("Error al consultar datos perfil user"));


  //mapeo de los resultados obtenidos
  const listDataMap = listaOrders[0].map((item: Orders) => {
    const orderUser = item.user.filter((itemtypeuser: OrdersUsers) => itemtypeuser.user.userid == userId).shift();
    
    const dataOwner: any = listDataUsers.filter(
      (element: any) => element.id == Number(item.owner_id.userid)
    );
    const dataSigner: any = listDataUsers.filter(
      (element: any) => element.id == Number(item.signer_id.userid)
    );
    
    return {
      id: item.id,
      type_order: orderUser?.type_order,
      type_origin: item.type_order,
      type_user: orderUser?.type_user,
      amount: item.amount,
      exchange_rate: item.exchange_rate,
      payment_method_id: item.payment_method_id,
      payment_method_user_id: item.payment_method_user_id,
      payment_methods: item.offer_id.payment_method_offer.map(
        (data: PaymentMethodOffer) => {
          return { payment_method_id: data.payment_method_id };
        }
      ),
      payment_methods_user: item.offer_id.payment_method_user.map(
        (data: PaymentMethodUser) => {
          return { payment_method_id: data.payment_method_id };
        }
      ),
      term_conditions: item.term_conditions,
      duration_time: item.duration_time,
      signer_confirmation: item.signer_confirmation,
      owner_confirmation: item.owner_confirmation,
      status: item.status,
      reason_cancellation: item.reason_cancellation,
      asset_id: item.offer_id.asset_id,
      fiat_id: item.offer_id.fiat_id,
      referencial_ID: item.referencial_ID,
      dispute_log: item.dispute_log,
      signer_vote: item.signer_vote,
      owner_vote: item.owner_vote,
      creation_date: item.creation_date,
      confirmation_date: item.confirmation_date,
      price: item.price,
      owner_id: {
        userid: item.owner_id.userid,
        nickname: dataOwner.length > 0 ? dataOwner[0].nickname : "",
        avatar: dataOwner.length > 0 ? dataOwner[0].avatar : "",
        email: dataOwner.length > 0 ? dataOwner[0].email : "",
        is_merchant: item.owner_id.is_merchant,
      },
      signer_id: {
        userid: item.signer_id.userid,
        nickname: dataSigner.length > 0 ? dataSigner[0].nickname : "",
        avatar: dataSigner.length > 0 ? dataSigner[0].avatar : "",
        email: dataSigner.length > 0 ? dataSigner[0].email : "",
        is_merchant: item.signer_id.is_merchant,
      },
    };
  });

  let dataFinal: any = [];
  dataFinal.push(listDataMap);
  dataFinal.push(listaOrders[1]);

  return dataFinal;
}
import cors from 'cors';
import express from 'express';
import { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { router } from './routes/index';
import bodyParser from 'body-parser';
import swaggerUi, { serve } from "swagger-ui-express";
import swaggerSetup from "./config/swagger";
import AppDataSource from "./config/data.source";
import "reflect-metadata";

//inicializando firebase
/*const { getFirestore } = require('firebase-admin/firestore');
var admin = require("firebase-admin");
var serviceAccount = require("../firebase-key");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
export const dbFire = getFirestore();*/

//inicializando el resto de express
dotenv.config();

process.env.TZ = "UTC";

const app: Application = express();
AppDataSource.initialize().then(() => console.log("Conexion ORM P2p Ready"));


//const app = express();
const port = Number(process.env.PORT);

//dependencias express
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


// routes
app.use(process.env.RUTA!, router);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSetup));




app.listen(port, () => {
  return console.log(`server is listening on ${port} - ${process.env.PROTOCOL}${process.env.HOST}:${process.env.PORT}${process.env.RUTA}/`);
});
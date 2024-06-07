import express from 'express';
const router = express.Router();
import walletController from '../controllers/walletbot.controllers';



/**
 * Post track
 * @swagger
 * /wallet/verify-google:
 *    post:
 *      tags:
 *        - User
 *      summary: .
 *      description: .
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: "object"
 *                required: [userid]
 *                properties: {
 *                  seedPhrase: {
 *                    type: "string"
 *                  }
 *                }
 *      responses:
 *        '200':
 *          description: .
 *        '400':
 *          description: .
 *        '500':
 *          description: server internal error.
 */
router.post('/add_wallet_bot', walletController.updateAndVerifyWallet)

/**
 * Post track
 * @swagger
 * /wallet/verify-google:
 *    post:
 *      tags:
 *        - User
 *      summary: .
 *      description: .
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: "object"
 *                required: [userid]
 *                properties: {
 *                  seedPhrase: {
 *                    type: "string"
 *                  }
 *                }
 *      responses:
 *        '200':
 *          description: .
 *        '400':
 *          description: .
 *        '500':
 *          description: server internal error.
 */
router.post('/delete_wallet_bot', walletController.deleteWalletName)

/**
 * Post track
 * @swagger
 * /wallet/verify-google:
 *    post:
 *      tags:
 *        - User
 *      summary: .
 *      description: .
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: "object"
 *                required: [userid]
 *                properties: {
 *                  seedPhrase: {
 *                    type: "string"
 *                  }
 *                }
 *      responses:
 *        '200':
 *          description: .
 *        '400':
 *          description: .
 *        '500':
 *          description: server internal error.
 */
router.post('/list_wallet_bot', walletController.listWalletBots)


export { router }
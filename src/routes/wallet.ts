import express from 'express';
const router = express.Router();
import walletController from '../controllers/wallet.controllers';


/**
 * Post track
 * @swagger
 * /wallet/send-code:
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
 *                properties: {
 *                }
 *      responses:
 *        '200':
 *          description: .
 *        '400':
 *          description: .
 *        '500':
 *          description: server internal error.
 */
router.post('/send-code', walletController.sendCode)


router.post('/send-code-verify-email', walletController.sendCodeVerifyEmail)
/**
 * Post track
 * @swagger
 * /wallet/verify-code:
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
router.post('/verify-code', walletController.verifyCode)




/*
 * Post track
 * @swagger
 * /wallet/email-wallet-import:
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
 *
router.post('/email-wallet-import', walletController.emailWalletImport) */


/**
 * Post track
 * @swagger
 * /wallet/email-create-nickname:
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
router.post('/email-create-nickname', walletController.emailCreateNickname)


/**
 * Post track
 * @swagger
 * /wallet/create-nickname:
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
router.post('/create-nickname', walletController.createNickname)


/*
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
 *
router.post('/verify-google', walletController.verifyGoogle) */

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
router.post('/update-wallet', walletController.updateAndVerifyWallet)


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
router.post('/verify-wallet', walletController.verifyWalletName)

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
router.post('/verify-all-wallets', walletController.verifyAllWalletName)


export { router }
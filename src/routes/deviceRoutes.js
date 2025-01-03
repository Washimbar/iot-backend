const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /device/control-fan:
 *   post:
 *     summary: Control the fan state and speed
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fanId:
 *                 type: number
 *                 example: 1
 *               state:
 *                 type: boolean
 *                 example: true
 *               speed:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Fan controlled successfully
 *       500:
 *         description: Server error
 */
router.post('/control-fan', authMiddleware, deviceController.controlFan);

/**
 * @swagger
 * /device/control-rgb:
 *   post:
 *     summary: Control the RGB light state and color
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rgbId:
 *                 type: number
 *                 example: 1
 *               state:
 *                 type: boolean
 *                 example: true
 *               color:
 *                 type: string
 *                 example: "red"
 *     responses:
 *       200:
 *         description: RGB light controlled successfully
 *       500:
 *         description: Server error
 */
router.post('/control-rgb', authMiddleware, deviceController.controlRGB);

/**
 * @swagger
 * /device/control-switch:
 *   post:
 *     summary: Control the switch state
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               switchId:
 *                 type: number
 *                 example: 1
 *               state:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Switch controlled successfully
 *       500:
 *         description: Server error
 */
router.post('/control-switch', authMiddleware, deviceController.controlSwitch);

module.exports = router;

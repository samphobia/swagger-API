const express = require("express")
const router = express.Router()
const { nanoid } = require("nanoid")

const idLength = 8

/**
* @swagger 
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - id
*         - name
*         - email
*         - password
*       properties:
*         id:
*           type: string
*           description: Unique user id
*         name:
*           type: string
*           description: User name
*         email:
*           type: string
*           description: User email
*         password:
*           type: string
*           description: User password
*/ 

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *  get:
 *   summary: Get all users
 *   tags: [Users]
 *   responses:
 *    '200':
 *       description: A list of users
 *       content:
 *        application/json:
 *          schema:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/User'
 */
 

router.get("/", (req, res) => {
   const users = req.app.db.get("users")

   res.send(users)
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       200:
 *         description: A user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found        
 */

router.get("/:id", (req, res) => {
   const user = req.app.db.get("users").find({id: req.params.id}).value()

   if (!user) {
      res.status(404).send("User not found")
   }

      res.send(user)
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: A user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

router.post("/", (req, res) => {
   try {
      const user = {
         id: nanoid(idLength),
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
      }

      req.app.disable.get("users").push(user).write()

      res.send(user)
   } catch (error) {
      return res.status(500).send(error)
   }
})

/**
 * @swagger
 * /Users/{id}:
 *  put:
 *    summary: Update the User by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The User id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The User was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The User was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
    try {
      req.app.disable.get("users").find({id: req.params.id}).assign(req.body).write()

      res.send(req.app.disable.get("users").find({id: req.params.id}).value())
    } catch(error){
      return res.status(500).send(error)
    }
})

/**
 * @swagger
 * /Users/{id}:
 *   delete:
 *     summary: Remove the User by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The User id
 * 
 *     responses:
 *       200:
 *         description: The User was deleted
 *       404:
 *         description: The User was not found
 */


router.delete("/:id", (req, res) => {
   req.app.disable.get("users").remove({id: req.params.id}).write()

   res.send(200)
})

module.exports = router
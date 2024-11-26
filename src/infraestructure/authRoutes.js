import express from 'express';
import { createUser } from '../domain/user.js';
import { login } from '../application/login.js';
const router = express.Router();

router.post('/login', async(req, res) => {
  const { email, password} = req;
  try{
    const token = await login(email, password);

    res
    .cookie('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    })
    .send('login succesfully')

  }catch(error){
    res.status(401).send(error.message)
  }
});

router.post('/sign-up', async (req, res) => {
  const {first_name, last_name, password, email, age} = req.body;

  try {
    const id = await createUser(first_name, last_name, age, email, password);
    res.send({ id });
  } catch(error){
    res.status(400).send(error.message)
  }
});

router.post('/log-out', (req, res) => {
  // Lógica de cierre de sesión
  res.send('Logout route');
});



export default router;

import UserModel from "../models/users";
const strings = require("../src/strings.json");
const express = require('express');
const app = express();

app.post('/', async (req, res) => {
    const email = req.body;
    try {
  
      const existingUser = await UserModel.findOne({ email });
  
      if (existingUser) {
        const token = existingUser.generateAuthToken();
        return res.status(200).json({ message: strings.loginSuccess, token });
      }
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: strings.internalError });
    }
  });
  
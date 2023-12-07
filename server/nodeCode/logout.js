import UserModel from "../models/users";
const strings = require("../src/strings.json");
const express = require('express');
const app = express();

app.post('/logout', async (req, res) => {
    try {
      const { userId } = req.body;
  
      await UserModel.findByIdAndUpdate(userId, { authToken: null });
  
      res.status(200).json({ message: strings.logoutSuccess });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ message: strings.internalError });
    }
  });
  
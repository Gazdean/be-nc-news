const {fetchTopics} = require('../models/nc-news-model')
const endpoints = require('../../endpoints.json')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
      res.status(200).send({ topics });
    });
};

exports.getAllEndpoints = (req, res) => {
  
    res.status(200).send(endpoints);
};
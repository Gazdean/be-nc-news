const {fetchTopics} = require('../models/nc-news-model')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
      res.status(200).send({ topics });
    });
};


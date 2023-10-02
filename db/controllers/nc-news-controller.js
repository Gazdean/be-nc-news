const {fetchTopics, fetchAllEndpoints} = require('../models/nc-news-model')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
      res.status(200).send({ topics });
    });
};

// exports.getAllEndpoints = (req, res, next) => {
//     fetchAllEndpoints
// }
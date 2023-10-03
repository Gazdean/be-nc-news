exports.invalidEndpoint = (req, res) => {
    res.status(404).send({mess: 'not found'})
}
exports.customError = (err, req, res, next) => {
    if (err.status) {
        res
        .status([err.status])
        .send({ mess: err.mess });
    }
    next(err);
}
exports.psqlError = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({mess: 'bad request'});
    } else next(err)
  };
exports.internalServerError = (err, req, res,next) => {
    if (err === 500) {
        console.log(err, ('Internal server error'))
        res.status(500).send({mess: 'Internal Server Error'})
    }
}
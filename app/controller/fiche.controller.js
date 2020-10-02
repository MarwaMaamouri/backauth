const db = require('../config/db.config.js');
//const config = require('../config/config.js');

const db = require("../model");
const Fiche = db.fiches;
const Op = db.Sequelize.Op;

// Create and Save a new Fiche
exports.create = (req, res) => {
  // Validate request
  if (!req.body.libelle) {
    res.status(400).send({
    message: "Content can not be empty!"
    });
    return;
  }
  //Create a Fiche 
  const fiche = {
    libelle: req.body.libelle,
    description: req.body.description,
   //published: req.body.published ? req.body.published : false
  };
  // Save Tutorial in the database
  Fiche.create(fiche)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Fiche."
      });
    });
};

// Retrieve all Fiches from the database.
exports.findAll = (req, res) => {
  const libelle = req.query.libelle;
  var condition = libelle ? { libelle: { [Op.iLike]: `%${libelle}%` } } : null;
  Fiche.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving fiches."
      });
    });
};
//Find a single Fiche with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Fiche.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Fiche with id=" + id
      });
    });
};
//Update a Fiche by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Fiche.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

//Delete a Fiche with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Fiche.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Fiches from the database.
exports.deleteAll = (req, res) => {
  Fiche.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// find all published Fiche 
exports.findAllPublished = (req, res) => {
  Fiche.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

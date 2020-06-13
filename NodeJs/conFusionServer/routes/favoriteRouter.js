const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('../cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('dishes')
    .then((favorite) => {
        const dishes = req.body.map((dish) => {
            return dish._id;
        });
        if (!favorite) {
            return Favorites.create({
                user: req.user._id,
                dishes: dishes
            });
        } else {
            if (req.body) {
              var newDishes = dishes.filter((newDishId) => {
                return !favorite.dishes.find((existing) => {
                  return existing.id === newDishId;
                });
              });
              newDishes.forEach((dish) => {
                favorite.dishes.push(dish);
              });
            }
            return favorite.save();
        }
    })
    .then((favorite) => {
        return Favorites.findById(favorite._id)
        .populate('user')
        .populate('dishes');
    })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (!favorite) {
            err = new Error('There are no favorites added for the user');
            err.status = 404;
            return next(err); 
        }
        return Favorites.findByIdAndRemove(favorite._id);
    })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/:dishId');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('dishes')
    .then((favorite) => {
        if (!favorite) {
            return Favorites.create({
                user: req.user._id,
                dishes: [req.params.dishId]
            });
        }
        const alreadyExists = favorite.dishes.find((dish) => {
            return dish.id === req.params.dishId;
        });

        if (!alreadyExists) {
            favorite.dishes.push(req.params.dishId);
        }
        return favorite.save();
    })
    .then((favorite) => {
        return Favorites.findById(favorite._id)
        .populate('user')
        .populate('dishes');
    })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('dishes')
    .then((favorite) => {
        if (!favorite) {
            err = new Error('There are no favorites added for the user');
            err.status = 404;
            return next(err); 
        }
        const leftDishes = favorite.dishes.filter((dish) => {
            return dish.id !== req.params.dishId;
        });

        favorite.dishes = leftDishes;
        return favorite.save();
    })
    .then((favorite) => {
        return Favorites.findById(favorite._id)
        .populate('user')
        .populate('dishes');
    })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;
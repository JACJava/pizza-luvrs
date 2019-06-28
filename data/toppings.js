'use strict';

const Topping = require('../models/topping'),
  DynamoStore = require('./dynamoStore'),
  _ = require('lodash');

function initToppings (callback) {
  createTopping('Dough Crust', 'dough_crust.png', 'dough_crust.png', 1);
  createTopping('Marinara Sauce', 'marinara_sauce.png', 'marinara_sauce.png', 2);
  createTopping('Mozzarella Cheese', 'mozzarella_cheese.png', 'mozzarella_cheese.png', 3);
  createTopping('Cheddar Cheese', 'cheddar.png', 'cheddar_cheese.png', 4);
  createTopping('Mushrooms', 'mushroom.png', 'mushrooms.png', 5);
  createTopping('Pepperoni', 'pepperoni.png', 'pepperonis.png', 6);
  createTopping('Laser Beams', 'laser_beam.png', 'laser_beams.png', 7);
  createTopping('Banana Peppers', 'banana_pepper.png', 'banana_peppers.png', 8);
  createTopping('Ham', 'ham.png', 'hams.png', 9);
  createTopping('Green Peppers', 'green_pepper.png', 'green_peppers.png', 10);
  createTopping('Rainbows', 'rainbow.png', 'rainbows.png', 11);
  createTopping('Money', 'money.png', 'moneys.png', 12);
  if (callback) callback();
}

function getAllToppings (callback) {
  DynamoStore.getAllItems('toppings', (err, data) => {
    let toppings = dynamoItemsToToppings(data.Items);
    callback(err, _.sortBy(toppings, ['order']));
  });
}

function createTopping (name, preview_image, image, order) {
  let id = name.replace(/ /g, '_').toLowerCase(),
    topping = new Topping(id, name, preview_image, image, order);

  DynamoStore.putItem('toppings', topping, (err, data) => {});
}

function dynamoItemsToToppings (items) {
  return items.map((item) => {
    return new Topping(item.id.S, item.name.S, item.preview_image.S, item.image.S, +item.order.N);
  });
}

module.exports.getAllToppings = getAllToppings;
module.exports.initToppings = initToppings;

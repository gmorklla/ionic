'use strict';

/**
 * @ngdoc factory
 * @name starter.factory:Items
 * @description: creación y manejo de proyectos
 * # Items
 */
angular.module('starter')
    .factory('Items', function($firebaseArray) {
        var itemsRef = new Firebase("https://ionictododemo.firebaseio.com/items");
        return $firebaseArray(itemsRef);
    });

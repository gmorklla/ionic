'use strict';

/**
 * @ngdoc factory
 * @name starter.factory:Projects
 * @description: creación y manejo de proyectos
 * # Projects
 */
angular.module('starter')
    .factory('Projects', function(Items) {
        var projectString = Items;
        return {
            all: function() {
                if (projectString) {
                    return projectString;
                }
                return [];
            },
            save: function(projects) {
                return projectString.$add( projects );
            },
            delete: function(projects) {
                return projectString.$remove( projects );              
            }
        }
    });

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
                projectString.$add( projects );
            },
            delete: function(projects) {
                projectString.$remove( projects );
            },            
            newProject: function(projectTitle) {
                // Add a new project
                return {
                    title: projectTitle
                };
            }
        }
    });

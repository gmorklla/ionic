'use strict';

/**
 * @ngdoc factory
 * @name starter.factory:Projects
 * @description: creación y manejo de proyectos
 * # Projects
 */
angular.module('starter')
    .factory('Projects', function() {
        return {
            all: function() {
                var projectString = window.localStorage['projects'];
                if (projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },
            save: function(projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            delete: function(projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },            
            newProject: function(projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            getLastActiveIndex: function() {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function(index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    });

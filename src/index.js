var angular = require('angular');
var $ = require('jquery');
var _ = require('lodash');

angular.module('RedisKnowledgeDatabaseApp', []);

angular
  .module('RedisKnowledgeDatabaseApp')
  .controller('LinksController', ['$scope', '$window', function($scope, $window){
    this.links = [];
    this.displayedLinks = [];

    const DISPLAYED_LINKS_COUNT = 10;
    var PAGE = 0;

    this.setLinks = function(links){
      this.links = links;

      const listTags = _.chain(this.links).map((e) => e.tags).join(' ').split(' ').countBy().toPairs().sortBy((v) => v[1]).reverse() .value();
      const EXCLUDE_TAGS = ['redis', 'redis-nl-reading'];

      this.tags = listTags.filter(pair => {
        return !_.includes(EXCLUDE_TAGS, pair[0]) && pair[1] > 1;})
        .map(function(element, i){
          return [_.replace(element[0], "redis-", ""), element[1]]
        });
    };

    this.oneTag = function(tag){
      this.displayedLinks = _.filter(this.links, function(link){
        return _.includes(link.tags, tag[0]);
      });
    };

    this.updatePagination = function(){
      this.displayedLinks = this.links.slice(PAGE*DISPLAYED_LINKS_COUNT, (PAGE+ 1)*DISPLAYED_LINKS_COUNT);
    };

    this.next = function(){
      PAGE++;
      this.updatePagination();
    };

    this.previous = function(){
      PAGE--;
      this.updatePagination();
    };

    this.open = function(link){
      $window.open(link.href, '_blank');
    };

    $.get('/api/links').then(function(links) {
      this.setLinks(links);
      this.updatePagination();
      $scope.$apply();
    }.bind(this));

  }]);

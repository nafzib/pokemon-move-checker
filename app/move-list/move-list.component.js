// Register 'moveList' component, along with its associated controller and template
angular.
	module('moveList').
	component('moveList', {
		templateUrl: 'move-list/move-list.template.html',
		/*might need to add pokedex-promise-v2 dependency as an argument in the controller's constructor function like so:
			controller: function MoveListController($http,$pokedex-promise-v2) {
		*/
		controller: function MoveListController($http) {
			var self = this;
			self.orderProp = 'number';
			//TODO pull min and max pokemon ID #s from API/Pokedex dynamically
			self.minpkmn = 1; 
			self.maxpkmn = 807;
			self.outofbounds = false;
			self.versionlimit = 100;
			self.bulbapediaLookupUrl = 'https://bulbapedia.bulbagarden.net/wiki/';
			self.bulbapediaSearchUrl = 'https://bulbapedia.bulbagarden.net/w/index.php?title=Special%3ASearch&search=';
			self.bulbaPokemonSuffix = '_(Pokémon)';
			self.bulbaMoveSuffix = '_(move)';
			self.lostonly = false;

			//TODO Change below to pull from the pokedex promise v2 server side caching framework
			// might have to change the $http to reference the pokedex variable???

			function setVersionLimit(id) {
				if (id<152) {
							//Gen 1
							self.versionlimit = self.versions.length;
							console.log('Set versionlimit to ' + self.versionlimit);
						} else if (id<252) {
							//Gen 2
							self.versionlimit = -(self.versions.length-2);
							console.log('Set versionlimit to ' + self.versionlimit);
						} else if (id<387) {
							//Gen 3
							self.versionlimit = -(self.versions.length-4);
							console.log('Set versionlimit to ' + self.versionlimit);
						} else if (id<494) {
							//Gen 4
							self.versionlimit = -(self.versions.length-9);
							console.log('Set versionlimit to ' + self.versionlimit);
						} else if (id<650) {
							//Gen 5
							self.versionlimit = -(self.versions.length-12);
							console.log('Set versionlimit to ' + self.versionlimit);
						} else if (id<722) {
							//Gen 6
							self.versionlimit = -(self.versions.length-14);
							console.log('Set versionlimit to ' + self.versionlimit);
						} else if (id<808) {
							//Gen 7
							self.versionlimit = -(self.versions.length-16);
							console.log('Set versionlimit to ' + self.versionlimit);
						}
			}
			
			$http.get('data/versions.json').then(function(response) {
				self.versions = response.data;
				console.log('Loaded version data');
			});
			self.fetch = function(){
				self.outofbounds = false;
				if(self.query>=self.minpkmn && self.query<=self.maxpkmn) {
					console.log('Searching for ' + self.query);
					$http.get('https://pokeapi.co/api/v2/pokemon/' + self.query).then(function(response){
						self.pkmn = response.data;
						console.log('Successfully loaded data for ' + self.pkmn.id);
						setVersionLimit(self.pkmn.id); 
					});
					/*
					Want to replace below with a dynamic way of figuring out generation like so:
					self.versionlimit = -(self.versions.length-pkmn.genintroducedin);
					*/

				} else {
					self.outofbounds = true;
				}
			}
		}
	});
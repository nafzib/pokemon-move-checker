// Register 'moveList' component, along with its associated controller and template
angular.
	module('moveList').
	component('moveList', {
		templateUrl: 'move-list/move-list.template.html',
		/*might need to add pokedex-promise-v2 dependency as an argument in the controller's constructor function like so:
			controller: function MoveListController($http,$pokedex-promise-v2) {
		*/
		controller: function MoveListController($http/* ,$cacheFactory */) {
			// I disabled $cacheFactory for now because the memory usage of the app in Firefox was getting ridiculous.
			// Once I fix some memory issues I'll re-implement it until I can get Pokedex Promise working.

			// const options = {
			// 	protocol: 'https',
			// 	// hostName: 'localhost:443',
			// 	versionPath: '/api/v2/',
			// 	cache: true,
			// 	timeout: 5 * 1000 // 5s
			//   }
			// const P = new Pokedex.Pokedex(options);
			// var pokedex = $cacheFactory('pokemonCache');
			var self = this;
			self.orderProp = 'number';
			//TODO pull min and max pokemon ID #s from API/Pokedex dynamically
			// Doing a call to the api without specifying a number returns a count of resources, but the count is 949 (whereas the highest pokemon ID in the API is 802)
			self.minpkmn = 1; 
			// Had 807 here before and I thought I got that number FROM PokeAPI, but PokeAPI only has Pokemon IDs up to 802?
			self.maxpkmn = 802;
			self.outOfBounds = false;
			self.versionlimit = 100;
			self.numGenerations = 7;
			self.bulbapediaLookupUrl = 'https://bulbapedia.bulbagarden.net/wiki/';
			self.bulbapediaSearchUrl = 'https://bulbapedia.bulbagarden.net/w/index.php?title=Special%3ASearch&search=';
			self.bulbaPokemonSuffix = '_(Pokémon)';
			self.bulbaMoveSuffix = '_(move)';

			//TODO Change below to pull from the pokedex promise v2 server side caching framework
			// might have to change the $http to reference the pokedex variable???

			//Note on versionlimit: You have to look at the actual versions JSON and calculate the number to subtract by hand.
			//Example - Gen 3 has 5 version groups: ruby-sapphire, emerald, firered-leafgreen, xd, and colosseum
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

			$http.get('data/generations.json').then(function(response) {
				self.generations = response.data;
				//Need to subtract 2 instead of just 1 from lastGroupIndex for now since ultra-sun-ultra-moon does not have data yet in PokeAPI
				self.lastGroupIndex = self.generations[self.numGenerations].length-2;
				console.log('Loaded generations data');
			});

			$http.get('data/moves.json').then(function(response) {
				self.moves = response.data;
				// The below may be required once I implement a server side cache of moves instead of my own streamlined moves.json
				// Either that or I will have to use a server-side database and query to take the load off the client-side...
				// self.moves.forEach(function(move) {
				// 	move["Name"] = move["Name"].replace(/[!@#$%^&*]/g, "").toLowerCase();
				// 	move["Type"] = move["Type"].replace(/[!@#$%^&*]/g, "").toLowerCase();
				// });
				// console.log('Test of move name transform: '+self.moves[0]["Name"]);
				console.log('Loaded move data');
			});

			self.fetch = function() {
				self.outOfBounds = false;
				if(self.searchPokemon>=self.minpkmn && self.searchPokemon<=self.maxpkmn) {
					console.log('Searching for ' + self.searchPokemon);
					// P.getPokemonByName(self.searchPokemon).then(function(response) {
					$http.get('https://pokeapi.co/api/v2/pokemon/' + self.searchPokemon/* , { cache : pokedex } */).then(function(response) {
						// Uncomment below line instead if using the above $http.get line instead of P.getPokemonByName	
						self.pkmn = response.data;
						// self.pkmn = response;
						console.log('Successfully loaded data for ' + self.pkmn.id + ": " + self.pkmn.name);
						setVersionLimit(self.pkmn.id); 

						self.lostMoves = [];
						self.pkmn.moves.forEach(function(move) {
							if(self.isLostMove(move)) {
								self.lostMoves.push(move.move.name);
							}
						});
						console.log('Loaded lost move data');
					});
					/*
					Want to replace below with a dynamic way of figuring out generation like so:
					self.versionlimit = -(self.versions.length-pkmn.generationIntroducedIn);
					*/

				} else {
					self.outOfBounds = true;
				}
			}

			self.moveVersionUrl = "https://pokeapi.co/api/v2/version-group/";

			//Grabbed below function from: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
			//Not using right now, but might still need it later when I extend isLostMove() to check by generation and not just using the current one
			// self.uniq = function(a) {
			// 	var seen = {};
			// 	return a.filter(function(item) {
			// 		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
			// 	});
			// }

			self.isLostMove = function(move) {
				var moveVersionGroups = [];
				move.version_group_details.forEach(function(version_group) {
					moveVersionGroups.push(version_group.version_group.name);
				});
				if(moveVersionGroups.includes(self.generations[self.numGenerations][self.lastGroupIndex])) { 
					return false;
				} else {
					return true;
				}
			};

			self.getMoveType = function(x) {
				//Regex to replace spaces with hyphens:
				x = x.replace(/\s+/g, "-").toLowerCase();
				return self.moves[x]["type"];
			};

			// String.prototype.capitalize = function() {
			// 	return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
			// };

			// String.prototype.equalsIgnoreCase = function(str) {
			// 	return this.toLowerCase() == str.toLowerCase();
			// };

			//Below is used on OLD moves.json file, or would be similar if I did an API call to PokeAPI, which is WAY more resource intensive than the above getMoveType():
			// self.getMoveType = function(x) {
			// 	//Regex to replace spaces with hyphens:
			// 	x = x.replace(/\s+/g, "-");
			// 	// console.log("Altered move name: "+x);
			// 	for(y=0; y<self.moves.length; y++) {
			// 		//First regex removes listed special characters (some move names have * in them) and second replaces spaces with hyphens
			// 		if(self.moves[y]["Name"].replace(/[!@#$%^&*]/g, "").replace(/\s+/g, "-").toLowerCase() == x.toLowerCase()) {
			// 			// console.log("Searched move without special characters: "+self.moves[y]["Name"].replace(/[!@#$%^&*]/g, "").replace(/\s+/g, "-").toLowerCase());
			// 			return (self.moves[y]["Type"]+'-type').toLowerCase();
			// 		}
			// 	}
			// };
		}
	});
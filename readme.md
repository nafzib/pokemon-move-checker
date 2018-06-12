pokemon-move-checker
--------------------
A tool that accepts any Pokemon as input and outputs any moves that the Pokemon is only capable of learning in Generations prior to the current one.

Recent Additions
----------------
* Got the checkbox filter working! Right now it only cares about the current gen; therefore, if a Pokemon is not capable of learning a move in Generation 7, it will be counted as a "lost" move that you must teach to the Pokemon in an earlier gen game.
* Added automated background-colors to each move row, corresponding to the move's type (used the same colors from Bulbapedia)

Big Issues
----------
* This app uses WAY more memory than I expected. I am doing some reading on Angular and memory management, but I'm thinking a server side database that I can query that is ultimately populated from the PokeAPI (cached of course) might be the most efficient option so I can return ONLY the data I need, whereas right now I'm getting the entire JSON object for each Pokemon that gets queried.

TO DO
-----------------
* Plug in Pokedex-Promise-v2 instead of using static JSON files that I saved manually
* Extend isLostMove() function so that it can determine which generation a move was lost in
    - Or be given input by user to specify which generation they want to use as the "active" one (i.e. the lastGroupIndex if looking at the code)
* Find a more efficient way of finding out if a move is learnable in each version-group within the table rather than a nested loop that checks every single one...
      - Perhaps by setting a column index integer to version-group mapping when creating the header row, then looping an integer for the TDs in the move rows and just checking the move versus that?
* Need option to make list show based on entire evolutionary line using pokeapi's "evolution-chain" call
* Display Pokemon's types?
* Make it prettier
* Figure out display of pokemon with different FORMS; i.e. #555 Darmanitan or #487 Giratina. The default that comes back from PokeApi is "Darmanitan-standard" and "Giratina-altered" respectively
* Filter list by generation pokemon was introduced in
* Add filter checkboxes for each move type?
* Add sort by move type
* Add sort by column header
* Implement a server side database populated by PokeApi? Or just use Pokedex Promise? 
    - It might be more efficient to run a DB query like: select moveType from moves where moveName = "{{$ctrl.move.move.name}}"
    - Then again, it might still be even more efficient to use my own streamlined, malformed moves.json...

Possible Dependencies
---------------------------------------------------
pokeapi-js-wrapper - Not currently used
pokedex-promise-v2 - Not currently used


DONE
-----------------
* Color the background of the cell for moves based on move type


Other Resources:
-----------------
https://daveceddia.com/access-control-allow-origin-cors-errors-in-angular/
https://www.sitepoint.com/api-calls-angularjs-http-service/
Awesome Original Gameboy Pokemon Font: http://www.fontspace.com/jackster-productions/pokemon-gb
Amazing JSON Transformation Tool: https://jolt-demo.appspot.com/



The following is the Jolt JSON Transform code to get my moves.json fixed. I pulled the moves by simply copy/pasting the table from Bulbapedia with all moves in it to excel, then using an excel to json converter.
This code malforms the JSON to a technically bad data structure { "MoveName": { "type" : "MoveType" }}, but it makes my front end finding of move type more efficient in the browser than having to search through the PokeAPI data structure or even from the below data structure converted from the table on Bulbapedia:
Run at: https://jolt-demo.appspot.com/
-------------------------------------------
[
  {
    "operation": "shift",
    "spec": {
      "*": {
        "@Type": "@Name.type"
      }
    }
  }
  ]
-------------------------------------------
  The above changes the JSON structure from:
  [
      {
		"#": "611",
		"Name": "Infestation",
		"Type": "Bug",
		"Category": "Special",
		"Contest": "Cute",
		"PP": "20",
		"Power": "20",
		"Accuracy": "100%",
		"Gen": "VI"
	},
	{
		"#": "612",
		"Name": "Power-Up Punch",
		"Type": "Fighting",
		"Category": "Physical",
		"Contest": "Tough",
		"PP": "20",
		"Power": "40",
		"Accuracy": "100%",
		"Gen": "VI"
	}
  ]

  To:

  [
      "Infestation": {
          "type": "Bug"
      },
      "Power-up Punch": {
          "type": "Fighting"
      }
  ]

The above still resulted in a handful of moves having:
    "type": ["Fighting", "Fighting"]
Not sure why, but I ran it through Jolt again with a "@=firstElement()" filter to keep only the first Type (since they were all repeats)
Then I ran the text through https://textmechanic.com/ to make it all lower case, and used the regex "/\b\s/" to change all white space at a word boundary to a hyphen to match up with the move names that come from PokeAPI.
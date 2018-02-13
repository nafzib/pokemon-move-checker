$(document).ready(function() {
	$('#refresh').click(function(){
		var num = document.getElementById('number').value;
		console.log(num);
		if(num==null || num<1 || num>758) num = chance.natural({min: 1, max: 758});
		//var num = 351;
		$.getJSON("http://pokeapi.co/api/v2/pokemon/" + num + "/",
		function(data){
			console.log(data);
			pkmn = data;
			var str = JSON.stringify(pkmn, null, 2); // spacing level = 2
			$("#pokemon-id").text(pkmn.id);
			$("#pokemon-name").text(pkmn.name);
			$("#pokemon-type1").text(pkmn.types[0].type.name);
			if(pkmn.types[1]) {
				$("#pokemon-type2").text(pkmn.types[1].type.name);
			} else {
				$("#pokemon-type2").text("");
			}
			$("#pokemon-height").text(pkmn.height);
			$("#pokemon-weight").text(pkmn.weight);
			
			//$("#pokemon-image").attr("src",pkmn.sprites.front_default);
			$("#pokemon-hp").text(pkmn.stats[5].base_stat);
			$("#pokemon-attack").text(pkmn.stats[4].base_stat);
			$("#pokemon-defense").text(pkmn.stats[3].base_stat);
			$("#pokemon-specialattack").text(pkmn.stats[2].base_stat);
			$("#pokemon-specialdefense").text(pkmn.stats[1].base_stat);
			$("#pokemon-speed").text(pkmn.stats[0].base_stat);
			//$("#pokemon-hp").text(pkmn.hp);
			//$("#pokemon-hp").text(pkmn.hp);
		
			var ni = document.getElementById('pokemon-moves');
			ni.innerHTML = ("");
			for(x=0; x<pkmn.moves.length; x++) {
				var newli = document.createElement('li');
				newli.innerHTML = pkmn.moves[x].move.name;
				ni.appendChild(newli);
			}
		
			$("#pokemon-moves").text(pkmn.moves.name);
			$("#pokemon-data").text(str);
		});
	});
});
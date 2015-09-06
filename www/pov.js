var MarkerIcon = L.icon({
	iconUrl: 'ico/marker-navy.png',
	iconAnchor: [16, 30],
	popupAnchor: [0, -32]
});
var MarkerIcon2 = L.icon({
	iconUrl: 'ico/marker-gray.png',
	iconAnchor: [16, 30],
	popupAnchor: [0, -32]
});
var markers_layer = new L.FeatureGroup();
map.addLayer(markers_layer);

function sendAjaxForm(formulaire){
	var postData = formulaire.serializeArray();
	var formURL = formulaire.attr("action");
	
	$.ajax({
		url : formURL,
		type: "POST",
		data : postData,
		success:function(data, textStatus, jqXHR) {
			//Je déclare le layer qui va recevoir les markers
			markers_layer.clearLayers();
		
			/*Je boucle sur le tableau */
			for (var i = 0; i < data.length ; i++)
			{
				var MarkLocation = new L.LatLng(data[i].pov_latitude, data[i].pov_longitude);
				var marker = new L.marker(MarkLocation, {icon: MarkerIcon}).addTo(map);

				// Définition du contenu du popup
				txtpop="<b>Lieu sélectionné : </b></br> ";
				
				for (var j = 0; j < data[i].artworks.length; j++) {

					txtpop += data[i].artworks[j].artwork_title + " </br>";

				}
				
				marker.bindPopup(txtpop);
				marker.pov_ind = i;
				marker.on("click", function(e) {

					// code pour le clic

					tmp = e.target.pov_ind;
					list_aw="";

					// Génération de la liste des oeuvres reliées au POV cliqué
					//Supprimer les oeuvres déjà présentes
					var oeuvre = document.getElementById('selected_pov_artworks');
					while (oeuvre.firstChild) {
						oeuvre.removeChild(oeuvre.firstChild);
					}

						//créé la nouvelle liste
					for (var j = 0; j < data[tmp].artworks.length; j++) {

						list_aw = data[tmp].artworks[j].artwork_title;

						var newParagraph = document.createElement('p');
						newParagraph.id = 'id_'+j;
						oeuvre.appendChild(newParagraph);

						var newParagraphText = document.createTextNode(list_aw);
						newParagraph.appendChild(newParagraphText);

						//Affichage de la notice liée à l'oeuvre sélectionnée.

						newParagraph.artwork_ind = j;
						newParagraph.pov_ind = tmp ;

						//Je crée mon événement sur le click d'un titre d'oeuvre

						newParagraph.addEventListener('click', function() {
							
							// suppression de l'oeuvre précédemment affichée
							var oeuvre_sel = document.getElementById('selected_artwork');
							while (oeuvre_sel.firstChild) {
								oeuvre_sel.removeChild(oeuvre_sel.firstChild);
							}
							
							//afficher la dernière oeuvre sélectionnée
							infos_artwork = data[this.pov_ind].artworks[this.artwork_ind].artwork_title + data[this.pov_ind].artworks[this.artwork_ind].stay_year;

							var newParagraph = document.createElement('p');
							oeuvre_sel.appendChild(newParagraph);

							var newParagraphText = document.createTextNode(infos_artwork);
							newParagraph.appendChild(newParagraphText);

						}, false);

					}
					e.target.setIcon(MarkerIcon2);

				});

				//on groupe tous les marqueurs sur un layer
				markers_layer.addLayer(marker);
			}
		// on ajoute le layer avec tous les markers à la carte
		},
		error: function(jqXHR, textStatus, errorThrown) {
				//if fails
		}
	});
}

//callback handler for form submit
$("#ajaxform").submit(function(e)
{
    e.preventDefault(); //STOP default action
	sendAjaxForm($("#ajaxform"));
});

//lancement du formulaire par défaut au chargement de la page
sendAjaxForm($("#ajaxform"));

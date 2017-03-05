
	jQuery(function ($) {
		var state = $("#state").val();
		var city = $("#city").val();
		var region = $("#region").val();
		var basket = $("#basket").val();
		var section = $("input[name='section']:checked").val();
        $(".jq_Spinner").css("top", 280);
        $('#InputPanel').ajaxStart(function () {
            $(".jq_Spinner").css("top", 280);
            $('#InputPanel').Loading(true, getDefaultLoaderSettings());
            $('#btnCalcular').hide();
        });
        $('#InputPanel').ajaxStop(function () {
            $('#InputPanel').Loading(false);
        	if (state != "" && city != "" && region != "" && basket != "" && section != "") {
        		$('#btnCalcular').show();
        	}
        });
    });
	
    $(document).ready(function () {
		var images = ['/Content/EmbeddedCalculators/Supermercado/EA.gif',
					'/Content/EmbeddedCalculators/Supermercado/green-bar.png',
					'/Content/EmbeddedCalculators/Supermercado/MT.gif',
					'/Content/EmbeddedCalculators/Supermercado/sections/cesta_completa.jpg',
					'/Content/EmbeddedCalculators/Supermercado/sections/cesta_higiene.jpg',
					'/Content/EmbeddedCalculators/Supermercado/sections/cesta_marca.jpg',
					'/Content/EmbeddedCalculators/Supermercado/sections/cesta_mercearia.jpg',
					'/Content/EmbeddedCalculators/Supermercado/sections/cesta_preco.jpg',
					'/Content/EmbeddedCalculators/Supermercado/sections/semcarne.jpg'];

		var msgError = "Houve um erro inesperado. Por favor, tente novamente mais tarde.";

		preloadimages(images);
		
		hide_headers_state();

		$('#inputLocation,#showRegions,#simulator,#section,#customize,#updateCarrinho,#btnExibirIntro,#btnCalcular,#OutputPanel').hide();
		
		$('#btnExibir1').click(function () {
		    $('#IntroPanel').hide(); $('#InputPanel,#inputLocation').show(); $('#modoExibicao').val("1");//cestas predefinidas
		    $("#btnExibirIntro").show();
		    $("#btnCalcular").hide();
		    $("#state").append(new Option("-- selecione --", ""));
		    getStates();
		});
		$('#btnExibir2').click(function () {
		    $('#IntroPanel').hide(); $('#InputPanel,#inputLocation').show(); $('#modoExibicao').val("2");//cesta personalizada
		    $("#btnLimparCarrinho").hide();
		    $("#btnExibirIntro").show();
		    $("#btnCalcular").hide();
		    $("#state").append(new Option("-- selecione --", ""));
		    getStates();
		});

		/// *** Cities
		$("#state").change(function () {
			var state = $("#state").val();
			if (state != "") {
				var request = $.ajax({ url: "../../../Supermercado/GetCities", type: "GET", data: { 'id': state } });
				request.done(function (data) {
					$("#city").html("");
					$("#city").append(data);
					$("#city").show();
					$("#divError").html("");
				});
				request.fail(function (jqXHR, textStatus) {
				    $("#divError").html("<pan style='display: none;'>Request failed in 'GetCities'</span>");
				    $("#divError").append(msgError);
				});
			}
			else
			{
				$("#simulator").hide();
				$("#customize").hide();
			}
		});

		/// *** Regions
		$("#city").change(function () {
			var city = $("#city").val();
			if (city != "") {
				var request = $.ajax({ url: "../../../Supermercado/GetRegions", type: "GET", data: { 'id': city } });
				request.done(function (data) {
					$("#region").html("");
					$("#region").append(data);
					$("#region").show();
					$("#divError").html("");
				});
				request.fail(function (jqXHR, textStatus) {
				    $("#divError").html("<pan style='display: none;'>Request failed in 'GetRegions'</span>");
				    $("#divError").append(msgError);
				});
			}
			else
			{
				$("#simulator").hide();
				$("#customize").hide();
			}
		});

		$("#region").change(function () {
			var region = $("#region").val();
			if (region != "")
			{
				$("#simulator").show();
				var state = $("#state").val();
				var sState = $("#state option:selected").text();
				sState = sState.toLowerCase();
				sState = sState.trim();
				if (sState == "bahia" || 
					sState == "ceará" || 
					sState == "espírito santo" || 
					sState == "goiás" || 
					sState == "maranhão" || 
					sState == "minas gerais" || 
					sState == "paraná" || 
					sState == "paraíba" || 
					sState == "pernambuco" || 
					sState == "rio de janeiro" || 
					sState == "rio grande do norte" || 
					sState == "rio grande do sul" || 
					sState == "são paulo")
				{
					$("#showRegions").show();
				}
				$("#btnCalcular").show();
			}
			else
			{
				$("#showRegions").hide();
				$("#simulator").hide();
				$("#customize").hide();
			}
		});

		$("#showRegions").click(function () {
			regionsPopUp();
		});

		/// *** Baskets (Profiles)
		var request = $.ajax({ url: "../../../Supermercado/GetBaskets", type: "GET", data: { } });
		request.done(function (data) {
			$("#basket").html("");
			$("#basket").append(data);
			$("#basket").show();
		});

		/// *** Sections
		$("#basket").change(function () {
			var basket = $("#basket").val();
			var modoExibicao = $('#modoExibicao').val();
			if (basket != "") {
				if (modoExibicao == "1")
				{
				    var request = $.ajax({ url: "../../../Supermercado/GetSections", type: "GET", data: { 'id': basket } });
					request.done(function (data) {
						$("#content_section").html("");
						$("#content_section").append(data);
						$("#content_section").show();
						$("#divError").html("");
					});
					request.fail(function (jqXHR, textStatus) {
					    $("#divError").html("<pan style='display: none;'>Request failed in 'GetSections'</span>");
					    $("#divError").append(msgError);
					});
					$("#section").show();
				}
				else if (modoExibicao == "2")
				{//customized basket
				    getCategorias();
					$("#customize").show();
				}
				$("#btnCalcular").show();
			}
			else
			{
				if (modoExibicao == "1")
				{
					$("#section").hide();
				}
				else if (modoExibicao == "2")
				{//customized basket
					$("#customize").hide();
				}
				$("#btnCalcular").hide();
			}
		});
        
		/// *** Products
		$("#category").change(function () {
		    var category = $("#category").val();
		    var selectedProducts = $("#selectedProducts").val();
			if (category != "") {
			    getProducts(category, selectedProducts);
			}
		});
		
		/// *** Add product
		$('#product').change(function () {
			var category = $("#category").val();
			var product = $("#product").val();
			var selectedProducts = $("#selectedProducts").val();
			if (product == "")
			{
			    $("#divError").html("Selecione um produto.");
			}
			else if (selectedProducts.indexOf("-" + product + "-") < 0)
			{
				$("#product option[value='" + product + "']").remove();
				$("#product").val("");
			    
				selectedProducts = $("#selectedProducts").val() + "-" + product;
				$("#selectedProducts").val(selectedProducts);
				
				var request = $.ajax({ url: "../../../Supermercado/AddProducts", type: "GET", data: { 'selectedProducts': selectedProducts } });
				request.done(function (data) {
					$("#divProducts").html("");
					$("#divProducts").append(data);
					$("#divProducts").show();
					$("#btnCalcular").show();
					$("#divError").html("");
				});
				request.fail(function (jqXHR, textStatus) {
				    $("#divError").html("<pan style='display: none;'>Request failed in 'AddProducts'</span>");
				    $("#divError").append(msgError);
				});
				
				$("#btnLimparCarrinho").show();
			}
		});

        /// *** Include all products in the car
		$('#btnIncluirTudo').click(function () {
		    var request = $.ajax({ url: "../../../Supermercado/GetAllProducts", type: "GET" });
		    request.done(function (data) {
		        $("#divProducts").html("");
		        $("#divProducts").append(data);
		        $("#divProducts").show();

		        // *** List all products
		        var allProducts = "";
		        var request = $.ajax({ url: "../../../Supermercado/ListAllProducts", type: "GET", data: {} });
		        request.done(function (data) {
		            allProducts = data;
		            $("#selectedProducts").val(allProducts);
		            $("#divError").html("");
		        });
		        request.fail(function (jqXHR, textStatus) {
		            $("#divError").html("<pan style='display: none;'>Request failed in 'ListAllProducts'</span>");
		            $("#divError").append(msgError);
		        });
		        
		        $("#showAllProducts").val("1");

		        $("#product").html("");
		        $("#category").html("");
		        $('#btnIncluirTudo').hide();
		        $("#btnLimparCarrinho").show();
		        $("#btnCalcular").show();
		    });
		    request.fail(function (jqXHR, textStatus) {
		        $("#divError").html("<pan style='display: none;'>Request failed in 'GetAllProducts'</span>");
		        $("#divError").append(msgError);
		    });
		});
		
		$('#btnCalcular').click(function () {
			var state = $("#state").val();
			var city = $("#city").val();
			var region = $("#region").val();
			var basket = $("#basket").val();
			var section = $("input[name='section']:checked").val();
			var selectedProducts = $("#selectedProducts").val();
			var showAllProducts = $("#showAllProducts").val();
			var listProducts = "";
			if (state != "" && city != "" && region != "" && basket != "" && section != "") {
				var modoExibicao = $('#modoExibicao').val();
				if (modoExibicao == "2")//customized basket
				{
					section = section == undefined ? "0" : section;
					selectedProducts = selectedProducts.substr(1);
					var quantidade = selectedProducts.split('-').length;
					if (quantidade < 5) { $("#divError").html("Selecione ao menos 5 produtos."); return; }
				    
					$("input[id^='qtdProduto']").each(function () {
                        var id = this.id;
                        var parts = id.split('-');
                        id = parts[1];
                        var qtd = this.value;
					    listProducts += id + "w" + qtd + "-";
					});
					listProducts = listProducts.substr(0, listProducts.length - 1);
					$("#productsWithQuantity").val(listProducts);
				}
				var request = $.ajax({
				    url: "../../../Supermercado/GetResult", type: "GET",
				    data: {
				        'pState': state, 'pCity': city, 'pRegion': region, 'pBasket': basket, 'pSection': section,
				        'modoExibicao': modoExibicao, 'showAllProducts': showAllProducts, 'listProducts': listProducts
				    }
				});
				request.done(function (data) {
					$("#InputPanel").hide(1000);
					$("#OutputPanel").html("");
					$("#OutputPanel").append(data);
					$("#OutputPanel").show(1000);
				});
				request.fail(function (jqXHR, textStatus) {
				    $('#btnCalcular').show();
				    $("#divError").html("<pan style='display: none;'>Request failed in 'GetResult'</span>");
				    $("#divError").append(msgError);
				});
			} else {
			    $("#divError").html("Selecione o estado, cidade, região, cesta e seção.");
			}
		});
        		
		$('#btnLimparCarrinho').click(function () {
		    $("#selectedProducts").val("");
		    $("#showAllProducts").val("0");
		    $('#divProducts').html('');

		    $('#btnLimparCarrinho').hide();
		    $("#updateCarrinho").hide();
		    $('#btnIncluirTudo').show();

		    getCategorias();
		    getProducts("", "");
		});

        /// *** Do again
		$("#btnRefazer").click(function () { return; });
    });

    function getStates()
    {
    	var request = $.ajax({ url: "../../../Supermercado/GetStates", type: "GET", data: {} });
    	request.done(function (data) {
    		$("#state").html("");
    		$("#state").append(data);
    		$("#state").show();
    		$("#divError").html("");
    	});
    	request.fail(function (jqXHR, textStatus) {
    	    $("#divError").html("<pan style='display: none;'>Request failed in 'GetStates'</span>");
    	    $("#divError").append(msgError);
    	});
    }

    function getCategorias()
    {
        var request = $.ajax({ url: "../../../Supermercado/GetCategorias", type: "GET", data: {} });
        request.done(function (data) {
            $("#category").html("");
            $("#category").append(data);
            $("#category").show();
            $("#divError").html("");
        });
        request.fail(function (jqXHR, textStatus) {
            $("#divError").html("<pan style='display: none;'>Request failed in 'GetCategorias'</span>");
            $("#divError").append(msgError);
        });
    }

    function getProducts(category, selectedProducts)
    {
        if (category == "") {
            $("#product").html("");
            $('#product').append(new Option('-- selecione uma categoria --', ""));
        } else {
            var request = $.ajax({ url: "../../../Supermercado/GetProducts", type: "GET", data: { 'id': category, 'selectedProducts': selectedProducts } });
            request.done(function (data) {
                $("#product").html("");
                $("#product").append(data);
                $("#product").show();
            });
            request.fail(function (jqXHR, textStatus) {
                $("#divError").html("<pan style='display: none;'>Request failed in 'GetProducts'</span>");
                $("#divError").append(msgError);
            });
        }
    }

    function reorderOptions(nameSelect)
    {
        var options = $('#' + nameSelect + ' option');
        var arr = options.map(function (_, o) {
            return {
                t: $(o).text(),
                v: o.value
            };
        }).get();
        arr.sort(function (o1, o2) {
            return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });
        options.each(function (i, o) {
            console.log(i);
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
    }

    function preloadimages(arr)
    {
	    var newimages = [], loadedimages = 0;
	    var arr = (typeof arr != "object") ? [arr] : arr
	    function imageloadpost(src) {
	        loadedimages++;
	        $('#loadedImages').append("-" + src + "<br/>");
	    }
	    for (var i = 0; i < arr.length; i++) {
	        newimages[i] = new Image()
	        newimages[i].src = arr[i]
	        newimages[i].onload = function () {
	            imageloadpost($(this)[0].src);
	        }
	        newimages[i].onerror = function () {
	            newimages[i] = null;
	        }
	    }
    }

    function reset_simulator()
    {
        $('#IntroPanel').show(1000);
        $('#InputPanel').hide(1000);

        $('#inputLocation,#showRegions,#simulator,#section,#customize,#updateCarrinho,#btnExibirIntro,#btnCalcular,#OutputPanel').hide();

        $('#state').val(""); $('#city,#region').html(""); $('#city,#region').append(new Option('-- selecione --', "")); $('#product').append(new Option('-- selecione uma categoria --', ""));
        $('#basket').val(""); $('#content_section').html("");
    }

	function regionsPopUp()
    {
		var state = $("#state").val();
	    var city = $("#city").val();
	    var region = $("#region").val();

	    var sState = $("#state option:selected").text();
	    var sCity = $("#city option:selected").text();
	    var sRegion = $("#region option:selected").text();

	    sState = sState.toLowerCase();
	    sState = sState.trim();
	    sState = sState.toLowerCase();

	    if (sState != "bahia" &&
			sState != "ceará" &&
			sState != "espírito santo" &&
			sState != "goiás" &&
			sState != "maranhão" &&
			sState != "minas gerais" &&
			sState != "paraná" &&
			sState != "paraíba" &&
			sState != "pernambuco" &&
			sState != "rio de janeiro" &&
			sState != "rio grande do norte" &&
			sState != "rio grande do sul" &&
			sState != "são paulo")
		{
	        return;
	    }
	    else if (state != "" && city != "" && region != "")
	    {
	    	sState = sState.trim();
	    	sState = sState.replace(/ /g, "_");
	    	sState = sState.replace(/á/g, "a");
	    	sState = sState.replace(/ã/g, "a");
	    	sState = sState.replace(/é/g, "e");
	    	sState = sState.replace(/í/g, "i");
	    	sState = sState.replace(/ó/g, "o");
	    	sState = sState.replace(/ú/g, "u");
	    	sState = sState.replace(/&#225;/g, "a");
	    	sState = sState.replace(/&#227;/g, "a");
	    	sState = sState.replace(/&#233;/g, "e");
	    	sState = sState.replace(/&#237;/g, "i");
	    	sState = sState.replace(/&#243;/g, "o");
	    	sState = sState.replace(/&#250;/g, "u");

	    	var table = $('#table_state_' + sState).tableToJSON();

	        var filter = "";
	        for (var i = 0; i < table.length; i++) { //table[i].Regiao
	            if (sRegion.indexOf(table[i].Regiao) >= 0) {
	                filter += table[i].Bairro + "<br/>";
	            } else if (table[i].Regiao.indexOf(sRegion) >= 0) {
	            	filter += table[i].Bairro + "<br/>";
	            }
	        }
	        
	        $("#outputBairros").html(filter);
	        $("#outputBairros").dialog({ autoOpen: false, height: 400, width: 600, position: 'center', resizable: false, closeOnEscape: true });
	        $("#outputBairros").dialog("option", "title", "Bairros");
	        $("#outputBairros").dialog("open");
	    }
	}

	function showMap(latitude, longitude, supermarket, userAddress, website, phone, city, state)
	{
		if (latitude == "0" && longitude == "0")
		{
			$("#map").attr("style", "width:300px; height:150px; display: none; text-align: center;");
			$("#map").html("<b>Este supermercado não tem localização.</b>");
			$("#map").dialog({
				title: supermarket + " (" + userAddress + ")",
				autoOpen: false,
				height: 400,
				width: 600,
				resizable: false
			});
			$("#map").dialog("open");
			$("#map").show();
			return;
		}
		var contentString = '<div><h2>' + supermarket + '</h2><p>' + userAddress + '</p>';
		if (website != "")
			contentString += '<p><a href="' + website + '">' + website + '</p>';
		if (phone != "")
			contentString += '<p>Telefone: ' + phone + '</p>';
		contentString += '</div>';

		var markerPosition = new google.maps.LatLng(latitude, longitude);

		var map = new google.maps.Map(document.getElementById("map"), {
			zoom: 14,
			center: markerPosition,
			mapTypeId: google.maps.MapTypeId['ROADMAP']
		});
		//map.panTo(markerPosition);//NOT IN USE
		var googleAddress = userAddress + ", " + city + " - " + state + " - Brasil";
		new google.maps.Geocoder().geocode({ address: googleAddress }, function (response, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var best = response[0].geometry.location;
				map.panTo(best);
				map.setCenter(best);
			}
		});

		var marker = new google.maps.Marker({
			map: map,
			position: markerPosition,
			icon: "/Content/EmbeddedCalculators/Supermercado/supermarket.png",
			title: supermarket + ": " + userAddress,
			content: contentString
		});

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(map, this);
		});
		
		$("#map").dialog({
			title: supermarket + " (" + userAddress + ")",
			autoOpen: false,
			height: 400,
			width: 600,
			resizable: false
		});
		$("#map").attr("style", "width:400px; height:400px; display: none; text-align: center;");
		$("#map").dialog("open");
		$("#map").show();

		google.maps.event.trigger(map, "resize");//THIS IS IMPORTANT!
	}

	function show_servicos_diferenciados(state)
	{
	    state = state.toLowerCase();
	    state = state.trim();
	    state = state.replace(/ /g, "_");
	    state = state.replace(/á/g, "a");
	    state = state.replace(/ã/g, "a");
	    state = state.replace(/é/g, "e");
	    state = state.replace(/í/g, "i");
	    state = state.replace(/ó/g, "o");
	    state = state.replace(/ú/g, "u");
	    state = state.replace(/&#225;/g, "a");
	    state = state.replace(/&#227;/g, "a");
	    state = state.replace(/&#233;/g, "e");
	    state = state.replace(/&#237;/g, "i");
	    state = state.replace(/&#243;/g, "o");
	    state = state.replace(/&#250;/g, "u");
	    
	    $('#domicilio #bahia').hide();
	    $('#domicilio #ceara').hide();
	    $('#domicilio #espirito_santo').hide();
	    $('#domicilio #goias').hide();
	    $('#domicilio #bahia').hide();
	    $('#domicilio #maranhao').hide();
	    $('#domicilio #minas_gerais').hide();
	    $('#domicilio #paraiba').hide();
	    $('#domicilio #parana').hide();
	    $('#domicilio #pernambuco').hide();
	    $('#domicilio #rio_de_janeiro').hide();
	    $('#domicilio #rio_grande_do_norte').hide();
	    $('#domicilio #rio_grande_do_sul').hide();
	    $('#domicilio #santa_catarina').hide();
	    $('#domicilio #sao_paulo').hide();
	    $('#domicilio #total').hide();

	    $('#telefone #bahia').hide();
	    $('#telefone #ceara').hide();
	    $('#telefone #espirito_santo').hide();
	    $('#telefone #goias').hide();
	    $('#telefone #bahia').hide();
	    $('#telefone #maranhao').hide();
	    $('#telefone #minas_gerais').hide();
	    $('#telefone #paraiba').hide();
	    $('#telefone #parana').hide();
	    $('#telefone #pernambuco').hide();
	    $('#telefone #rio_de_janeiro').hide();
	    $('#telefone #rio_grande_do_norte').hide();
	    $('#telefone #rio_grande_do_sul').hide();
	    $('#telefone #santa_catarina').hide();
	    $('#telefone #sao_paulo').hide();
	    $('#telefone #total').hide();

	    $('#t24horas #bahia').hide();
	    $('#t24horas #ceara').hide();
	    $('#t24horas #espirito_santo').hide();
	    $('#t24horas #goias').hide();
	    $('#t24horas #bahia').hide();
	    $('#t24horas #maranhao').hide();
	    $('#t24horas #minas_gerais').hide();
	    $('#t24horas #paraiba').hide();
	    $('#t24horas #parana').hide();
	    $('#t24horas #pernambuco').hide();
	    $('#t24horas #rio_de_janeiro').hide();
	    $('#t24horas #rio_grande_do_norte').hide();
	    $('#t24horas #rio_grande_do_sul').hide();
	    $('#t24horas #santa_catarina').hide();
	    $('#t24horas #sao_paulo').hide();
	    $('#t24horas #total').hide();

	    $('#domicilio #' + state).show();
	    $('#telefone #' + state).show();
	    $('#t24horas #' + state).show();
	}

	function show_servicos_diferenciados_por_estado(state)
	{
		state = state.toLowerCase();
		state = state.trim();
		state = state.replace(/ /g, "_");
		state = state.replace(/á/g, "a");
		state = state.replace(/ã/g, "a");
		state = state.replace(/é/g, "e");
		state = state.replace(/í/g, "i");
		state = state.replace(/ó/g, "o");
		state = state.replace(/ú/g, "u");
		state = state.replace(/&#225;/g, "a");
		state = state.replace(/&#227;/g, "a");
		state = state.replace(/&#233;/g, "e");
		state = state.replace(/&#237;/g, "i");
		state = state.replace(/&#243;/g, "o");
		state = state.replace(/&#250;/g, "u");

		$('#empty_data').hide();
		$('#bahia').hide();
		$('#ceara').hide();
		$('#distrito_federal').hide();
		$('#espirito_santo').hide();
		$('#goias').hide();
		$('#maranhao').hide();
		$('#minas_gerais').hide();
		$('#paraiba').hide();
		$('#parana').hide();
		$('#pernambuco').hide();
		$('#rio_de_janeiro').hide();
		$('#rio_grande_do_norte').hide();
		$('#rio_grande_do_sul').hide();
		$('#santa_catarina').hide();
		$('#sao_paulo').hide();

		if (state != "bahia" &&
			state != "ceara" &&
			state != "distrito_federal" &&
			state != "espirito_santoo" &&
			state != "goias" &&
			state != "maranhao" &&
			state != "minas_gerais" &&
			state != "paraiba" &&
			state != "parana" &&
			state != "pernambuco" &&
			state != "rio_de_janeiro" &&
			state != "rio_grande_do_norte" &&
			state != "rio_grande_do_sul" &&
			state != "santa_catarina" &&
			state != "sao_paulo")
		{
			$("#empty_data").show();
		}
		else
		{
			$("#" + state).show();
		}
		
	}

	function hide_headers_state()
    {
		$("table[id^='header_state']").hide();
		$("table[id^='table_state']").hide();
	}

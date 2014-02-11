(function($) {
	jQuery.ImagePreview = function(_containerImg, _uploader, _options) {

		this.uploader = _uploader;
		this.containerImg = _containerImg;

		this.largura = null;
		this.altura = null;
		this.extensao = null;
		this.tipo = null;
		this.tamanho = null;

		var options = {
			'larguraPadrao': 320,
			'alturaPadrao': 240,
			'callBackFunc': '',
			'legendaContainer': ''
		};

		var contexto = this;

		if (_options) {
			$.extend(options, _options);
		}

		//Funções
		var UploadImage = function() {

			if (contexto.uploader.files && contexto.uploader.files[0]) {

				var reader = new FileReader();

				reader.onload = function(e) {
					$(contexto.containerImg).attr('src', e.target.result);
				};

				reader.readAsDataURL(contexto.uploader.files[0]);

			}
		};

		var ObterDimensoes = function() {
			contexto.largura = " Largura: " + $(contexto.containerImg).css('width') + " ";
			contexto.altura = "Altura: " + $(contexto.containerImg).css('height') + " ";
		};

		var ObterExtensao = function() {
			contexto.extensao = ' Extension: .' + contexto.uploader.files[0].name.split('.').pop() + " ";
		};

		var ObterTamanho = function() {
			var tamanho = contexto.uploader.files[0].size / 1024;

			var retorno = null;

			if (tamanho / 1024 > 1) {
				if (((tamanho / 1024) / 1024) > 1) {
					tamanho = (Math.round(((tamanho / 1024) / 1024) * 100) / 100);
					retorno = 'Size: ' + tamanho + 'Gb';
				} else {
					tamanho = (Math.round((tamanho / 1024) * 100) / 100);
					retorno = 'Size: ' + tamanho + 'Mb';
				}
			} else {
				tamanho = (Math.round(tamanho * 100) / 100);
				retorno = ' Size: ' + tamanho + 'Kb ';
			}


			contexto.tamanho = retorno;
		};

		var ObterTipo = function() {

			var caminho = $(contexto.containerImg).attr('src').toString();
			var indice = caminho.indexOf('/');
			var formato = caminho.substring(indice + 1, indice + 5);

			contexto.tipo = formato;
		};

		var ConfigImageSize = function() {
			$(contexto.containerImg).width(options.larguraPadrao);
			$(contexto.containerImg).height(options.alturaPadrao);
		};

		var ExibirInfoImagem = function() {

			//verificando se existe um container para armazenar as informações
			if (options.legendaContainer) {

				var qtdItensLegenda = options.legendaContainer.length;//Quantidade de containers para armazenar as legendas(usar span de preferência, ou qualquer elemento que use jQuery.text()).

				var infoImagem = [contexto.largura, contexto.altura, contexto.extensao, contexto.tamanho];//As informações coletadas sobre a imagem.

				var itensPorLegenda = parseInt(infoImagem.length / qtdItensLegenda); //Quantidade de informações que serão guardadas em cada legenda.

				var itensSobra = parseInt(infoImagem.length % qtdItensLegenda);//resto da divisão das informações pela quantidade de containers de legenda disponpiveis.

				var ultimaPosicao = 0;


				//Guardando as informações em cada legenda.
				for (var i = 0; i < qtdItensLegenda; i++) {
					var conteudo = '';

					for (var j = 0; j < itensPorLegenda; j++) {
						conteudo += infoImagem[ultimaPosicao];
						ultimaPosicao++;
					};

					var legenda = $(options.legendaContainer)[i];

					$(legenda).text(conteudo);

				};

				//Guardando as informações que sobraram na última legenda.
				if (itensSobra > 0) {

					var conteudoSobra = '';

					for (var k = 0; k < itensSobra; k++) {
						conteudoSobra += infoImagem[ultimaPosicao];
					};

					var legenda = $(options.legendaContainer)[qtdItensLegenda -1];

					var ultimoConteudo = $(legenda).text();

					ultimoConteudo += " " + conteudoSobra;

					$(legenda).text(ultimoConteudo);
				}
			}else{
				console.log("Nenhum container para legendas encontrado.");
			}
		};

		//Eventos
		$(this.uploader).change(function() {
			UploadImage();

			$(contexto.containerImg).load(function() {
				ObterDimensoes();
				ObterExtensao();
				ObterTamanho();
				ConfigImageSize();
				if (options.legendaContainer)
					ExibirInfoImagem();
			});

			//se o usuário desejar realizar alguma tarefa após o upload da imagem.. 
			if (options.callBackFunc)
				options.callBackFunc();
		});
	};
})(jQuery);
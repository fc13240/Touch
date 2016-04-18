$(function() {
	var Loading = Util.Loading;
	var $terrain_wrap = $('#terrain_wrap');

	var _inited = false;
	function _show() {
		$terrain_wrap.show();
		Loading.hide();
	}
	window.Terrain = {
		init: function() {
			Loading.deal();
			if (!_inited) {
				var width = window.innerWidth,
					height = window.innerHeight;

				var scene = new THREE.Scene();
				scene.add(new THREE.AmbientLight(0xeeeeee));

				var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
				camera.position.set(0, -30, 30);

				var renderer = new THREE.WebGLRenderer();
				renderer.setSize(width, height);

				var terrainLoader = new THREE.TerrainLoader();
				terrainLoader.load('./js/3d/jotunheimen.bin', function(data) {

					var geometry = new THREE.PlaneGeometry(60, 60, 199, 199);

					for (var i = 0, l = geometry.vertices.length; i < l; i++) {
						geometry.vertices[i].z = data[i] / 65535 * 5;
					}

					var material = new THREE.MeshPhongMaterial({
						map: THREE.ImageUtils.loadTexture('./js/3d/jotunheimen-texture.jpg')
					});

					var plane = new THREE.Mesh(geometry, material);
					scene.add(plane);

					_show();
				});

				var controls = new THREE.TrackballControls(camera, $terrain_wrap.get(0));

				$terrain_wrap.append(renderer.domElement);
				// document.getElementById('terrain_wrap').appendChild(renderer.domElement);
				_inited = true;

				render();

				function render() {
					controls.update();
					requestAnimationFrame(render);
					renderer.render(scene, camera);
				}
			} else {
				_show();
			}
		},
		clear: function() {
			$terrain_wrap.hide();
		}
	}
})
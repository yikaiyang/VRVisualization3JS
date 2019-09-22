AFRAME.registerComponent('vr-entry-manager', {
	schema: {
		
	},

	init: function () {
	 	/* el.sceneEl.addEventListener('enter-vr', () => {
			if (!AFRAME.utils.device.checkHeadsetConnected() &&
				!AFRAME.utils.device.isMobile()) { return; }
			this.controls.enabled = false;
			if (el.hasAttribute('look-controls')) {
				el.setAttribute('look-controls', 'enabled', true);
				oldPosition.copy(camera.position);
				//camera.position.set(oldPosition.x, oldPosition.y, oldPosition.z);
				rig.object3D.position.set(oldPosition.x, oldPosition.y, oldPosition.z);
				console.log('camera: ' + camera);
			}
		});

		el.sceneEl.addEventListener('exit-vr', () => {
			if (!AFRAME.utils.device.checkHeadsetConnected() &&
				!AFRAME.utils.device.isMobile()) { return; }
			this.controls.enabled = true;
			el.getObject3D('camera').position.copy(oldPosition);
			rig.object3D.position.set(0,0,0);
			if (el.hasAttribute('look-controls')) {
				el.setAttribute('look-controls', 'enabled', false);
			}
		}); 
 */
	},

	update: function (oldData) {
	},

	tick: function () {
	}
});
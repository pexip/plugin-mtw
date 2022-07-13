// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {
  let state$ = PEX.pluginAPI.createNewState({});
	let vmr;

  // Called by the PluginService when plugin is loaded
  function load(participants$, conferenceDetails$) {

  	window.PEX.actions$.ofType('[Conference] Connect Success').subscribe(action => {
      vmr = action.payload.alias;
    });

    participants$.subscribe(participants => {

      let state;
      participants.map(participant => {
        if (participant.canTransfer === true && (participant.protocol == "api" || participant.protocol == "webrtc")) {
          state = {
            [participant.uuid]: {icon: "assets/images/grid.svg#grid", label: "Move to waiting screen"}, icon: "assets/images/grid.svg#grid"
          }
        } else {
            state = {
              [participant.uuid]: {icon: null, label: null}, icon: null, label: null
            }
        }
      });

      if (state) {
        state$.next(state);
      }

    });
  }

  // Item click functions
  function movetoWaiting(participant) {
    const text_data = {"conference_alias": vmr, "role": "guest", "pin": ""};

    if (participant.canTransfer === true && (participant.protocol == "api" || participant.protocol == "webrtc")) {
      PEX.pluginAPI.sendRequest("participants/" + participant.uuid + "/transfer", text_data);
    }
  }

  // Unload / cleanup function
  function unload() {
    // Clean up any globals or other cruft before being removed before I get killed.
    console.log('unload mtw-plugin');
  }

  // Register our plugin with the PluginService - make sure id matches your package.json
  PEX.pluginAPI.registerPlugin({
    id: 'mtw-plugin-1.0',
    load: load,
    unload: unload,
    movetoWaiting: movetoWaiting,
    state$: state$
  });
})(); // End IIFE

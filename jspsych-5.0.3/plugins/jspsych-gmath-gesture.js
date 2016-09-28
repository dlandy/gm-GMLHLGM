/** js-psych-gm-solve-eq.js
 *  David Brokaw
 *
 * 	This plugin presents a non-interactible Grasping Math equation and the
 * 	user must enter the value of the variable in the text box.
 *
 * 	Parameters:
 * 		type: "gm-solve-eq"
 * 		problems: a list of objects containing:
 * 		  equation: the ascii or latex representations of a GM equation
 * 		  variable: a string, the variable to be solved for
 * 		  sol: a string, the value of the variable to be solved
 * 		timing_post_trial: an array with a single element representing the time
 * 			in milliseconds to delay after a completed problem until the next
 */

	jsPsych.plugins["gmath-gesture"] = (function() {

		var plugin = {};

    // in create: save_trial, timing_post_trial, progress_fn, eq, var, sol, stage, task_id, data
    // data: time_to_action : null, time_to_submit : null, userInput : null, accuracy : false, task_id: trial.task_id

		plugin.trial = function(display_element, trial) {
			var d3_display_element = d3.select(display_element[0]);
			var container = d3_display_element.append('div').attr('id', 'gesture-trial-container');

			var trial_index = jsPsych.data.getLastTrialData().trial_index;
			gmath.TrialLogger.startTrial(trial_index, trial);

      var canvas_opts = { vertical_scroll: false
                        , log_mouse_trajectories: true
                        , disable_ga_tracking: true
                        , use_keyboard: false
                        , use_hold_menu: false
                        , insert_btn: false
                        , formula_btn: false
                        , homework_btn: false
                        , mode_btns: true
                        , mode_btns: false // [ {type: 'radio', group: 'mode', state: true,  label: 'transform', icon: 'glyphicon glyphicon-random'}
                        						 // , {type: 'radio', group: 'mode', state: false, label: 'arrange', icon: 'glyphicon glyphicon-move'} ]
                        , undo_btn: false
                        , redo_btn: false
                        , saving_and_loading: false
                        , font_smaller_btn: false
                        , font_larger_btn: false
                        , hwr_btn: false
                        , drawing: false
                        , hwr: false
                        , draw_btns: false
                        , share_btn: false
                        , fullscreen_btn: false
                        , toolbar_pos: 'top'
                        , reset_btn: false
                        , help_btn: false };

      var derivation_opts = { collapsed_mode: true
                            , cloning_on: false
														, draggable: false
                            , bg_rect_active_style: { fill: 'none', stroke: 'none' }
                            , bg_rect_hovering_style: { fill: 'none', stroke: 'none' }
                            , keep_in_container: false };
      if (trial.gravity) derivation_opts.gravity = true;

      var div = container.append('div');

      div.append('p').style({color :'#666', margin: '20px auto', 'font-size': '20px'})
        .text(trial.instructions);

      var gm_container = div.append('div').classed('gm-container', true);
      var canvas = new gmath.ui.CanvasFactory(gm_container.node(), canvas_opts);
      // FIXME: For some reason the svg within the canvas (deprecated, for the most part) has an altered position within the canvases on this page.
      // This is producing a horizontal scroll bar.  Removing SVGs here to prevent that.
      div.select('.gm-canvas').select('.gm-canvas-svg').remove();

      derivation_opts.eq = trial.expression;
      derivation_opts.pos = {x: 'center', y: 'center'};
      derivation_opts.v_align = 'center';
      var derivation = canvas.model.createDL(derivation_opts, function(dl) { dl.applyViewAlignment() });
      var eoi_callback = function() {
        derivation.getLastView().interactive(false);
        derivation.events.on('added_line.jspsych', null);
        derivation.getLastModel().events.on('end-of-interaction.jspsych', null);
				gmath.TrialLogger.setCustomFields({ user_solution: derivation.getLastModel().to_ascii() })
        setTimeout(function() {
          display_element.html('');
          jsPsych.finishTrial({});
        }, trial.timing_post_interaction);
      };

      derivation.getLastModel().events.on('end-of-interaction.jspsych', eoi_callback);
      derivation.events.on('added_line.jspsych', function() {
        derivation.getLastModel().events.on('end-of-interaction.jspsych', eoi_callback);
      });

			if (trial.show_target) {
				var target_div = container.append('div')
					.style('float', 'right')
					.style('margin-top', '10px');
				target_div.append('div')
					.style('float', 'left')
					.style('margin-right', '10px')
					.style('font-size', '24px')
					.text('target: ');
				var svg = target_div.append('svg')
					.style('width', '100%')
					.style('overflow', 'visible')
					.style('margin-left', '0.5em')
					.style('display', 'inline-block')
					.style('visibility', 'hidden');
				var font_size = 36;

				var model = new gmath.AlgebraModel(trial.target)
  			var view = new gmath.AlgebraView(model, svg, {interactive: false, inactive_color: '#000000', font_size: font_size, v_align: 'alphabetic', h_align: 'left' });

				var resize_svg = function() {
			    var view_bbox = view.getBBox();
			    svg
			      .style('height', view_bbox.height)
			      .style('width', view_bbox.width);
			    view.main.attr('transform', 'translate('+[0, view_bbox.height]+')');
		      svg.style('margin-bottom', view_bbox.height - model.children[0].ascent + 'px');
			  }

			  view.init(function() {
			    resize_svg();
			    var view_bbox = view.getBBox();
			    setTimeout(function() {
			      var svg_w = svg.node().parentNode.clientWidth
			        , view_w = view_bbox.width;
			      if (view_w > 0.9*svg_w) {
			        view.options.font_size *= 0.9 * svg_w / view_w;
			        view.update_all(true);
			        resize_svg();
			      }
			      svg.style('visibility', null);
			    }, 1);
				});
			}
		};

		return plugin;
})();

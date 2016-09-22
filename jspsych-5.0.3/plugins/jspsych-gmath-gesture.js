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

			var container = d3_display_element.append('div').attr('id', 'container');
      var eq = appendEqAndMakeGMExpr();
			// appendSubmissionBoxAndButton();
			// addEventListeners();

			var startTime = Date.now();

			function appendEqAndMakeGMExpr() {
        var canvas_opts = { vertical_scroll: false
                          , log_mouse_trajectories: false
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
                                , bg_rect_active_style: { fill: 'none', stroke: 'none' }
                                , bg_rect_hovering_style: { fill: 'none', stroke: 'none' }
                                , keep_in_container: false };
          if (trial.gravity) derivation_opts.gravity = true;

          console.log(d3_display_element, container, trial);

          var div = container.append('div');

          div.append('p').style({color :'#666', margin: '20px auto', 'font-size': '20px'})
            .text(trial.instructions);

          var gm_container = div.append('div').classed('gm-container', true);
          var canvas = new gmath.ui.CanvasFactory(gm_container.node(), canvas_opts);

          derivation_opts.eq = trial.expr;
          derivation_opts.pos = {x: 'center', y: 'center'};
          derivation_opts.v_align = 'center';
          var derivation = canvas.model.createDL(derivation_opts, function(dl) { dl.applyViewAlignment() });
          var eoi_callback = function() {
            derivation.getLastView().interactive(false);
            derivation.events.on('added_line.jspsych', null);
            derivation.getLastModel().events.on('end-of-interaction.jspsych', null);
            setTimeout(function() {
              display_element.html('');
              jsPsych.finishTrial({});
            }, 5000);
          };

          derivation.getLastModel().events.on('end-of-interaction.jspsych', eoi_callback);
          derivation.events.on('added_line.jspsych', function() {
            derivation.getLastModel().events.on('end-of-interaction.jspsych', eoi_callback);
          });
          //
          // // FIXME: For some reason the svg within the canvas (deprecated, for the most part) has an altered position within the canvases on this page.
          // // This is producing a horizontal scroll bar.  Removing SVGs here to prevent that.
          div.select('.gm-canvas').select('.gm-canvas-svg').remove();
          //
          // setTimeout(function() {
          //   display_element.html('');
          //   jsPsych.finishTrial({})
          // }, 10000);

				// return DerivationList.createStandalone(div.node(), {eq: equation, interactive:false});
			}
		};

		return plugin;
})();

// var canvas_opts = (function init_canvas_options(condition) {
//     var opts = { vertical_scroll: false
//                , log_mouse_trajectories: false
//                , disable_ga_tracking: true
//                , use_keyboard: true
//                , use_hold_menu: false
//                , insert_btn: false
//                , formula_btn: false
//                , homework_btn: false
//                , mode_btns: true
//                , mode_btns: [ {type: 'radio', group: 'mode', state: true,  label: 'transform', icon: 'glyphicon glyphicon-random'}
//                						  , {type: 'radio', group: 'mode', state: false, label: 'arrange', icon: 'glyphicon glyphicon-move'} ]
//                , saving_and_loading: false
//                , font_smaller_btn: false
//                , font_larger_btn: false
//                , hwr_btn: false
//                , drawing: false
//                , hwr: false
//                , draw_btns: false
//                , share_btn: false
//                , fullscreen_btn: false
//                , toolbar_pos: 'top'
//                , reset_btn: false
//                , help_btn: false };
//     if (condition === PP_COND) opts.use_toolbar = false;
//     return opts;
//   })(condition);
//   var derivation_opts = (function init_derivation_options(condition) {
//     var opts = { collapsed_mode: true
//                , cloning_on: false
//                , bg_rect_active_style: { fill: 'none', stroke: 'none' }
//                , bg_rect_hovering_style: { fill: 'none', stroke: 'none' }
//                , keep_in_container: false
//               }
//     if (condition === PP_COND) {
//       opts.draggable = false; opts.interactive = false;
//     }
//     return opts;
//   })(condition);
//   d3.select('#user_name').text(function(){ return user; });
//   d3.select('#user-field').style('color', {'GM': 'steelblue', 'PP': 'rgb(180,70,70)'}[condition]);
//   var sel = d3.select('div.carousel-inner')
//     .selectAll('div.item')
//     .data(set.tasks);
//   var div = sel.enter()
//     .append('div')
//     .attr('class', function(d,i) { return i===0 ? 'item active' : 'item'});
//   div.append('p').style({color :'#666', margin: '20px auto', 'font-size': '20px'})
//   .text(condition === GM_COND
//       ? "Interact with the expression below to simplify or solve it."
//       : "Use pen and paper to simplify or solve the expression below.");
//   div.append('div').classed('gm-container', true)
//   .each(function(d,i) {
//     var canvas = new gmath.ui.CanvasFactory(this, canvas_opts);
//     d.canvas = canvas;
//     d.opts = derivation_opts;
//     if (condition === GM_COND) add_reset_button_to_toolbar(d, derivation_opts);
//     init_canvas_height(this, d.eqs.length);
//     if (i===0) init_derivations(d, d.opts);
//     canvas.events.on('button.race', function(evt) {
//       if (['reset', 'undo', 'redo'].indexOf(evt.button.label) !== -1) canvas.logger.logCustomInteraction(evt.button.label, gmath.TrialLogger.trial);
//     })
//   });
//   // FIXME: For some reason the svg within the canvas (deprecated, for the most part) has an altered position within the canvases on this page.
//   // This is producing a horizontal scroll bar.  Removing SVGs here to prevent that.
//   div.select('.gm-canvas').select('.gm-canvas-svg').remove();
//   var change_dl = div.append('div')
//     .each(function(d) { d.change_dl = this; });
//   var submit_div = init_submit_form(div);
//   d3.select('.right.carousel-control').on('click', function() {
//     var current_index = $('.carousel-indicators li.active').index();
//     $("#myCarousel").carousel(get_next_idx(current_index));
//   });
//   $('#myCarousel').on('slide.bs.carousel', function (event) {
//     cancel_slide_timer();
//     pause_task(current_task);
//   });
//   $('#myCarousel').on('slid.bs.carousel', function (event) {
//     var idx = $('.carousel-indicators li.active').index()
//       , task = set.tasks[idx];
//     resume_task(task);
//     if (!task.derivations) init_derivations(task, task.opts);
//     d3.select('#task-id').text(idx+1);
//     task.input_els[0].focus();
//   });

// function init_derivations(canvas_div_data, options) {
//   var derivations = []
//     , canvas = canvas_div_data.canvas
//     , cmodel = canvas.model
//     , height = cmodel.size().height;
//   for (var i=0; i<canvas_div_data.eqs.length; i++) {
//     var eq = canvas_div_data.eqs[i]
//       , pos = {x: 'center', y: (i+1) * height/(canvas_div_data.eqs.length+1) - 30}
//       , opts = gmath.extend({ eq: canvas_div_data.eqs[i], pos: pos, v_align: 'center'}, options);
//     derivations.push(cmodel.createDL(opts, function(dl) {
//       dl.applyViewAlignment();
//     }));
//   }
//   canvas_div_data.canvas.controller.clearInteractionTimeline();
//   canvas_div_data.derivations = derivations;
// }

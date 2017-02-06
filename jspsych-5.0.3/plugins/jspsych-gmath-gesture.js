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

			d3.select('body').append('span').attr('id', 'participant_id')
				.text(trial.subject_id);

			var container = d3_display_element.append('div').attr('id', 'gesture-trial-container');



      if (typeof trial.rows == 'undefined') {
        trial.rows = [];
        for (var i = 0; i < trial.questions.length; i++) {
          trial.rows.push(1);
        }
      }
      if (typeof trial.columns == 'undefined') {
        trial.columns = [];
        for (var i = 0; i < trial.questions.length; i++) {
          trial.columns.push(40);
        }
      }




			//gmath.TrialLogger.startTrial(jsPsych.progress().current_trial_global+1, trial);
			//console.log(gmath.DataLogger.interaction_id)
			// console.log(gmath.TrialLogger.trial);

      var canvas_opts = { vertical_scroll: false
                        , log_mouse_trajectories: true
                        , disable_ga_tracking: true
                        , use_keyboard: false
                        , use_hold_menu: false
                        , insert_btn: false
                        , formula_btn: false
                        , homework_btn: false

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
                            , no_handles: true
                            , bg_rect_active_style: { fill: 'none', stroke: 'none' }
                            , bg_rect_hovering_style: { fill: 'none', stroke: 'none' }
                            , keep_in_container: false };
      if (trial.gravity) {
      	derivation_opts.gravity = true;
      	// disable tap actions
      	derivation_opts.action_blacklist = ['FractionMagSimplificationAction', 'MultiplyNumbersAction', 'AddSubNumbersAction'];
      }

      var div = container.append('div');

			div.append('p')
					.classed('show_me', true)
					.style({color :'#666', margin: '20px auto', 'font-size': '24px', 'visibility': 'hidden'})
        	.text(trial.instructions)
        .append('div')
        	.classed('show_me', true)
					.style({'font-size': '18px', 'text-align': 'center', 'visibility': 'hidden'})
          .style('background-color', trial.gravity ? null : 'rgba(70, 130, 180, 0.33)')
          .append('span')
				//	.text(trial.gravity ? 'static' : 'interactive')
          .text('')
					.style('color', 'gray');

			// show instructions, then show other content

			var gm_container = div.append('div').classed('gm-container', true).style('position', 'relative');

      var canvas = new gmath.Canvas(gm_container.node(), canvas_opts);
      // FIXME: For some reason the svg within the canvas (deprecated, for the most part) has an altered position within the canvases on this page.
      // This is producing a horizontal scroll bar.  Removing SVGs here to prevent that.
      div.select('.gm-canvas').selectAll('svg').style('left', '0px');
      div.select('.gm-canvas').append('div')
        .style({ 'position': 'absolute'
               , 'width': '100%'
               , 'height': '100%' })
        .classed('remove_me', true);

      derivation_opts.eq = trial.expression;
      derivation_opts.pos = {x: 'center', y: 'center'};
      derivation_opts.v_align = 'center';
      var derivation = canvas.model.createDL(derivation_opts, function(dl) { dl.applyViewAlignment() });
      var eoi_callback = function() {
        //derivation.getLastView().interactive(false);
        derivation.events.on('added_line.jspsych', null);
        derivation.getLastModel().events.on('end-of-interaction.jspsych', null);
			//	gmath.TrialLogger.setCustomFields({ user_solution: derivation.getLastModel().to_ascii() })
			//	gmath.TrialLogger.endTrial();

      };

      derivation.getLastModel().events.on('end-of-interaction.jspsych', eoi_callback);
      derivation.events.on('added_line.jspsych', function() {
        derivation.getLastModel().events.on('end-of-interaction.jspsych', eoi_callback);
      });

			var condition_div = container.append('div')
				.style('float', 'right')
				.style('margin-top', '10px');

			if (trial.show_target) {
				var target_div = container.append('div')
					.style('float', 'right')
					.style('margin-top', '10px')
					.style('visibility', 'hidden');
				target_div.append('div')
					.style('margin-right', '10px')
					.style('font-size', '24px')
					.style('vertical-align', 'top')
					.text('target: ');

				var target_algebra_div = target_div.append('div')
					.style('display', 'inline-block')

				var div = target_algebra_div.append('div')
					.style('width', '100%')
					.style('overflow', 'visible')
					.style('visibility', 'hidden');

				var font_size = 36;

				var model = new gmath.AlgebraModel(trial.target)
  			var view = new gmath.AlgebraView( model
  				                              , div.node()
  				                              , { interactive: false
  				                              	, inactive_color: '#000000'
  				                              	, font_size: font_size
  				                              	, v_align: 'alphabetic'
  				                              	, h_align: 'left' }
  				                              , function() {
			    setTimeout(function() {
		        resize_target_algebra_div();
			      div.style('visibility', null);
			    }, 1);
				});

				var resize_target_algebra_div = function() {
			    var view_bbox = view.getBBox();
			    target_algebra_div
			      .style('height', view_bbox.height+'px')
			      .style('width', view_bbox.width+'px');
			    view.main.style('transform', 'translate(0px,'+view_bbox.height+'px)');
			  }
			}

 // add questions
      unhide = function(d){
        $('#jspsych-survey-text-next')[0].hidden=false;
      }

    for (var i = 0; i < trial.questions.length; i++) {
      // create div
      display_element.append($('<div>', {
        "id": 'jspsych-survey-text-' + i,
        "class": 'jspsych-survey-text-question',
        "onchange" : "unhide()"
      }));


      // // add question text
      // $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');

      // // add text box
      // $("#jspsych-survey-text-" + i).append('<input type="numeric" name="jspsych-survey-text-response-' + i + '" id="jspsych-survey-text-response-' + i + '" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></input>');
    }

  // add mode button
  if (!trial.review) {
    display_element.append($('<button>', {
        'id': 'jspsych-survey-text-draw',
        'class': 'jspsych-btn' // jspsych-survey-text'
      }));
    $("#jspsych-survey-text-draw").html('Write your answer!');
  }


   // add submit button
    display_element.append($('<button>', {
      'id': 'jspsych-survey-text-next',
      'class': 'jspsych-btn' //jspsych-survey-text'
    }));
    $("#jspsych-survey-text-next").html('Submit Answer');
console.log(trial)
console.log(trial.answer)
    if(trial.answer && trial.answer=="none"){
      console.log('yes')
      $('#jspsych-survey-text-0')[0].hidden=true

      $('#jspsych-survey-text-response-0')[0].hidden=true
    } else if (!trial.review) {
      console.log('no')
      $('#jspsych-survey-text-next')[0].hidden=true
    }
    $("#jspsych-survey-text-next").click(function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      if (!trial.review) {
        paths.push(canvas.model.paths());
      } else {
        paths[jsPsych.progress().current_trial_global-6] = canvas.model.paths();
      }

      // create object to hold responses
      var question_data = {};
      $("div.jspsych-survey-text-question").each(function(index) {
        var id = "Q" + index;
        var val = $(this).children('textarea').val();
        var obje = {};
        obje[id] = val;
        $.extend(question_data, obje);
      });

      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.html('');

      //gmath.TrialLogger.setCustomFields({ user_solution: JSON.stringify(question_data), "rt": response_time })
     // gmath.TrialLogger.setCustomFields()
      // next trial
      jsPsych.finishTrial(trialdata);
    });

   $("#jspsych-survey-text-draw").click(function() {
     canvas.model.setMode('draw');
     unhide();
   });

   if (trial.review) {
    canvas.model.paths(paths[jsPsych.progress().current_trial_global-6]);
    canvas.model.setMode('draw');
   }


			setTimeout(function() {
        d3.selectAll('.math div.text').style('user-select', 'none');
				d3.selectAll('.show_me').style('visibility', null);
				if (trial.show_target) target_div.style('visibility', null);
        d3.selectAll('.remove_me').remove();
			}, 000);
    var startTime = (new Date()).getTime();

		};





		return plugin;
})();

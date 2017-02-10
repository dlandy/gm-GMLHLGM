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

	plugin.trial = function(container, trial) {
		var d3_display_element = d3.select(display_element[0]);

		d3.select('body').append('span').attr('id', 'participant_id')
			.text(trial.subject_id);

		var container = d3_display_element.append('div')
      .attr('id', 'gesture-trial-container');

    init_rows_and_cols(trial);

    var canvas_model = init_canvas_and_expression(container, trial);

		var condition_div = container.append('div')
			.style('float', 'right')
			.style('margin-top', '10px');

    if (no_drawing(trial)) {
      init_text_input_field(display_element, trial);
    } else {
      init_mode_buttons(display_element, trial);
      init_on_mode_listener(canvas_model);
    }

    init_submit_button(display_element);
    init_on_submit_listener(display_element, trial, canvas_model, (new Date()).getTime());

    if (trial.review) {
      canvas_model.paths(paths[jsPsych.progress().current_trial_global-7]);
      canvas_model.setMode('draw');
    }

		setTimeout(function() {
      d3.selectAll('.math div.text').style('user-select', 'none');
			d3.selectAll('.show_me').style('visibility', null);
      d3.selectAll('.remove_me').remove();
		}, 000);
	};

  function init_rows_and_cols(trial) {
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
  }

  function init_canvas_and_expression(container, trial) {
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

    var div = container.append('div');

    div.append('p')
        .classed('show_me', true)
        .style({color :'#666', margin: '20px auto', 'font-size': '24px', 'visibility': 'hidden'})
        .text(trial.instructions)
      .append('div')
        .classed('show_me', true)
        .style({'font-size': '18px', 'text-align': 'center', 'visibility': 'hidden'})
        .style('background-color', 'rgba(70, 130, 180, 0.33)')
        .append('span')
        .text('')
        .style('color', 'gray');

    var gm_container = div.append('div').classed('gm-container', true).style('position', 'relative');

    var canvas = new gmath.Canvas(gm_container.node(), canvas_opts);
    div.select('.gm-canvas').selectAll('svg').style('left', '0px');
    div.select('.gm-canvas').append('div')
      .style({ 'position': 'absolute'
             , 'width': '100%'
             , 'height': '100%' })
      .classed('remove_me', true);

    derivation_opts.eq = trial.expression;
    derivation_opts.pos = {x: 'center', y: 'center'};
    derivation_opts.v_align = 'center';
    canvas.model.createDL(derivation_opts, function(dl) { dl.applyViewAlignment() });

    return canvas.model;
  }

  function init_text_input_field(container, trial) {
    for (var i = 0; i < trial.questions.length; i++) {
      var div = container.append('div')
        .attr('id', 'jspsych-survey-text-'+i)
        .classed('jspsych-survey-text-question', true)
        .on('change', unhide); // triggered when the user hits enter

      div.append('p')
        .classed('jspsych-survey-text', true)
        .text(trial.questions[i]);

      div.append('input')
        .attr('id', 'jspsych-survey-text-response-'+i)
        .attr('name', 'jspsych-survey-text-response-'+i)
        .attr('type', 'numeric')
        .attr('cols', trial.columns[i])
        .attr('rows', trial.rows[i]);
    }

    if (trial.answer && trial.answer=="none") {
      $('#jspsych-survey-text-0')[0].hidden = true
      $('#jspsych-survey-text-response-0')[0].hidden = true
    } else if (!trial.review) {
      $('#jspsych-survey-text-next')[0].hidden = true
    }

      // container.append($('<div>', {
      //   "id": 'jspsych-survey-text-' + i,
      //   "class": 'jspsych-survey-text-question',
      //   "onchange" : "unhide()" // triggered when the user hits enter
      // }));

      // // add question text
      // $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');
      // // add text box
      // $("#jspsych-survey-text-" + i).append('<input type="numeric" name="jspsych-survey-text-response-' + i + '" id="jspsych-survey-text-response-' + i + '" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></input>');
    }

  }

  function no_drawing(trial) {
    return Object.keys(trial.draw_settings).every(function(setting) { return !trial.draw_settings[setting] });
  }

  function init_mode_buttons(container, trial) {
    display_element.append($('<button>', {
      'id': 'jspsych-survey-text-draw',
      'class': 'jspsych-btn'
    }));
    $("#jspsych-survey-text-draw").html('Write your answer!');
  }

  function init_submit_button(container) {
    display_element.append($('<button>', {
      'id': 'jspsych-survey-text-next',
      'class': 'jspsych-btn'
    }));
    $("#jspsych-survey-text-next").html('Submit Answer');
  }

  function unhide() {
    $('#jspsych-survey-text-next')[0].hidden = false;
  }

  function init_on_submit_listener(display_element, trial, canvas_model, start_time) {
    $("#jspsych-survey-text-next").click(function() {
      // measure response time
      var end_time = (new Date()).getTime();
      var response_time = end_time - start_time;

      if (!trial.review) {
        paths.push(canvas_model.paths());
      } else {
        paths[jsPsych.progress().current_trial_global-7] = canvas_model.paths();
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
      jsPsych.finishTrial(trialdata);
    });
  }

  function init_mode_listener(canvas_model) {
    $("#jspsych-survey-text-draw").click(function() {
      canvas_model.setMode('draw');
      unhide();
    });
  }

	return plugin;

})();

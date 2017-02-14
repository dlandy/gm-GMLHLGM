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

		var container = d3_display_element.append('div')
      .attr('id', 'gesture-trial-container');

    init_rows_and_cols(trial);

    var canvas_model = init_canvas_and_expression(container, trial);

		var condition_div = container.append('div')
			.style('float', 'right')
			.style('margin-top', '10px');

    if (no_drawing(trial)) {
      var first_text_and_input = init_text_input_field(d3_display_element, trial);
      if (trial.answer && trial.answer == "none") {
        first_text_and_input.text.style('visibility', 'hidden');
        first_text_and_input.input.style('visibility', 'hidden');
      }
    }
    else {
      if (trial.draw_settings.on_at_start) {
        canvas_model.setMode('draw');
      }
      if (trial.draw_settings.on_off_btn) {
        init_on_off_button(d3_display_element, trial, canvas_model);
      }
      if (trial.draw_settings.mode_switch_btn) {
        init_mode_button(d3_display_element, trial, canvas_model);
      }
      if (trial.draw_settings.init_with_paths) {
        canvas_model.getElementsOfType('derivation').forEach(function(derivation) {
          derivation.getLastView().interactive(false);
        });
        canvas_model.paths(trial.shared[trial.review_idx]);
      }
    }

    var submit_btn = init_submit_button(d3_display_element);
    init_on_submit_listener(d3_display_element, submit_btn, trial, canvas_model, (new Date()).getTime());

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
                      , help_btn: false
                      , inactive_color: '#333' };

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
    var first_text_and_input = {};
    for (var i = 0; i < trial.questions.length; i++) {
      var div = container.append('div')
        .attr('id', 'jspsych-survey-text-'+i)
        .classed('jspsych-survey-text-question', true)
        .on('change', unhide); // triggered when the user hits enter

      var text = div.append('p')
        .classed('jspsych-survey-text', true)
        .text(trial.questions[i]);

      var input = div.append('input')
        .attr('id', 'jspsych-survey-text-response-'+i)
        .attr('name', 'jspsych-survey-text-response-'+i)
        .attr('type', 'numeric')
        .attr('cols', trial.columns[i])
        .attr('rows', trial.rows[i]);

      if (i === 0) {
        first_text_and_input.text = text;
        first_text_and_input.input = input;
      }
    }
    return first_text_and_input;
  }

  function no_drawing(trial) {
    return !trial.draw_settings ||
      Object.keys(trial.draw_settings).every(function(setting) { return !trial.draw_settings[setting] });
  }

  var write = 'Switch to write mode'
    , erase = 'Switch to erase mode'
    , on = 'Turn on writing'
    , off = 'Turn off writing';
  function init_on_off_button(container, trial, canvas_model) {
    var btn = container.append('button')
      .attr('id', 'jspsych-survey-on-off-btn')
      .classed('jspsych-btn', true)
      .style({ 'margin-top': '10px'
             , 'margin-right': '10px' })
      .html(on);

    btn.on('click', function() {
      var current_mode = canvas_model.setMode();
      if (current_mode === 'edit') {
        container.select('#jspsych-survey-mode-btn').html(erase);
        btn.html(off);
        canvas_model.setMode('draw');
      }
      else if (current_mode === 'draw' || current_mode === 'erase') {
        container.select('#jspsych-survey-mode-btn').html(write);
        btn.html(on);
        canvas_model.setMode('edit');
      }
    });
  }

  function init_mode_button(container, trial, canvas_model) {
    var btn = container.append('button')
      .attr('id', 'jspsych-survey-mode-btn')
      .classed('jspsych-btn', true)
      .style({ 'margin-top': '10px'
             , 'margin-right': '10px' })
      .html(canvas_model.setMode() === 'edit' ? write : erase);

    btn.on('click', function() {
      var current_mode = canvas_model.setMode();
      if (current_mode === 'edit') {
        container.select('#jspsych-survey-on-off-btn').html(off);
        btn.html(erase);
        canvas_model.setMode('draw');
      }
      else if (current_mode === 'draw') {
        container.select('#jspsych-survey-on-off-btn').html(off);
        btn.html(write);
        canvas_model.setMode('erase');
      }
      else if (current_mode === 'erase') {
        container.select('#jspsych-survey-on-off-btn').html(off);
        btn.html(erase);
        canvas_model.setMode('draw');
      }
    });
  }

  function init_submit_button(container) {
    return container.append('button')
      .attr('id', 'jspsych-survey-text-next')
      .classed('jspsych-btn', true)
      .style({ 'margin-top': '10px'
             , 'margin-right': '10px' })
      .html('Submit Answer');
  }

  function unhide() {
    d3.select('#jspsych-survey-text-next').style('visibility', 'visible');
  }

  function init_on_submit_listener(display_element, submit_btn, trial, canvas_model, start_time) {
    submit_btn.on('click', function() {
      // measure response time
      var end_time = (new Date()).getTime();
      var response_time = end_time - start_time;

      if (!no_drawing(trial)) {
        if (!trial.draw_settings.init_with_paths) {
          // paths.push(canvas_model.paths());
          trial.shared.push(canvas_model.paths());
        } else {
          // If we started with paths on the canvas, we want to update that data in case
          // the paths were changed.
          // paths[jsPsych.progress().current_trial_global-7] = canvas_model.paths();
          trial.shared[trial.review_idx] = canvas_model.paths();
        }
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
    })
  }

	return plugin;

})();

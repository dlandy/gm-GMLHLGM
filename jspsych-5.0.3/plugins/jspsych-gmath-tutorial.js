/** js-psych-gm-tutorial.js
 *  David Brokaw
 *
 * 	This plugin runs a single Grasping Math action tutorial.
 *
 * 	The problem consists of:
 * 		A description.
 * 		An expression.
 * 		If the user performs the describes action, they will move on to the next tutorial.
 * 		If the user does the incorrect action, they will have to try again.
 *
 * 	Parameters:
 * 		type: "gm-tutorial"
 * 		title: a string
 * 		tasks: an array of objects
 * 			Each object contains:
 * 			- ...
 * 			- ...
 */

jsPsych.plugins["gmath-tutorial"] = (function() {

	var plugin = {};

	function init_trial_data(trial) {
		var trial_data = gmath.extend({}, trial);
		trial_data.tasks = trial.tasks.map(function(task, idx) { return { task_idx: idx
			                                                              , eq: task.recording.options.eq
																										       					, instructions: task.instructions
																										       					, user_solution: ''
																										       					, attempts: 0, } });
		return trial_data;
	}

	function task_solution(trial, task_idx, derivation) {
		gmath.TrialLogger.trial.tasks[task_idx].attempts++;
		gmath.TrialLogger.trial.tasks[task_idx].user_solution = derivation.getLastModel().to_ascii();
	}

	plugin.trial = function(display_element, trial) { // block, part
		display_element = d3.select(display_element[0]);

		var trial_index = jsPsych.data.getLastTrialData().trial_index;
		gmath.TrialLogger.startTrial(trial_index, init_trial_data(trial));

		var container = display_element.append('div').attr('id', 'container');
		container.append('h2').text(trial.title);
    var players = []
      , tutorials_finished = 0;

		trial.tasks.forEach(function(task, i) {
			var tp = new gmath.ui.TutorialPair('#container', {
				gestureData: task.recording
			, eq: task.recording.options.eq
			, correctAnswers: task.correctAnswers
			, text: task.instructions
			, startWiggle: task.startWiggle
			, allow_restart_after_done: false
			});
			tp.events.on('done', function() {
				task_solution(trial, i, tp.dl);
        tutorials_finished++;
        if (tutorials_finished >= players.length) {
          setTimeout(function() {
            display_element.html('');
            jsPsych.finishTrial({});
          }, trial.timing_post_interaction);
        }
      }).on('retry', function() {
				task_solution(trial, i, tp.dl);
			});
			players.push(tp);
		});

		d3.selectAll('div.tutorial').append('div').style('clear', 'both');

	};

	return plugin;
})();

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

	plugin.trial = function(display_element, trial) { // block, part
		display_element = d3.select(display_element[0]);

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
        tutorials_finished++;
        if (tutorials_finished >= players.length) {
          setTimeout(function() {
            display_element.html('');
            jsPsych.finishTrial({});
          }, trial.timing_post_interaction);
        }
      });
			players.push(tp);
		});

		d3.selectAll('div.tutorial').append('div').style('clear', 'both');

	};

	return plugin;
})();

*User study to find optimal places & sizes for target boxes.*

To run the experiment, clone this repository and open the index.html page in your Chrome browser.

The experiment can also be modified in that file.  Open the index.html file in a text editor.
This interface is constructed with two custom jsPsych plugins, "gmath-tutorial" and "gmath-gesture."
There are a couple examples there.  The experiment blocks are organized into a timeline, which
can be seen at the bottom of the script.  You can add more experiment blocks in any order you like.

To add a tutorial, record an interaction here: https://graspablemath.com/unstable/recorder/, or
choose tutorials examples here: https://graspablemath.com/tutorial/index.html and tell me where you want
it to go.  If recording your own, press the button to get the recording code.  Make that the "recording"
property of the task in the tutorial timeline.  You will also have to specify what are the accepted
correct answers to the tutorial.  You can do this by trying it out on the canvas:
https://graspablemath.com/canvas/index.html.  Enter the starting expression by adding it to the end of
the url like this: "?eq=1+1", or entering it with the on-screen keyboard.  Do your work.
Right-click on the canvas and choose inspect.  In the console tool, enter this
command: "canvas.model.dls()[0].getLastModel().to_ascii()" to get the result.

The "startWiggle" option allows you to optionally have a term in the expression
wiggle, to signify interactivity.

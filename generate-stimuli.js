function generate_stimuli() {

  var base_stimuli_v2 = [
    {"expression": "4*5"
    , "target": "5*4"
    , "instructions": "Commute 4 to the right side of 5"}
  , {"expression": "4*5"
    , "target": "5*4"
    , "instructions": "Commute 5 to the left side of 4"}
  , {"expression": "4*5"
    , "target": "20"
    , "instructions": "Tap the times sign to multiply" }
  , {"expression": "4*5"
    , "target": "20"
    , "instructions": "Tap the *5 to multiply" }
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "(3+4+2)/(9+5+6)+7/8"
    , "instructions": "Commute 2 to the right side of 3" }
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "(3+2+4)/(9+5+6)+7/8"
    , "instructions": "Commute 3 to the left side of 2"}
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "(2+4+3)/(5+6+9)+7/8"
    , "instructions": "Commute 9 to the right side of 6"}
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "(2+4+3)/(6+9+5)+7/8"
    , "instructions": "Commute 6 to the left side of 9"}
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "7/8+(2+4+3)/(9+5+6)"
    , "instructions": "Drag on the division bar to commute (2+4+3)/(9+5+6) to the right side of 7/8"}
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "7/8+(2+4+3)/(9+5+6)"
    , "instructions": "Drag on the division bar to commute 7/8 to left side of (2+4+3)/(9+5+6)"}
  , {"expression": "(2+4+3)/(9+5+6)+7/8"
    , "target": "(2+4+3)/(9+5+6)+0.875"
    , "instructions": "Click the division bar to divide 7 by 8"}
  , {"expression": "8+2*5+3"
    , "target": "8+5*2+3"
    , "instructions": "Commute the 5 to the left of the 2"}
  , {"expression": "8+2*5+3"
    , "target": "8+5*2+3"
    , "instructions": "Commute the 2 to the right of the 5"}
  , {"expression": "8+2*5+3"
    , "target": "2*5+3+8"
    , "instructions": "Commute the 8 to the right of the 3"}
  , {"expression": "8+2*5+3"
    , "target": "3+8+2*5"
    , "instructions": "Commute the 3 to the left of the 8"}
  , {"expression": "8+2*5+3"
    , "target": "8+10+3"
    , "instructions": "Multiply by clicking the operator"}
  , {"expression": "x/(3+4)+y/(5+9)"
    , "target": "x/(4+3)+y/(5+9)"
    , "instructions": "Commute 3 to the right side of 4"}
  , {"expression": "x/(3+4)+y/(5+9)"
    , "target": "x/(4+3)+y/(5+9)"
    , "instructions": "Commute 4 to the left side of 3"}
  , {"expression": "8*3+5+2"
    , "target": "3*8+5+2"
    , "instructions": "Commute the 3 to the left of the 8"}
  , {"expression": "8*3+5+2"
    , "target": "3*8+5+2"
    , "instructions": "Commute the 8 to the right of the 3"}
  , {"expression": "8*3+5+2"
    , "target": "8*3+2+5"
    , "instructions": "Commute the 5 to the right of the 2"}
  , {"expression": "8*3+5+2"
    , "target": "8*3+2+5"
    , "instructions": "Commute the 2 to the left of the 5"}
  , {"expression": "7+5=4*3"
    , "target": "5+7=4*3"
    , "instructions": "Commute the 5 to the left of the 7"}
  , {"expression": "7+5=4*3"
    , "target": "5+7=4*3"
    , "instructions": "Commute the 7 to the right of the 5"}
  , {"expression": "7+5=4*3"
    , "target": "7+5=3*4"
    , "instructions": "Commute the 4 to the right of the 3"}
  , {"expression": "7+5=4*3"
    , "target": "7+5=3*4"
    , "instructions": "Commute the 3 to the left of the 4"}
  ];

  var base_stimuli_v1 = [
    {"expression": "x/(3+4)+1/2", "target": "x/(4+3)+1/2", "instructions": "Commute 3 to the right side of 4."}
  , {"expression": "x/(3+4)+1/2", "target": "x/(4+3)+1/2", "instructions": "Commute 4 to the left side of 3."}
  , {"expression": "x/(3+4)+1/2", "target": "x/7+1/2", "instructions": "In the denominator add 3 and 4 by clicking the operation."}
  , {"expression": "x/(3+4)+1/2", "target": "x/7+1/2", "instructions": "In the denominator add 3 and 4 by smooshing the numbers together."}
  , {"expression": "x/(3+4)+1/2", "target": "1/2+x/(3+4)", "instructions": "Commute the fraction x/(3+4) to the right of the other fraction."}
  , {"expression": "x/7+1/2", "target": "x/7+0.5", "instructions": "Click on the fraction bar to compute 1/2."}

  , {"expression": "(5+3y)x=4y", "target": "(5+y*3)x=4y", "instructions": "Commute 3 to the right side of y."}
  , {"expression": "(5+3y)x=4y", "target": "(3y+5)x=4y", "instructions": "Commute 5 to the right side of 3y."}
  , {"expression": "(5+3y)x=4y", "target": "x=(4y)/(5+3y)", "instructions": "Bring parenthesized term (5+3y) over to the other side of the equation."}
  , {"expression": "x(5+3y)=4y", "target": "x=(4y)/(5+3y)", "instructions": "Bring parenthesized term (5+3y) over to the other side of the equation."}
  , {"expression": "x(5+3y)=4", "target": "5+3y=4/x", "instructions": "Bring the x to the other side of the equation."}
  , {"expression": "(5+3y)x=4", "target": "5+3y=4/x", "instructions": "Bring the x to the other side of the equation."}

  , {"expression": "{abe}/{de^-2}", "target": "(ae^2be)/d", "instructions": "Move e^-2 between a and b."}
  , {"expression": "{abe}/{de^-2}", "target": "(e^2abe)/d", "instructions": "Move e^-2 into the numerator to the left of a."}
  , {"expression": "{abe}/{de^-2}", "target": "(abe)/d*1/e^-2", "instructions": "Move the e^-2 out to the right of the fraction."}
  , {"expression": "{abe}/{de^-2}", "target": "1/e^2*(abe)/d", "instructions": "Move the e^-2 out to the left of the fraction."}
  , {"expression": "{abe}/{de^-2}", "target": "(abe)/(e^-2d)", "instructions": "Commute the e^-2 to the left of d in the fraction."}
  , {"expression": "{abe}/{de^-2}", "target": "{ab(e^(1+2))}/d", "instructions": "Combine e^-2 with e in the numerator."}

  , {"expression": "x/{2y}*c", "target": "(cx)/(2y)", "instructions": "Commute the c into the numerator to the left side of x."}
  , {"expression": "x/{2y}*c", "target": "(xc)/{2y}", "instructions": "Commute the c into the numerator to the right side of x."}
  , {"expression": "x/{2y}*c", "target": "c*x/{2y}", "instructions": "Commute the c to the left of the fraction."}

  , {"expression": "(2+3+4)/9", "target": "(4+5)/9", "instructions": "Smoosh 2 with 3 and then commute the combined 2+3 to the right of the 4."}
  , {"expression": "(2+3+4)/9", "target": "(3+4)/9+2/9", "instructions": "Move the 2 to the right out of the fraction."}
  , {"expression": "(2+3+4)/9", "target": "4/9+(2+3)/9", "instructions": "Move the 4 to the left out of the fraction."}
  , {"expression": "(2+3+4)/9", "target": "(6+3)/9", "instructions": "Smoosh the 2 and 4 then commute the combined 2+4 to the left of the 3."}
  , {"expression": "(2+3+4)/9", "target": "9/9", "instructions": "Smoosh the 2 with the 3 then the 4."}
  , {"expression": "(2+3+4)/9", "target": "9/9", "instructions": "Smoosh the 4 with the 3 then the 2."}
  , {"expression": "(2+3+4)/9", "target": "(3+4+2)/9", "instructions": "Commute the 2 all the way to the right in the numerator."}
  , {"expression": "(2+3+4)/9", "target": "(4+2+3)/9", "instructions": "Commute the 4 all the way to the left in the numerator."}

  , {"expression": "4*5", "target": "20", "instructions": "Click to multiply the numbers."}
  , {"expression": "(4*5)/x", "target": "20/x", "instructions": "Click to multiply the numbers."}
  , {"expression": "x/(4*5)", "target": "x/20", "instructions": "Click to multiply the numbers."}
  ];

  var condition_1 = base_stimuli.map(function(s) { return gmath.deepCopy(s) })
    , condition_2 = base_stimuli.map(function(s) { return gmath.deepCopy(s) });

  for (var i=0; i<condition_1.length; i++) {
    condition_1[i].gravity = false;
    condition_1[i].show_target = true;
    condition_1[i].target = (new gmath.AlgebraModel(condition_1[i].target)).to_ascii();
    condition_2[i].gravity = true;
    condition_2[i].show_target = true;
    condition_2[i].target = (new gmath.AlgebraModel(condition_2[i].target)).to_ascii();
  }

  d3.shuffle(condition_1);
  d3.shuffle(condition_2);

  var result = [];

  // interleave blocks of 8 trials per condition
  var idx1 = 0, idx2 = 0;
  for (var i=0; i<2*base_stimuli.length; i++) {
    if (Math.floor(i/8) % 2 === 0 && idx1 < condition_1.length) result.push(condition_1[idx1++]);
    else result.push(condition_2[idx2++]);
  }

  return result;
}

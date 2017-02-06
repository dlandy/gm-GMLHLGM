function generate_instruction_stimuli() {

  var base_stimuli_v2 = [
    {"expression": '6 + 3 + 4 = "_" + 4'
    , "target": ""
    , "instructions": ""
    , "answer": "none"}
  , {"expression": '9 + 2 + 3 = "_" + 3'
    , "target": ""
    , "instructions": ""
    , "answer": "none"}
  , {"expression": '8 + 4 + 6 = "_" + 6'
    , "target": ""
    , "instructions": ""
    , "answer": "none"}

  ];







  var condition_1 = base_stimuli_v2.map(function(s) { return gmath.deepCopy(s) });

  for (var i=0; i<condition_1.length; i++) {
    condition_1[i].gravity = false;
    condition_1[i].show_target = false;
    condition_1[i].target = (new gmath.AlgebraModel(condition_1[i].target)).to_ascii();
     }

  //d3.shuffle(condition_1);

  var result = [];



  return condition_1;
}

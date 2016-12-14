function generate_generalization_stimuli() {

  var base_stimuli_v2 = [
    {"expression": '5 + 9 + 2 = "_" + 2'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '9 + 4 + 6 = "_" + 6'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '7 + 5 + 8 = 7 + "_"'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '8 + 6 + 9 = 8 + "_"'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '3 + 4 + 5 = "_" + 5'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '5 + 3 + 6 = 5 + "_"'
    , "target": ""
    , "instructions": "What goes in the blank?"}
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

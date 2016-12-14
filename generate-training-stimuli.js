function generate_training_stimuli() {

  var base_stimuli_v2 = [
    {"expression": '5 + 6 + 3 = "_" + 3'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '3 + 2 + 8 = "_" + 8'
    , "target": ""
    , "instructions": "What goes in the blank?"}

  , {"expression": '9 + 3 + 4 = "_" + 4'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '4 + 5 + 7 = "_" + 7'
    , "target": ""
    , "instructions": "What goes in the blank?"}

  , {"expression": '4 + 2 + 7 = "_" + 7'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '2 + 4 + 9 = "_" + 9'
    , "target": ""
    , "instructions": "What goes in the blank?"}

  , {"expression": '7 + 2 + 5 = "_" + 5'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '5 + 2 + 6 = "_" + 6'
    , "target": ""
    , "instructions": "What goes in the blank?"}

  , {"expression": '8 + 3 + 2 = "_" + 2'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '7 + 4 + 2 = "_" + 2'
    , "target": ""
    , "instructions": "What goes in the blank?"}

  , {"expression": '5 + 3 + 2 = "_" + 2'
    , "target": ""
    , "instructions": "What goes in the blank?"}
  , {"expression": '6 + 2 + 5  = "_" + 5'
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

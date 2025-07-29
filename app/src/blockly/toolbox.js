export const toolbox_get = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "動き",
      "colour": "#66CCEE",
      "contents": [
        { "kind": "block", "type": "move_1_step" },
        { "kind": "block", "type": "carry" }
      ]
    },
    {
      "kind": "category",
      "name": "制御",
      "colour": "#FFB040",
      "contents": [
        { "kind": "block", "type": "program_start" },
        { "kind": "block", "type": "controls_if" },
        { "kind": "block", "type": "controls_if_else" },
        { "kind": "block", "type": "controls_repeat_ext" },
        { "kind": "block", "type": "controls_whileUntil" },
        { "kind": "block", "type": "procedures_defnoreturn" },
        { "kind": "block", "type": "procedures_callnoreturn" },
        { "kind": "block", "type": "logic_terminate" },
      ]
    },
    
    {
        "kind": "category",
        "name": "変数",
        "colour": "#E8E8E8",
        "custom": "VARIABLE"
    },
    {
        "kind": "category",
        "name": "リスト",
        "colour": "#B090D0",
        "contents": [
            { "kind": "block", "type": "lists_create_with" },
            { "kind": "block", "type": "lists_setIndex" },
            { "kind": "block", "type": "lists_getIndex" },
        ]
    },
    {
        "kind": "category",
        "name": "取引",
        "colour": "#A0522D",
        "contents": [
            { "kind": "block", "type": "trade_sell" },
            { "kind": "block", "type": "trade_buy" },
        ]
    }
  ]
};
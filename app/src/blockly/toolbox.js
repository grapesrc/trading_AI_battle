export const toolbox_get = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "制御",
      "colour": "#FFB040",
      "contents": [
        { "kind": "block", "type": "controls_repeat_every_n_milliseconds" },
        { "kind": "block", "type": "program_start" },
        { "kind": "block", "type": "controls_if" },
        { "kind": "block", "type": "controls_if_else" },
        { "kind": "block", "type": "controls_repeat_ext" },
        { "kind": "block", "type": "controls_whileUntil" },
        { "kind": "block", "type": "procedures_defnoreturn" },
        { "kind": "block", "type": "procedures_callnoreturn" },
        { "kind": "block", "type": "logic_terminate" }
      ]
    },
    {
      "kind": "category",
      "name": "演算",
      "colour": "#59C059",
      "contents": [
        { "kind": "block", "type": "math_number" },
        { "kind": "block", "type": "math_arithmetic", "fields": { "OP": "ADD" } },
        { "kind": "block", "type": "logic_compare" },
        { "kind": "block", "type": "logic_operation" },
        { "kind": "block", "type": "logic_negate" },
        { "kind": "block", "type": "logic_boolean" },
        { "kind": "block", "type": "math_random_int" }
      ]
    },
    {
      "kind": "category",
      "name": "テキスト",
      "colour": "#5CA699",
      "contents": [
        { "kind": "block", "type": "text_print" },
        { "kind": "block", "type": "text" }
      ]
    },
    
    {
        "kind": "category",
        "name": "変数",
        "colour": "#FFA500",
        "custom": "VARIABLES_WITHOUT_CHANGE"
    },
    {
        "kind": "category",
        "name": "リスト",
        "colour": "#B090D0",
        "contents": [
            { "kind": "block", "type": "lists_create_empty" },
            { "kind": "block", "type": "lists_getIndex" },
            { "kind": "block", "type": "lists_setIndex" },
            { "kind": "block", "type": "lists_length" },
            { "kind": "block", "type": "lists_isEmpty" },
            { "kind": "block", "type": "lists_indexOf" },
            { "kind": "block", "type": "add_to_list" },
            { "kind": "block", "type": "get_from_list" },
        ]
    },
    
    {
        "kind": "category",
        "name": "Numpy",
        "colour": "#A5745B",
        "contents": [
            { "kind": "block", "type": "import_numpy" },
            { "kind": "block", "type": "np_array" },
            { "kind": "block", "type": "np_arange" },
            { "kind": "block", "type": "np_zeros" },
            { "kind": "block", "type": "np_ones" },
            { "kind": "block", "type": "np_dot" },
            { "kind": "block", "type": "np_mean" },
            { "kind": "block", "type": "np_sum" },
            { "kind": "block", "type": "np_max" },
            { "kind": "block", "type": "np_min" },
            { "kind": "block", "type": "np_get_value" }
        ]
    },
    {
        "kind": "category",
        "name": "AI",
        "colour": "#4C97FF",
        "contents": [
            { "kind": "block", "type": "import_ai_libs" },
            { "kind": "block", "type": "init_time_series" },
            { "kind": "block", "type": "create_model" },
            { "kind": "block", "type": "add_layer" },
            { "kind": "block", "type": "training_start" },
            { "kind": "block", "type": "execute_model" }
        ]
    },
    {
        "kind": "category",
        "name": "取引",
        "colour": "#A0522D",
        "contents": [
            { "kind": "block", "type": "trade_sell" },
            { "kind": "block", "type": "trade_buy" },
            { "kind": "block", "type": "get_current_price" },
            { "kind": "block", "type": "get_buy_orders" },
            { "kind": "block", "type": "get_sell_orders" },
        ]
    }
  ]
};
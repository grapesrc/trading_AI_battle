import * as Blockly from 'blockly';

const defineStaticBlocks = () => {
    // ===================================================================
    // 制御 (Control Flow)
    // ===================================================================

    Blockly.Blocks['program_start'] = {
        init: function() {
            this.appendDummyInput().appendField("プログラム実行開始");
            this.setNextStatement(true, null);
            this.setColour('#FFB040');
            this.setTooltip('プログラムの開始地点です。');
        }
    };

    Blockly.Blocks['logic_terminate'] = {
        init: function() {
            this.appendDummyInput().appendField("ロジックを終了する");
            this.setPreviousStatement(true, null);
            this.setColour('#FFB040');
        }
    };

    Blockly.Blocks['trade_sell'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(1, 1), "AMOUNT")
            .appendField("枚の")
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"]]), "COIN_NAME")
            .appendField("を、1枚あたり")
            .appendField(new Blockly.FieldNumber(100, 0), "PRICE")
            .appendField("KakakuCoinで売る");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("指定した枚数のコインを特定の価格で売ります。");
        this.setHelpUrl("");
      }
    };

    Blockly.Blocks['trade_buy'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(1, 1), "AMOUNT")
            .appendField("枚の")
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"]]), "COIN_NAME")
            .appendField("を、1枚あたり")
            .appendField(new Blockly.FieldNumber(100, 0), "PRICE")
            .appendField("KakakuCoinで買う");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("指定した枚数のコインを特定の価格で買います。");
        this.setHelpUrl("");
      }
    };

    

    Blockly.common.defineBlocksWithJsonArray([
      {
        "type": "add_to_list",
        "message0": "%1 に %2 を追加",
        "args0": [
          {
            "type": "input_value",
            "name": "LIST"
          },
          {
            "type": "input_value",
            "name": "ITEM"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 260,
        "tooltip": "リストに要素を追加します",
        "helpUrl": ""
      },
      {
        "type": "get_from_list",
        "message0": "%1 の %2 番目の要素を取得",
        "args0": [
          {
            "type": "input_value",
            "name": "LIST"
          },
          {
            "type": "input_value",
            "name": "INDEX"
          }
        ],
        "output": null,
        "colour": 260,
        "tooltip": "リストから要素を取得します",
        "helpUrl": ""
      },
      {
      "type": "move_1_step",
      "message0": "%1 に1歩移動する",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DIRECTION",
          "options": [
            [ "上", "UP" ],
            [ "下", "DOWN" ],
            [ "右", "RIGHT" ],
            [ "左", "LEFT" ]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 180,
      "tooltip": "指定した方向に1歩移動します。",
      "helpUrl": ""
    },
    {
      "type": "carry",
      "message0": "荷物を持つ",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 180,
      "tooltip": "荷物を持ち上げます。",
      "helpUrl": ""
    }
    ]);
};

export { defineStaticBlocks };
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

    Blockly.Blocks['controls_repeat_every_n_milliseconds'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(1000, 0), "MILLISECONDS")
            .appendField("ミリ秒ごとに繰り返す");
        this.appendStatementInput("DO")
            .appendField("処理");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FFB040');
        this.setTooltip("指定したミリ秒ごとに中の処理を繰り返します。");
        this.setHelpUrl("");
      }
    };

    Blockly.Blocks['trade_sell'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(1, 1), "AMOUNT")
            .appendField("枚の")
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"], ["lessonCoin1","lessonCoin1"]]), "COIN_NAME")
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

    Blockly.Blocks['get_current_price'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"], ["lessonCoin1","lessonCoin1"]]), "COIN_NAME")
            .appendField("の現在の価格");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("指定したコインの現在の市場価格を取得します。");
        this.setHelpUrl("");
      }
    };

    Blockly.Blocks['get_buy_orders'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"], ["lessonCoin1","lessonCoin1"]]), "COIN_NAME")
            .appendField("の買い注文リストを取得");
        this.setOutput(true, "Array");
        this.setColour(230);
        this.setTooltip("指定したコインの現在の買い注文リストを取得します。");
        this.setHelpUrl("");
      }
    };

    Blockly.Blocks['get_sell_orders'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"], ["lessonCoin1","lessonCoin1"]]), "COIN_NAME")
            .appendField("の売り注文リストを取得");
        this.setOutput(true, "Array");
        this.setColour(230);
        this.setTooltip("指定したコインの現在の売り注文リストを取得します。");
        this.setHelpUrl("");
      }
    };

    Blockly.Blocks['get_price_history'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"], ["lessonCoin1","lessonCoin1"]]), "COIN_NAME")
            .appendField("の価格履歴リスト");
        this.setOutput(true, "Array");
        this.setColour(230);
        this.setTooltip("価格の時系列リストを取得します。");
        this.setHelpUrl("");
      }
    };

    Blockly.Blocks['trade_buy'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(1, 1), "AMOUNT")
            .appendField("枚の")
            .appendField(new Blockly.FieldDropdown([["BeginnerCoin","BeginnerCoin"], ["ChaosCoin","ChaosCoin"], ["lessonCoin1","lessonCoin1"]]), "COIN_NAME")
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

    

    Blockly.Blocks['import_numpy'] = {
        init: function() {
            this.appendDummyInput().appendField("Numpyをインポート");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip('Numpyライブラリをインポートします。');
        }
    };

    Blockly.Blocks['import_ai_libs'] = {
        init: function() {
            this.appendDummyInput().appendField("AI予測機能をインポート");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip('AI予測に必要なライブラリをインポートします。');
        }
    };

    Blockly.Blocks['init_time_series'] = {
        init: function() {
            this.appendValueInput("DATA")
                .setCheck("Array")
                .appendField("リスト");
            this.appendDummyInput()
                .appendField("を時系列予測用に初期化");
            this.appendValueInput("LOOK_BACK")
                .setCheck("Number")
                .appendField("予想の基のデータ数:");
            this.appendValueInput("FUTURE_DAYS")
                .setCheck("Number")
                .appendField("予想するデータ数:");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("リストを時系列予測用に初期化します。");
        }
    };

    Blockly.Blocks['create_model'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("時系列予測用にモデル作成");
            this.appendStatementInput("LAYERS")
                .setCheck(null);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("時系列予測用のモデルを作成します。");
        }
    };

    Blockly.Blocks['add_layer'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("レイヤー追加: ユニット数")
                .appendField(new Blockly.FieldNumber(50, 1), "UNITS")
                .appendField("活性化関数")
                .appendField(new Blockly.FieldDropdown([
                    ["relu", "relu"],
                    ["sigmoid", "sigmoid"],
                    ["tanh", "tanh"]
                ]), "ACTIVATION");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("モデルにレイヤーを追加します。");
        }
    };

    Blockly.Blocks['execute_model'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("モデルを実行し、結果を返す");
            this.setOutput(true, "Array");
            this.setColour('#4C97FF');
            this.setTooltip("モデルを実行して予測結果を返します。");
        }
    };

    Blockly.Blocks['training_start'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("学習開始 エポック数:")
                .appendField(new Blockly.FieldNumber(1, 1), "EPOCHS");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("モデルの学習を開始します。");
        }
    };

    Blockly.Blocks['np_array'] = {
        init: function() {
            this.appendValueInput("LIST")
                .setCheck("Array")
                .appendField("Numpy配列を作成 リスト:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("リストからNumpy配列を作成します。");
        }
    };

    Blockly.Blocks['np_arange'] = {
        init: function() {
            this.appendValueInput("START")
                .setCheck("Number")
                .appendField("Numpy配列を作成 範囲:");
            this.appendValueInput("STOP")
                .setCheck("Number")
                .appendField("から");
            this.appendValueInput("STEP")
                .setCheck("Number")
                .appendField("まで、ステップ:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("指定された範囲の数値でNumpy配列を作成します。");
            this.setInputsInline(true);
        }
    };

    Blockly.Blocks['np_zeros'] = {
        init: function() {
            this.appendValueInput("SHAPE")
                .setCheck("Number")
                .appendField("Numpy配列を作成 ゼロ行列 サイズ:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("ゼロで埋められたNumpy配列を作成します。");
        }
    };

    Blockly.Blocks['np_ones'] = {
        init: function() {
            this.appendValueInput("SHAPE")
                .setCheck("Number")
                .appendField("Numpy配列を作成 1行列 サイズ:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("1で埋められたNumpy配列を作成します。");
        }
    };

    Blockly.Blocks['np_dot'] = {
        init: function() {
            this.appendValueInput("A")
                .setCheck("Array")
                .appendField("Numpy内積 配列:");
            this.appendValueInput("B")
                .setCheck("Array")
                .appendField("と");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("2つの配列の内積を計算します。");
            this.setInputsInline(true);
        }
    };

    Blockly.Blocks['np_mean'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy平均 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の平均値を計算します。");
        }
    };

    Blockly.Blocks['np_sum'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy合計 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の合計値を計算します。");
        }
    };

    Blockly.Blocks['np_max'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy最大値 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の最大値を計算します。");
        }
    };

    Blockly.Blocks['np_min'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy最小値 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の最小値を計算します。");
        }
    };

    Blockly.Blocks['np_array'] = {
        init: function() {
            this.appendValueInput("LIST")
                .setCheck("Array")
                .appendField("Numpy配列を作成 リスト:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("リストからNumpy配列を作成します。");
        }
    };

    Blockly.Blocks['np_arange'] = {
        init: function() {
            this.appendValueInput("START")
                .setCheck("Number")
                .appendField("Numpy配列を作成 範囲:");
            this.appendValueInput("STOP")
                .setCheck("Number")
                .appendField("から");
            this.appendValueInput("STEP")
                .setCheck("Number")
                .appendField("まで、ステップ:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("指定された範囲の数値でNumpy配列を作成します。");
            this.setInputsInline(true);
        }
    };

    Blockly.Blocks['np_zeros'] = {
        init: function() {
            this.appendValueInput("SHAPE")
                .setCheck("Number")
                .appendField("Numpy配列を作成 ゼロ行列 サイズ:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("ゼロで埋められたNumpy配列を作成します。");
        }
    };

    Blockly.Blocks['np_ones'] = {
        init: function() {
            this.appendValueInput("SHAPE")
                .setCheck("Number")
                .appendField("Numpy配列を作成 1行列 サイズ:");
            this.setOutput(true, "Array");
            this.setColour('#A5745B');
            this.setTooltip("1で埋められたNumpy配列を作成します。");
        }
    };

    Blockly.Blocks['np_dot'] = {
        init: function() {
            this.appendValueInput("A")
                .setCheck("Array")
                .appendField("Numpy内積 配列:");
            this.appendValueInput("B")
                .setCheck("Array")
                .appendField("と");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("2つの配列の内積を計算します。");
            this.setInputsInline(true);
        }
    };

    Blockly.Blocks['np_mean'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy平均 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の平均値を計算します。");
        }
    };

    Blockly.Blocks['np_sum'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy合計 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の合計値を計算します。");
        }
    };

    Blockly.Blocks['np_max'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy最大値 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の最大値を計算します。");
        }
    };

    Blockly.Blocks['np_min'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy最小値 配列:");
            this.setOutput(true, "Number");
            this.setColour('#A5745B');
            this.setTooltip("配列の最小値を計算します。");
        }
    };

    Blockly.Blocks['np_get_value'] = {
        init: function() {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("Numpy配列");
            this.appendValueInput("INDEX")
                .setCheck("Number")
                .appendField("のインデックス");
            this.appendDummyInput()
                .appendField("の値を取得");
            this.setOutput(true, null);
            this.setColour('#A5745B');
            this.setTooltip("Numpy配列から指定されたインデックスの値を取得します。");
            this.setInputsInline(true);
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
        "previousStatement": "Action",
        "nextStatement": "Action",
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
            "name": "LIST",
            "check": "Array"
          },
          {
            "type": "input_value",
            "name": "INDEX",
            "check": "Number"
          }
        ],
        "output": "Data",
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
      "previousStatement": "Action",
      "nextStatement": "Action",
      "colour": 180,
      "tooltip": "指定した方向に1歩移動します。",
      "helpUrl": ""
    },
    {
      "type": "carry",
      "message0": "荷物を持つ",
      "previousStatement": "Action",
      "nextStatement": "Action",
      "colour": 180,
      "tooltip": "荷物を持ち上げます。",
      "helpUrl": ""
    },
    {
      "type": "variables_set",
      "message0": "変数 %1 を %2 にする",
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "item"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "previousStatement": "Action",
      "nextStatement": "Action",
      "colour": "#FFA500",
      "tooltip": "変数に値を設定します。",
      "helpUrl": ""
    },
    {
      "type": "variables_get",
      "message0": "%1",
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "item"
        }
      ],
      "output": null,
      "colour": "#FFA500",
      "tooltip": "変数の値を取得します。",
      "helpUrl": ""
    },
    {
      "type": "lists_create_empty",
      "message0": "新しい空リスト",
      "output": "Array",
      "colour": 260,
      "tooltip": "空のリストを作成します。",
      "helpUrl": ""
    }
  ]);
};

export { defineStaticBlocks };
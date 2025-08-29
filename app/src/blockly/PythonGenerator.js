import { pythonGenerator } from 'blockly/python';

// The 'blockly/python' import already creates and exports the pythonGenerator.
// We just need to add our custom block handlers to it.

pythonGenerator.forBlock['program_start'] = function(block) {
    // The program_start block itself generates no code.
    return '#program start\n';
};

pythonGenerator.forBlock['move_1_step'] = function(block) {
    console.log(block)
    const dir = "";
    return '#move '+dir+' 1 step!\nprint("hello")';
};


pythonGenerator.forBlock['logic_terminate'] = function(block) {
    return 'break\n';
};



pythonGenerator.forBlock['trade_sell'] = function(block) {
  var amount = block.getFieldValue('AMOUNT');
  var coin_name = block.getFieldValue('COIN_NAME');
  var price = block.getFieldValue('PRICE');
  return `trade_api.sell('${coin_name}', ${price}, ${amount})\n`;
};

pythonGenerator.forBlock['trade_buy'] = function(block) {
  var amount = block.getFieldValue('AMOUNT');
  var coin_name = block.getFieldValue('COIN_NAME');
  var price = block.getFieldValue('PRICE');
  return `trade_api.buy('${coin_name}', ${price}, ${amount})\n`;
};

pythonGenerator.forBlock['get_current_price'] = function(block) {
  var coin_name = block.getFieldValue('COIN_NAME');
  return [`trade_api.get_price('${coin_name}')`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['get_buy_orders'] = function(block) {
  var coin_name = block.getFieldValue('COIN_NAME');
  return [`trade_api.get_buy_orders('${coin_name}')`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['get_sell_orders'] = function(block) {
  var coin_name = block.getFieldValue('COIN_NAME');
  return [`trade_api.get_sell_orders('${coin_name}')`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['get_price_history'] = function(block) {
  var coin_name = block.getFieldValue('COIN_NAME');
  return [`trade_api.get_klines('${coin_name}')`, pythonGenerator.ORDER_FUNCTION_CALL];
};



pythonGenerator.forBlock['add_to_list'] = function(block) {
    const list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_ATOMIC) || '[]';
    const item = pythonGenerator.valueToCode(block, 'ITEM', pythonGenerator.ORDER_ATOMIC) || 'None';
    return `${list}.append(${item})\n`;
};

pythonGenerator.forBlock['get_from_list'] = function(block) {
    const list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_ATOMIC) || '[]';
    const index = pythonGenerator.valueToCode(block, 'INDEX', pythonGenerator.ORDER_ATOMIC) || '0';
    const code = `${list}[${index}]`;
    return [code, pythonGenerator.ORDER_MEMBER];
};

pythonGenerator.forBlock['controls_repeat_every_n_milliseconds'] = function(block) {
  var milliseconds = block.getFieldValue('MILLISECONDS');
  var branch = pythonGenerator.statementToCode(block, 'DO');
  var code = `\nimport time\nwhile True:\n${branch}\n  time.sleep(${milliseconds} / 1000)\n`;
  return code;
};

pythonGenerator.forBlock['lists_create_empty'] = function(block) {
  return ['[]', pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator.forBlock['import_numpy'] = function(block) {
    return 'import numpy as np\n';
};

pythonGenerator.forBlock['import_ai_libs'] = function(block) {
    return 'import os\n'+
          'os.environ["TF_ENABLE_ONEDNN_OPTS"]="0"\n'+
           'os.environ["TF_CPP_MIN_LOG_LEVEL"]="0"\n'+
           'from sklearn.preprocessing import MinMaxScaler\n' +
           'from tensorflow.keras.models import Sequential\n' +
           'from tensorflow.keras.layers import LSTM, Dense\n';
};

pythonGenerator.forBlock['init_time_series'] = function(block) {
    var data = pythonGenerator.valueToCode(block, 'DATA', pythonGenerator.ORDER_ATOMIC) || '[]';
    var look_back = pythonGenerator.valueToCode(block, 'LOOK_BACK', pythonGenerator.ORDER_ATOMIC) || '10';
    var future_days = pythonGenerator.valueToCode(block, 'FUTURE_DAYS', pythonGenerator.ORDER_ATOMIC) || '15';
    return `\ndata = np.array(${data}).reshape(-1, 1)\nscaler = MinMaxScaler(feature_range=(0, 1))\nscaled_data = scaler.fit_transform(data)\nlook_back_days = ${look_back}\nfuture_days = ${future_days}\n\ndef create_dataset(dataset, look_back=10):\n    X, y = [], []\n    for i in range(look_back, len(dataset)):\n        X.append(dataset[i-look_back:i, 0])\n        y.append(dataset[i, 0])\n    return np.array(X), np.array(y)\n\nX, y = create_dataset(scaled_data, look_back_days)\nX = np.reshape(X, (X.shape[0], X.shape[1], 1))\n`;
};

pythonGenerator.forBlock['create_model'] = function(block) {
    var layers = pythonGenerator.statementToCode(block, 'LAYERS').replace(/^  /gm, '');
    var code = 'model = Sequential()\n' +
               'model.add(LSTM(50, return_sequences=False, input_shape=(X.shape[1], 1)))\n' +
               layers +
               'model.add(Dense(1))\n';
    return code;
};

pythonGenerator.forBlock['add_layer'] = function(block) {
    var units = block.getFieldValue('UNITS');
    var activation = block.getFieldValue('ACTIVATION');
    return `model.add(Dense(${units}, activation='${activation}'))\n`;
};

pythonGenerator.forBlock['training_start'] = function(block) {
  var epochs = block.getFieldValue('EPOCHS');
  return 'model.compile(optimizer=\'adam\', loss=\'mean_squared_error\')\n' +
         `model.fit(X, y, batch_size=1, epochs=${epochs})\n`;
};

pythonGenerator.forBlock['execute_model'] = function(block) {

  // Call a function that executes the model and returns the prediction.
  var func = [
    'def ' + pythonGenerator.FUNCTION_NAME_PLACEHOLDER_ + '():',
    '  last_sequence = scaled_data[-look_back_days:]',
    '  future_predictions = []',
    '  for _ in range(future_days):',
    '    current_input = last_sequence.reshape(1, look_back_days, 1)',
    '    predicted_value = model.predict(current_input)[0][0]',
    '    future_predictions.append(predicted_value)',
    '    new_sequence_item = np.array([[predicted_value]])',
    '    last_sequence = np.vstack((last_sequence[1:], new_sequence_item))',
    '  return scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))'
  ];
  var funcName = pythonGenerator.provideFunction_(
      'execute_model_and_predict', func);
  var code = funcName + '()';
  return [code, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_array'] = function(block) {
    var list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.array(${list})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_arange'] = function(block) {
    var start = pythonGenerator.valueToCode(block, 'START', pythonGenerator.ORDER_ATOMIC) || '0';
    var stop = pythonGenerator.valueToCode(block, 'STOP', pythonGenerator.ORDER_ATOMIC) || '10';
    var step = pythonGenerator.valueToCode(block, 'STEP', pythonGenerator.ORDER_ATOMIC) || '1';
    return [`np.arange(${start}, ${stop}, ${step})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_zeros'] = function(block) {
    var shape = pythonGenerator.valueToCode(block, 'SHAPE', pythonGenerator.ORDER_ATOMIC) || '0';
    return [`np.zeros(${shape})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_ones'] = function(block) {
    var shape = pythonGenerator.valueToCode(block, 'SHAPE', pythonGenerator.ORDER_ATOMIC) || '0';
    return [`np.ones(${shape})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_dot'] = function(block) {
    var a = pythonGenerator.valueToCode(block, 'A', pythonGenerator.ORDER_ATOMIC) || '[]';
    var b = pythonGenerator.valueToCode(block, 'B', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.dot(${a}, ${b})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_mean'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.mean(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_sum'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.sum(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_max'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.max(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_min'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.min(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_array'] = function(block) {
    var list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.array(${list})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_arange'] = function(block) {
    var start = pythonGenerator.valueToCode(block, 'START', pythonGenerator.ORDER_ATOMIC) || '0';
    var stop = pythonGenerator.valueToCode(block, 'STOP', pythonGenerator.ORDER_ATOMIC) || '10';
    var step = pythonGenerator.valueToCode(block, 'STEP', pythonGenerator.ORDER_ATOMIC) || '1';
    return [`np.arange(${start}, ${stop}, ${step})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_zeros'] = function(block) {
    var shape = pythonGenerator.valueToCode(block, 'SHAPE', pythonGenerator.ORDER_ATOMIC) || '0';
    return [`np.zeros(${shape})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_ones'] = function(block) {
    var shape = pythonGenerator.valueToCode(block, 'SHAPE', pythonGenerator.ORDER_ATOMIC) || '0';
    return [`np.ones(${shape})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_dot'] = function(block) {
    var a = pythonGenerator.valueToCode(block, 'A', pythonGenerator.ORDER_ATOMIC) || '[]';
    var b = pythonGenerator.valueToCode(block, 'B', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.dot(${a}, ${b})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_mean'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.mean(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_sum'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.sum(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_max'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.max(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_min'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    return [`np.min(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['np_get_value'] = function(block) {
    var array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_ATOMIC) || '[]';
    var index = pythonGenerator.valueToCode(block, 'INDEX', pythonGenerator.ORDER_ATOMIC) || '0';
    var code = `${array}[${index}]`;
    return [code, pythonGenerator.ORDER_MEMBER];
};

// Re-export the modified generator
export { pythonGenerator };

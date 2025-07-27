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

// Re-export the modified generator
export { pythonGenerator };
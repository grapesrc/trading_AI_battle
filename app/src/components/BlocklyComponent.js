
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Blockly from 'blockly';
import { blocklyTheme } from '../theme';
import { pythonGenerator } from '../blockly/PythonGenerator.js';

const BlocklyComponent = forwardRef(({ toolbox, workspaceConfiguration }, ref) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  useImperativeHandle(ref, () => ({
    getGeneratedCode: () => {
      if (workspace.current) {
        return pythonGenerator.workspaceToCode(workspace.current);
      }
      return '';
    }
  }));

  useEffect(() => {
    if (blocklyDiv.current) {
        if (!workspace.current) {
            const config = {
                toolbox: toolbox,
                theme: blocklyTheme,
                ...workspaceConfiguration,
            };
            workspace.current = Blockly.inject(blocklyDiv.current, config);
        } else {
            workspace.current.updateToolbox(toolbox);
        }
    }

    const handleResize = () => {
      if (workspace.current) {
        Blockly.svgResize(workspace.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [toolbox, workspaceConfiguration]);

  return <div ref={blocklyDiv} style={{ height: '100%', width: '100%' }} />;
});

export default BlocklyComponent;

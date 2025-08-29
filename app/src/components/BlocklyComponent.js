import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Blockly from 'blockly';
import * as ja from 'blockly/msg/ja';
import { blocklyTheme } from '../theme';
import { pythonGenerator } from '../blockly/PythonGenerator.js';

Blockly.setLocale(ja);

const BlocklyComponent = forwardRef(({ toolbox, workspaceConfiguration, contestId }, ref) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  const getWorkspaceKey = () => `blocklyWorkspace_${contestId || 'default'}`;

  const saveWorkspace = () => {
    if (workspace.current) {
      const json = Blockly.serialization.workspaces.save(workspace.current);
      localStorage.setItem(getWorkspaceKey(), JSON.stringify(json));
    }
  };

  const loadWorkspace = () => {
    if (workspace.current) {
      // Clear the workspace before loading
      workspace.current.clear();
      const json = localStorage.getItem(getWorkspaceKey());
      if (json) {
        try {
          Blockly.serialization.workspaces.load(JSON.parse(json), workspace.current);
        } catch (e) {
          console.error("Failed to load Blockly workspace:", e);
          localStorage.removeItem(getWorkspaceKey());
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    getGeneratedCode: () => {
      if (workspace.current) {
        return pythonGenerator.workspaceToCode(workspace.current);
      }
      return '';
    },
    saveWorkspace,
    loadWorkspace,
  }));

  // Effect for initialization and cleanup
  useEffect(() => {
    if (blocklyDiv.current && !workspace.current) {
        const config = {
            toolbox: toolbox,
            theme: blocklyTheme,
            ...workspaceConfiguration,
        };
        workspace.current = Blockly.inject(blocklyDiv.current, config);

        // Custom flyout for variables
        const variablesFlyoutCallback = function(ws) {
          const xmlList = [];
          
          const button = document.createElement('button');
          button.setAttribute('text', '変数を作成...');
          button.setAttribute('callbackKey', 'CREATE_VARIABLE');
          xmlList.push(button);

          const variableModelList = ws.getVariablesOfType('');
          variableModelList.sort(Blockly.VariableModel.compareByName);

          if (variableModelList.length > 0) {
            const gap = document.createElement('sep');
            gap.setAttribute('gap', '24');
            xmlList.push(gap);

            for (const variable of variableModelList) {
              if (Blockly.Blocks['variables_get']) {
                const getBlock = Blockly.utils.xml.createElement('block');
                getBlock.setAttribute('type', 'variables_get');
                getBlock.setAttribute('gap', '8');
                const getField = Blockly.utils.xml.createElement('field');
                getField.setAttribute('name', 'VAR');
                getField.setAttribute('id', variable.getId());
                getField.appendChild(Blockly.utils.xml.createTextNode(variable.name));
                getBlock.appendChild(getField);
                xmlList.push(getBlock);
              }
            }
            
            for (const variable of variableModelList) {
              if (Blockly.Blocks['variables_set']) {
                const setBlock = Blockly.utils.xml.createElement('block');
                setBlock.setAttribute('type', 'variables_set');
                setBlock.setAttribute('gap', '8');
                const setField = Blockly.utils.xml.createElement('field');
                setField.setAttribute('name', 'VAR');
                setField.setAttribute('id', variable.getId());
                setField.appendChild(Blockly.utils.xml.createTextNode(variable.name));
                setBlock.appendChild(setField);
                xmlList.push(setBlock);
              }
            }
          }

          return xmlList;
        };
        workspace.current.registerToolboxCategoryCallback('VARIABLES_WITHOUT_CHANGE', variablesFlyoutCallback);

        workspace.current.registerButtonCallback('CREATE_VARIABLE', (button) => {
          Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
        });

        workspace.current.addChangeListener(saveWorkspace);
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
      if (workspace.current) {
        workspace.current.removeChangeListener(saveWorkspace);
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, []);

  // Effect to update toolbox when it changes
  useEffect(() => {
    if (workspace.current) {
      workspace.current.updateToolbox(toolbox);
    }
  }, [toolbox]);

  // Effect to load workspace when contestId changes
  useEffect(() => {
    if (workspace.current && contestId) {
      loadWorkspace();
    }
  }, [contestId]);


  return <div ref={blocklyDiv} style={{ height: '100%', width: '100%' }} />;
});

export default BlocklyComponent;
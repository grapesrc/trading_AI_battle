
import { createTheme } from '@mui/material/styles';
import * as Blockly from 'blockly/core';

// MUI Theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#007ACC', // アクセントカラー1
    },
    secondary: {
      main: '#4AA0DC', // アクセントカラー2
    },
    background: {
      default: '#E0EBF7', // メインベースカラー
      paper: '#F0F0FF',    // サブベースカラー
    },
    text: {
      primary: '#1A2A3A',   // テキストカラー（メイン）
      secondary: '#50677C', // テキストカラー（補足）
    },
    error: {
      main: '#E04040',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#D0EBF7',
          },
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#FFFFFF',
        },
      }
    },
    MuiTable: {
        styleOverrides: {
            root: {
                backgroundColor: '#FFFFFF',
            }
        }
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: '#F0F8FC',
                },
            }
        }
    }
  },
});

// Blockly Theme
const blocklyTheme = Blockly.Theme.defineTheme('custom-theme', {
  'base': Blockly.Themes.Zelos,
  'blockStyles': {
    'movement_blocks': { 'colourPrimary': '#66CCEE' },
    'control_blocks': { 'colourPrimary': '#FFB040' },
    'condition_blocks': { 'colourPrimary': '#80C880' },
    'special_blocks': { 'colourPrimary': '#B090D0' },
    'value_blocks': { 'colourPrimary': '#E8E8E8' },
    'list_blocks': { 'colourPrimary': '#B090D0' },
    'variable_blocks': { 'colourPrimary': '#E8E8E8' },
  },
  'categoryStyles': {
    'movement_category': { 'colour': '#66CCEE' },
    'control_category': { 'colour': '#FFB040' },
    'condition_category': { 'colour': '#80C880' },
    'special_category': { 'colour': '#B090D0' },
    'value_category': { 'colour': '#E8E8E8' },
    'list_category': { 'colour': '#B090D0' },
    'variable_category': { 'colour': '#E8E8E8' },
  },
  'componentStyles': {
    'workspaceBackgroundColour': '#E0F8F7',
    'toolboxBackgroundColour': '#A2EEEE',
    'flyoutBackgroundColour': '#A2EEEE',
    'scrollbarColour': '#4AA0DC',
    'insertionMarkerColour': '#FFFFFF',
    'insertionMarkerOpacity': 0.3,
  }
});

export { muiTheme, blocklyTheme };

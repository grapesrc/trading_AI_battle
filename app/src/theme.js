import { createTheme } from '@mui/material/styles';
import * as Blockly from 'blockly/core';

// Zenn.dev inspired color palette
const zennPalette = {
  primary: '#3ea8ff',       // Accent blue
  backgroundDefault: '#EEFAFF', // Light blue background
  backgroundPaper: '#ffffff',   // White for cards, etc.
  textPrimary: '#222222',       // Dark gray for main text
  textSecondary: '#555555',
  divider: '#eeeeee',
  info: '#20c997',
};

// MUI Theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: zennPalette.primary,
    },
    secondary: {
      main: zennPalette.primary, // Using the same for consistency
    },
    background: {
      default: zennPalette.backgroundDefault,
      paper: zennPalette.backgroundPaper,
    },
    text: {
      primary: zennPalette.textPrimary,
      secondary: zennPalette.textSecondary,
    },
    divider: zennPalette.divider,
    error: {
      main: '#E04040',
    },
    info: {
      main: zennPalette.info,
    },
  },
  typography: {
    fontFamily: [
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
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
          backgroundColor: zennPalette.backgroundPaper,
          border: `1px solid ${zennPalette.divider}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Buttons with normal casing
          borderRadius: '8px',
        },
        containedPrimary: {
          color: '#FFFFFF',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      }
    },
    MuiTable: {
        styleOverrides: {
            root: {
                backgroundColor: zennPalette.backgroundPaper,
            }
        }
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
                '&:hover': {
                    backgroundColor: 'rgba(62, 168, 255, 0.1)',
                }
            }
        }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: zennPalette.backgroundPaper,
          color: zennPalette.textPrimary,
          boxShadow: 'none',
          borderBottom: `1px solid ${zennPalette.divider}`,
        }
      }
    }
  },
});

// Blockly Theme (keeping the original for now)
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
    'workspaceBackgroundColour': '#F0F7FA',
    'toolboxBackgroundColour': '#E9EEF2',
    'flyoutBackgroundColour': '#E0E6EB',
    'scrollbarColour': '#B4BCC2',
    'insertionMarkerColour': '#4A90E2',
    'insertionMarkerOpacity': 0.3,
  }
});

export { muiTheme, blocklyTheme };
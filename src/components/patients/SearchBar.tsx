import React from 'react';
import { 
  TextField, 
  InputAdornment, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Buscar por nome, telefone, email ou CPF..." 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '400px',
        margin: '0 auto',
        '& .MuiTextField-root': {
          width: '100%',
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: isMobile ? '8px' : '12px',
          height: isMobile ? '40px' : '48px',
          fontSize: isMobile ? '14px' : '16px',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#8b5cf6',
            borderWidth: '2px',
          },
        },
        '& .MuiInputBase-input': {
          color: '#ffffff',
          padding: isMobile ? '8px 12px' : '12px 16px',
          '&::placeholder': {
            color: '#64748b',
            opacity: 1,
          },
        },
        '& .MuiInputAdornment-root': {
          color: '#64748b',
        },
      }}
    >
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  fontSize: isMobile ? '18px' : '20px',
                  color: '#64748b'
                }} 
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};


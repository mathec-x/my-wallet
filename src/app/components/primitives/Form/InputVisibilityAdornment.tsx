import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';

const InputVisibilityAdornment = () => {
  const [showPassword, setShowPassword] = useState(false);

  // sim!! saudades de js puro, nao to a fim de usar estados complexos agora


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(true);
    const closest = event.currentTarget.closest('.MuiInputBase-root')?.querySelector('input') as HTMLInputElement;
    closest.type = 'text';
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(false);
    const closest = event.currentTarget.closest('.MuiInputBase-root')?.querySelector('input') as HTMLInputElement;
    closest.type = 'password';
  };

  const handleTouchDownPassword = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(true);
    const closest = event.currentTarget.closest('.MuiInputBase-root')?.querySelector('input') as HTMLInputElement;
    closest.type = 'text';
  };

  const handleTouchUpPassword = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(false);
    const closest = event.currentTarget.closest('.MuiInputBase-root')?.querySelector('input') as HTMLInputElement;
    closest.type = 'password';
  };

  return (
    <InputAdornment position="end">
      <IconButton
        disableRipple
        tabIndex={-1}
        aria-label={showPassword ? 'hide the password' : 'display the password'}
        // onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        onMouseUp={handleMouseUpPassword}
        onTouchStart={handleTouchDownPassword}
        onTouchEnd={handleTouchUpPassword}
        edge="end"
      >{!showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );
};


export default InputVisibilityAdornment;
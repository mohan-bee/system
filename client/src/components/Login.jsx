import React, { useRef } from 'react';

const Login = ({setPage}) => {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      } else {
        checkPin();
      }
    } else {
      e.target.value = ''; 
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const checkPin = () => {
    const pin = inputRefs.current.map(input => input.value).join('');
    console.log('Entered PIN:', pin);
    if (pin === import.meta.env.VITE_API_PIN) {
      setPage("dashboard")
    } else {
      alert('Incorrect PIN.');
    }
  };

  return (
    <div className='flex h-screen items-center justify-center flex-col gap-2'>
      <label className='text-lg '>Enter the Authorised PIN</label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <input 
            key={i}
            type="text"
            className='bg-amber-200 rounded-sm'
            maxLength="1"
            style={{ width: '40px', height: '40px', fontSize: '24px', textAlign: 'center' }}
            ref={el => inputRefs.current[i] = el}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
      <p className='text-sm text-gray-500'>This is coded with claude ai</p>
    </div>
  );
};

export default Login;

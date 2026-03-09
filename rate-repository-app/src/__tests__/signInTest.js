import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInForm } from '../components/SignIn';

describe('SignInForm', () => {
  it('calls onSubmit with correct values when form is submitted', async () => {
    const onSubmitMock = jest.fn();

    render(<SignInForm onSubmit={onSubmitMock} />);

    fireEvent.changeText(screen.getByTestId('usernameInput'), 'testuser');
    fireEvent.changeText(screen.getByTestId('passwordInput'), 'password123');
    fireEvent.press(screen.getByTestId('signInButton'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock.mock.calls[0][0]).toEqual({
        username: 'testuser',
        password: 'password123',
      });
    });
  });
});
import { View, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { CREATE_USER } from '../../graphql/mutations';
import Text from '../../hooks/Text';
import FormikTextInput from '../FormikTextInput';
import theme from '../../hooks/Theme';
import useSignIn from '../../hooks/useSignIn';

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .required('Username is required')
    .min(5, 'Username must be at least 5 characters long')
    .max(30, 'Username cannot be longer than 30 characters'),

  password: Yup.string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters long')
    .max(30, 'Password cannot be longer than 30 characters'),

  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 15,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

const SignUpForm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { userName, password } = values;

    try {
      setErrorMessage(null);

      await createUser({
        variables: {
          user: {
            username: userName,
            password,
          },
        },
      });

      await signIn({
        username: userName,
        password,
      });

      navigate('/');

    } catch (e) {
      const message =
        e.graphQLErrors?.[0]?.message ||
        'Something went wrong. Please try again.';

      setErrorMessage(message);
    }
  };

  return (
    <Formik
      initialValues={{
        userName: '',
        password: '',
        passwordConfirmation: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <View style={styles.container}>

          {errorMessage && (
            <Text style={{ color: 'red', marginTop: 10 }}>
              {errorMessage}
            </Text>
          )}

          <FormikTextInput
            name="userName"
            placeholder="Username"
          />

          <FormikTextInput
            name="password"
            placeholder="Password"
            secureTextEntry
          />

          <FormikTextInput
            name="passwordConfirmation"
            placeholder="Confirm password"
            secureTextEntry
          />

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text fontWeight="bold" style={{ color: 'white' }}>
              Sign Up
            </Text>
          </Pressable>

        </View>
      )}
    </Formik>
  );
};

export default SignUpForm;
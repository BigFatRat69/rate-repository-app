import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Text from '../../hooks/Text';
import theme from '../../hooks/Theme';
import useSignIn from '../../hooks/useSignIn';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  formContainer: {
    width: '50%',
  },
  input: {
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    borderRadius: 6,
    padding: 14,
    marginBottom: 8,
    fontSize: 18,
    fontFamily: theme.fonts.main,
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: theme.fontWeights.bold,
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const usernameError =
    formik.touched.username && formik.errors.username;
  const passwordError =
    formik.touched.password && formik.errors.password;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.formContainer}>
        <TextInput
          testID="usernameInput"
          style={[styles.input, usernameError && styles.inputError]}
          placeholder="Username"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
        />
        {usernameError && (
          <Text style={styles.errorText}>
            {formik.errors.username}
          </Text>
        )}

        <TextInput
          testID="passwordInput"
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Password"
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          secureTextEntry
          onBlur={formik.handleBlur('password')}
        />
        {passwordError && (
          <Text style={styles.errorText}>
            {formik.errors.password}
          </Text>
        )}

        <Pressable testID="signInButton" style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async values => {
    console.log(values)
    await signIn(values);
    navigate('/');
  };

  return <SignInForm onSubmit={onSubmit} />;
};

export default SignIn;

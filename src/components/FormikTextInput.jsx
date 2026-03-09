
import { TextInput, StyleSheet } from 'react-native';
import { useField } from 'formik';
import Text from '../hooks/Text';
import theme from '../hooks/Theme';

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  error: {
    color: 'red',
    marginBottom: 5,
  },
});

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <>
      <TextInput
        style={styles.input}
        value={field.value}
        onChangeText={value => helpers.setValue(value)}
        {...props}
      />
      {meta.touched && meta.error && <Text style={styles.error}>{meta.error}</Text>}
    </>
  );
};

export default FormikTextInput;
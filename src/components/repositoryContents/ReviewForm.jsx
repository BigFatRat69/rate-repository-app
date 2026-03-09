import { View, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { CREATE_REVIEW } from '../../graphql/mutations';
import Text from '../../hooks/Text';
import FormikTextInput from '../FormikTextInput';
import theme from '../../hooks/Theme';

const validationSchema = Yup.object().shape({
  ownerName: Yup.string()
    .required('Repository owner username is required'),

  repositoryName: Yup.string()
    .required('Repository name is required'),

  rating: Yup.number()
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),

  text: Yup.string()
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

const ReviewForm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [createReview] = useMutation(CREATE_REVIEW);

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const { data } = await createReview({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(rating),
            text,
          },
        },
      });

      const repositoryId = data.createReview.repositoryId;

      navigate(`/repository/${repositoryId}`);

  } catch (e) {
    if (e.graphQLErrors?.length > 0) {
      const code = e.graphQLErrors[0].extensions?.code;

      if (code === 'REPOSITORY_ALREADY_REVIEWED') {
        setErrorMessage('You Have Already Reviewed This Repository.');
      } if (code === 'GITHUB_REPOSITORY_NOT_FOUND') {
        setErrorMessage('Github Repository Not Found. Please Check Repository Name And Username For Typos')
      } else {
        setErrorMessage(e.graphQLErrors[0].message);
      }
    } else {
      setErrorMessage('Something went wrong. Please try again.');
    }
  }
  };

  return (
    <Formik
      initialValues={{
        ownerName: '',
        repositoryName: '',
        rating: '',
        text: '',
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
            name="ownerName"
            placeholder="Repository owner's GitHub username"
          />

          <FormikTextInput
            name="repositoryName"
            placeholder="Repository name"
          />

          <FormikTextInput
            name="rating"
            placeholder="Rating between 0 and 100"
            keyboardType="numeric"
          />

          <FormikTextInput
            name="text"
            placeholder="Review"
            multiline
          />

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text fontWeight="bold" style={{ color: 'white' }}>
              Create review
            </Text>
          </Pressable>

        </View>
      )}
    </Formik>
  );
};

export default ReviewForm;
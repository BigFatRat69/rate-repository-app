import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';


import RepositoryList from './components/repositoryContents/RepositoryList';
import AppBar from './components/AppBar';
import SignIn from './components/userManagement/SignIn';
import SignUpForm from './components/userManagement/SignUpForm';
import SingleRepository from './components/repositoryContents/SingleRepository';
import ReviewForm from './components/repositoryContents/ReviewForm';
import MyReviews from './components/repositoryContents/MyReviews';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar/>
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUpForm />}/>
        <Route path="/repository/:id" element={<SingleRepository />} />
        <Route path="/reviewForm" element={<ReviewForm />} />
        <Route path="/myreviews" element={<MyReviews />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;
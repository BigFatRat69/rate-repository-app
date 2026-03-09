import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from "react-router-native";
import { useQuery, useApolloClient } from '@apollo/client';

import Text from '../hooks/Text';
import { ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 20,
    backgroundColor: '#24292e',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  }
});

const AppBarTab = ({ textToShow, to }) => {
  return (
    <Link to={to} component={Pressable} style={styles.tab}>
      <Text color="primary">{textToShow}</Text>
    </Link>
  );
};


const AppBar = () => {
  const { data } = useQuery(ME);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const handleSignOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  const user = data?.me;

  return (
    <View style={styles.flexContainer}>
      <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row' }}>
        {user ? (
          <Pressable onPress={handleSignOut} style={styles.tab}>
            <Text color="primary">Sign out</Text>
          </Pressable>
        ) : (
          <>
            <AppBarTab textToShow="Sign up" to="/signup"/>,
            <AppBarTab textToShow="Sign In" to="/signin" />
          </>
        )}
        <AppBarTab textToShow="Repositories" to="/" />
        {data && data.me && (
          <>
            <AppBarTab textToShow="Create a review" to="/reviewform" />
            <AppBarTab textToShow="My reviews" to="/myreviews" />
          </>
        )}
      </ScrollView>
    </View>
  )
};

export default AppBar;
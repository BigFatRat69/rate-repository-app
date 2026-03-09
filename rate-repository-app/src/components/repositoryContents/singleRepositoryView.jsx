import { View, StyleSheet, Image, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
import Text from '../../hooks/Text';
import theme from '../../hooks/Theme';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  language: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
});

const formatCount = (count) =>
  count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count.toString();

const SingleRepositoryView = ({ item, showGitHubButton }) => {

  const openGitHub = () => {
    Linking.openURL(item.url);
  };

  return (
    <View testID="SingleRepositoryView" style={styles.container}>
      
      <View style={styles.topRow}>
        <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.info}>
          <Text fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text color="textSecondary">
            {item.description}
          </Text>
          <Text style={styles.language}>
            {item.language}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text fontWeight="bold">
            {formatCount(item.stargazersCount)}
          </Text>
          <Text color="textSecondary">Stars</Text>
        </View>

        <View style={styles.statItem}>
          <Text fontWeight="bold">
            {formatCount(item.forksCount)}
          </Text>
          <Text color="textSecondary">Forks</Text>
        </View>

        <View style={styles.statItem}>
          <Text fontWeight="bold">
            {formatCount(item.reviewCount)}
          </Text>
          <Text color="textSecondary">Reviews</Text>
        </View>

        <View style={styles.statItem}>
          <Text fontWeight="bold">
            {item.ratingAverage}
          </Text>
          <Text color="textSecondary">Rating</Text>
        </View>
      </View>

      {showGitHubButton && (
        <Pressable style={styles.button} onPress={openGitHub}>
          <Text fontWeight="bold" style={{ color: 'white' }}>
            Open in GitHub
          </Text>
        </Pressable>
      )}

    </View>
  );
};

export default SingleRepositoryView;
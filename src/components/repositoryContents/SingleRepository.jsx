import { FlatList, View, StyleSheet } from 'react-native';
import { useParams } from 'react-router-native';

import SingleRepositoryView from './singleRepositoryView';
import Text from '../../hooks/Text';
import theme from '../../hooks/Theme';
import useRepository from '../../hooks/useRepository';

const styles = StyleSheet.create({
  separator: { height: 10 },
  reviewContainer: { backgroundColor: 'white', padding: 15 },
  reviewRow: { flexDirection: 'row' },
  ratingCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  reviewContent: { flex: 1 },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

const ReviewItem = ({ review }) => (
  <View style={styles.reviewContainer}>
    <View style={styles.reviewRow}>
      <View style={styles.ratingCircle}>
        <Text fontWeight="bold" color="primary">{review.rating}</Text>
      </View>
      <View style={styles.reviewContent}>
        <Text fontWeight="bold">{review.user.username}</Text>
        <Text color="textSecondary">{formatDate(review.createdAt)}</Text>
        <Text>{review.text}</Text>
      </View>
    </View>
  </View>
);

const SingleRepository = () => {
  const { id } = useParams();

  const { repository, loading, fetchMore } = useRepository(id, 3);

  if (loading || !repository) return null;

  const reviews = repository.reviews
    ? repository.reviews.edges.map(edge => edge.node)
    : [];

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={() => (
        <SingleRepositoryView item={repository} showGitHubButton={true} />
      )}
    />
  );
};

export default SingleRepository;
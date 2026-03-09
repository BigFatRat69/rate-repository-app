import { FlatList, View, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-native';
import { ME } from '../../graphql/queries';
import { DELETE_REVIEW } from '../../graphql/mutations';
import Text from '../../hooks/Text';
import theme from '../../hooks/Theme';

const styles = StyleSheet.create({
  separator: { height: 10 },
  reviewContainer: {
    backgroundColor: 'white',
    padding: 15,
  },
  reviewRow: {
    flexDirection: 'row',
  },
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
  reviewContent: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

const ReviewDeleteConfirmation = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Are you sure you want to delete the review?</Text>

          <Pressable onPress={onConfirm}>
            <Text>Delete</Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text>Cancel</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
};

const MyReviews = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const { data, loading, error, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading) return null;
  if (error) return <Text>Error loading reviews.</Text>;

  const reviews = data?.me?.reviews
    ? data.me.reviews.edges.map(edge => edge.node)
    : [];

  const handleGoToRepository = (repoId) => {
    if (!repoId) return;
    navigate(`/repository/${repoId}`);
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview({ variables: { id: selectedReviewId } });
      setModalVisible(false);
      setSelectedReviewId(null);
      refetch();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to delete review.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewRow}>
        <View style={styles.ratingCircle}>
          <Text fontWeight="bold" color="primary">{item.rating}</Text>
        </View>

        <View style={styles.reviewContent}>
          <Text fontWeight="bold">{item.repository.fullName}</Text>
          <Text color="textSecondary">{formatDate(item.createdAt)}</Text>
          <Text>{item.text}</Text>

          <View style={styles.buttonRow}>

            <Pressable
              style={styles.button}
              onPress={() => handleGoToRepository(item.repository.id)}
            >
              <Text color="white">View Repository</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.deleteButton]}
              onPress={() => {
                setSelectedReviewId(item.id);
                setModalVisible(true);
              }}
            >
              <Text color="white">Delete Review</Text>
            </Pressable>

          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>

      <ReviewDeleteConfirmation
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDeleteReview}
      />

      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

    </View>
  );
};

export default MyReviews;
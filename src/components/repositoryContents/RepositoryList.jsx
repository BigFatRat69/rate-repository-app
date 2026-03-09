import { FlatList, View, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';

import RepositoryItem from './RepositoryItem';
import useRepositories from '../../hooks/useRepositories';
import Text from '../../hooks/Text';


const styles = StyleSheet.create({
  separator: { height: 10 },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#0366d6',
    borderRadius: 5,
    alignItems: 'center',
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
  option: {
    padding: 10,
  },
});

const RepositoryListHeader = ({ searchKeyword, setSearchKeyword }) => (
  <View>
    <TextInput
      placeholder="Search repositories..."
      value={searchKeyword}
      onChangeText={setSearchKeyword}
      style={{
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 5,
      }}
    />
  </View>
);

const FilterPopup = ({ visible, onClose, onSelect }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Pressable style={styles.option} onPress={() => onSelect('LATEST')}>
          <Text>Latest repositories</Text>
        </Pressable>
        <Pressable style={styles.option} onPress={() => onSelect('HIGHEST')}>
          <Text>Highest rated repositories</Text>
        </Pressable>
        <Pressable style={styles.option} onPress={() => onSelect('LOWEST')}>
          <Text>Lowest rated repositories</Text>
        </Pressable>
        <Pressable style={[styles.option, { marginTop: 10 }]} onPress={onClose}>
          <Text style={{ color: 'red' }}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const RepositoryList = () => {
  const [order, setOrder] = useState('LATEST');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch] = useDebounce(searchKeyword, 500);

  const orderMap = {
    LATEST: { orderBy: 'CREATED_AT', orderDirection: 'DESC' },
    HIGHEST: { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' },
    LOWEST: { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' },
  };

  const { orderBy, orderDirection } = orderMap[order];

  const { repositories } = useRepositories({
    orderBy,
    orderDirection,
    searchKeyword: debouncedSearch
  });

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  const ItemSeparator = () => <View style={styles.separator} />;

  const handleSelectOrder = (selected) => {
    setOrder(selected);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text fontWeight="bold" style={{ color: 'white' }}>
          Sort Repositories
        </Text>
      </Pressable>

      <FilterPopup
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectOrder}
      />

    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={
        <RepositoryListHeader
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
    />
    </View>
  );
};

export default RepositoryList;
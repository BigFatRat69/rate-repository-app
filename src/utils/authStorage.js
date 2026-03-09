import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  getKey() {
    return `${this.namespace}:accessToken`;
  }

  async getAccessToken() {
    return await AsyncStorage.getItem(this.getKey());
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(this.getKey(), accessToken);
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(this.getKey());
  }
}

export default AuthStorage;

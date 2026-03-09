import { useMutation, gql, useApolloClient } from "@apollo/client";
import useAuthStorage from "../hooks/useAuthStorage";

const AUTHENTICATE = gql`
  mutation Authenticate($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      accessToken
      user {
        id
        username
      }
    }
  }
`;

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage();

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({
      variables: {
        credentials: { username, password },
      },
    });

    const accessToken = data.authenticate.accessToken;

    await authStorage.setAccessToken(accessToken);
    await apolloClient.resetStore();

    return data;
  };

  return [signIn, result];
};

export default useSignIn;

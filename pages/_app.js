import React from 'react';
import App, { Container } from 'next/app';
import withApolloClient from '../withApollo';
import { ApolloProvider } from 'react-apollo';

const MyApp = ({ Component, pageProps, apolloClient }) => (
  <Container>
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  </Container>
);

export default withApolloClient(MyApp)
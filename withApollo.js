import React from 'react';
import { Container } from 'next/app';
import Head from 'next/head';
import { ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { ApolloProvider, getDataFromTree } from 'react-apollo';

if (!process.browser) global.fetch = fetch;

function createClient(initialState) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'same-origin'
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default (App) => {
  return class Apollo extends React.Component {
    static async getInitialProps (ctx) {
      const { Component, router } = ctx;
      let appProps = {};

      if (App.getInitialProps) appProps = await App.getInitialProps(ctx);

      const apollo = createClient();

      if (!process.browser) {
        try {
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          )
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState
      }
    }

    constructor (props) {
      super(props);

      this.apolloClient = createClient(props.apolloState);
    }

    render () {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }
}
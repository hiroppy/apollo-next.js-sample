import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const GET_USER = gql`
  {
    user {
      id
      name
    }
  }
`;

export default () => {
  return (
    <Query query={GET_USER}>
      {({ loading, data, error}) => {
        if (error) return 'error';
        if (loading) return 'Loading...';
        return `${data.user.name} - ${data.user.id}`;
      }}
    </Query>
  );
};
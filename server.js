import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";
const API_KEY = "6be4e7cd599507ab6b764f0bfe5b22b7";
// graphQL의 type을 정해주기
const typeDefs = gql`
    type Genre {
        id: Int!
        name: String!
    }
    type Movie {
       id: ID!
       title: String!
       poster_path: String!
       runtime: Int! 
       release_date: String!
       overview: String!
       videoUrl: VideoMovie
       similarMovies: [SimilarMovie!]!
  }
   type VideoMovie{
       id: ID!
       key: String!
   }
   type SimilarMovie {
       id: ID!
       title: String!
       poster_path: String!
   }
    type Query {
        allGenreMovies(genreID: String!):[Movie!]!
        allGenres: [Genre!]!
        movie(id: String!): Movie!
    }
`

// typeDefs에서 사용한 애들을 resolvers에서 정의해주는 것!
const resolvers = {
    Query: {
        allGenres() {
            return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ko-KR`)
            .then((r) => r.json())
            .then((json) => json.genres);
        },
        allGenreMovies(_ , { genreID } ) {
            return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genreID}&include_video=true`)
              .then((r) => r.json())
              .then((json) => json.results);
        },
        movie(_, { id }) {
            return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`)
              .then((r) => r.json())
              .then((json) => json);
        },
    },
    Movie: {
        videoUrl({id}){
            // return VideoMovie;
            return fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=ko-KR`)
            .then((r) => r.json())
            .then((json) => json.results[0]);
        },
        similarMovies({id}){
            return fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=ko-KR`)
            .then((r) => r.json())
            .then((json) => json.results);
        },
    }
}

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({url}) => {
    console.log( `Running on the ${url}`)

})
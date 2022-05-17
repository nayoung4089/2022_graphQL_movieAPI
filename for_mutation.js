import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";
const API_KEY = "6be4e7cd599507ab6b764f0bfe5b22b7";

// tweets가 보여주는 내용 담당
let tweets = [
    {
        id:"1",
        text:"hello",
        userID:"1"
    },
    {
        id:"2",
        text:"hello2",
        userID:"2"
    },
    {
        id:"3",
        text:"hello3",
        userID:"1"
    }
]

let users = [
    {
        id:"1",
        firstName:"Choi",
        lastName:"NY"
    },
    {
        id:"2",
        firstName:"Choi",
        lastName:"NYYYY"
    },

]

// graphQL의 type을 정해주기
const typeDefs = gql`
    type User {
        id: ID!
        """
        hello
        """
        firstName:String!
        lastName: String!
        fullName: String
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
        userID: String!
    }
    type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
    type Query {
        allGenreMovies(genre: Genre!):[Movie!]!
        allUsers: [User!]!
        allTweets: [Tweet!]!
        movie(id: String!): Movie
        tweet(id: ID!): Tweet!
        ping: String!
    }
    type Mutation {
        postTweet(text:String!, userID: ID!): Tweet!
        deleteTweet(id:ID!): Boolean!
    }
`
// Query - tweet에 id를 부여함으로써 내가 원하는 친구 하나만 보여줄 수 있게 만들어준다

// typeDefs에서 사용한 애들을 resolvers에서 정의해주는 것!
const resolvers = {
    Query: {
        allGenreMovies(genres) {
            return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genres}&include_video=true`)
              .then((r) => r.json())
              .then((json) => json.data.movies);
        },
        movie(_, { id }) {
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
              .then((r) => r.json())
              .then((json) => json.data.movie);
          },
        allUsers(){
            return users;
        },
        allTweets(){
            return tweets;
        },
        tweet(root, {id}){
            return tweets.find(tweet => tweet.id === id);
        },
        ping(){
            return "pong";
        },
    },
    Mutation:{
        postTweet(_, {text, userID}){
            const newTweet = {
                id: tweets.length + 1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}){
            const tweet = tweets.find(tweet => tweet.id === id);
            if (!tweet){
                return false;
            }else{
                tweets = tweets.filter( tweet => tweet.id !== id);
                return true;
            }
        }
    },
    User:{
        fullName(){
            return "hi";
        }
    },
    Tweet:{
        author({userID}){
            return users.find(user => user.id === userID);
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({url}) => {
    console.log( `Running on the ${url}`)

})
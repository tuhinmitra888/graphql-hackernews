const { ApolloServer } = require('apollo-server');

const fs = require('fs');
const path = require('path');



let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

// 2
let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      var index = parseInt(args.id.toString().replace('link-', ''))
      return links[index]
    }
  },
  Mutation: {
    // 2
    post: (parent, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      var linkToBeUpdated;

      var counter = 0;
      while(counter < links.length){
        if(links[counter].id.toString() === args.id.toString()){
           linkToBeUpdated = links[counter]
           break
        }
        counter++
      }
      linkToBeUpdated.url = args.url
      linkToBeUpdated.description = args.description
      return linkToBeUpdated
    },
    deleteLink: (parent, args) => {
      var linkToBeDeleted;

      var counter = 0;
      while(counter < links.length){
        if(links[counter].id.toString() === args.id.toString()){
          linkToBeDeleted = links[counter]
          links.splice(counter, 1)
          break
        }
        counter++
      }
      return linkToBeDeleted
    },
  }
} 

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );